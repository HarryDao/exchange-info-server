"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobsForFetchingFinnhubHistoricalData = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../../configs");
const types_1 = require("../../types");
const data_1 = require("../../data");
const createHistoricalDataUrl = ({ type, symbol }) => {
    const to = Math.floor(new Date().getTime() / 1000);
    const from = to - (configs_1.LONG_HISTORICAL_LENGTH * configs_1.HISTORICAL_UNIT) / 1000;
    const url = `${configs_1.FINNHUB_API_URL}/${type === types_1.DataTypeEnum.STOCK ? configs_1.FINNHUB_STOCK_CANDLE_ENDPOINT : configs_1.FINNHUB_CRYPTO_CANDLE_ENDPOINT}?token=${configs_1.FINNHUB_REST_API_TOKEN}&symbol=${symbol}&resolution=${configs_1.HISTORICAL_FINNHUB_RESOLUTION}&from=${from}&to=${to}`;
    return url;
};
const createJobsForFetchingFinnhubHistoricalData = (symbols, isFirstTime) => {
    return symbols.map((symbolData) => {
        const job = {
            request: async () => {
                const url = createHistoricalDataUrl(symbolData);
                const { data } = await axios_1.default.get(url);
                return data;
            },
            isRequestSuccessful: (data) => {
                return data.s === types_1.FinnhubCandleStatusEnum.OK;
            },
            onRequestError: (error) => {
                console.error(`Error with fetching Finnhub historical data for ${symbolData.symbol}: ${error}`);
            },
            onRequestSuccessful: (data) => {
                const { c, o, h, l, t } = data;
                const candles = [];
                c.forEach((_nouse, i) => {
                    candles.push({
                        close: c[i],
                        open: o[i],
                        high: h[i],
                        low: l[i],
                        time: t[i] * 1000,
                    });
                });
                (0, data_1.setHistoricalData)(symbolData.symbol, candles);
                console.log(`Done fetching Finnhub historical data for ${symbolData.symbol}`);
            },
            maxRetries: isFirstTime
                ? configs_1.MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME
                : configs_1.MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME,
        };
        return job;
    });
};
exports.createJobsForFetchingFinnhubHistoricalData = createJobsForFetchingFinnhubHistoricalData;
