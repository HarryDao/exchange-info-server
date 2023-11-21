"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobsForFetchingHistoricalData = void 0;
const axios_1 = __importDefault(require("axios"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const configs_1 = require("../../configs");
const data_1 = require("../../data");
const createHistoricalDataUrl = ({ symbol }) => {
    return `${configs_1.TWELVE_API_URL}/${configs_1.TWELVE_TIME_SERIES_ENDPOINT}?apikey=${configs_1.TWELVE_DATA_API_TOKEN}&symbol=${symbol}&interval=${configs_1.HISTORICAL_API_TWELVE_DATA_UNIT}&outputsize=${configs_1.LONG_HISTORICAL_LENGTH}`;
};
const createJobsForFetchingHistoricalData = (symbols, isFirstTime) => {
    return symbols.map((symbolData) => {
        const job = {
            request: async () => {
                const url = createHistoricalDataUrl(symbolData);
                const { data } = await axios_1.default.get(url);
                return data;
            },
            isRequestSuccessful(data) {
                return data.status === 'ok';
            },
            onRequestError(error) {
                console.error(`Error with fetching Twelve historical data for ${symbolData.symbol}: ${error}`);
            },
            onRequestSuccessful: ({ meta, values }) => {
                const { exchange_timezone } = meta;
                const candles = [];
                values.forEach(({ datetime, open, high, low, close }) => {
                    const time = moment_timezone_1.default.tz(datetime, exchange_timezone);
                    candles.push({
                        close: Number(close),
                        open: Number(open),
                        high: Number(high),
                        low: Number(low),
                        time: time.valueOf(),
                    });
                });
                (0, data_1.setHistoricalData)(symbolData.symbol, candles);
                console.log(`Done fetching Twelve historical data for ${symbolData.symbol}`);
            },
            maxRetries: isFirstTime
                ? configs_1.MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME
                : configs_1.MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME,
        };
        return job;
    });
};
exports.createJobsForFetchingHistoricalData = createJobsForFetchingHistoricalData;
