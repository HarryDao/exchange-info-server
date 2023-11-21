"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobsForFetchingTwelveCurrentData = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../../configs");
const data_1 = require("../../data");
const createCurrentDataUrl = (symbol) => {
    return `${configs_1.TWELVE_API_URL}/${configs_1.TWELVE_QUOTE_ENDPOINT}?apikey=${configs_1.TWELVE_DATA_API_TOKEN}&symbol=${symbol}`;
};
const createJobsForFetchingTwelveCurrentData = (symbols) => {
    return symbols.map((symbolData) => {
        const job = {
            request: async () => {
                const url = createCurrentDataUrl(symbolData.symbol);
                const { data } = await axios_1.default.get(url);
                return data;
            },
            onRequestError: (error) => console.warn(`Error when fetching Twelve current data for ${symbolData.symbol}:`, error),
            onRequestSuccessful(data) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { close, timestamp, is_market_open, fifty_two_week, ...info } = data;
                (0, data_1.setCurrentData)(symbolData.symbol, {
                    price: Number(close),
                    time: timestamp * 1000,
                });
                const moreInfo = {};
                Object.entries(info).map(([k, v]) => {
                    let key = k.replace('_', ' ').toLowerCase();
                    key = key[0].toUpperCase() + key.slice(1);
                    moreInfo[key] = v;
                });
                (0, data_1.setMoreInfoData)(symbolData.symbol, moreInfo);
                console.log(`Done fetching Twelve current price for ${symbolData.symbol}`);
            },
            maxRetries: configs_1.MAX_RETRIES_CURRENT_DATA,
        };
        return job;
    });
};
exports.createJobsForFetchingTwelveCurrentData = createJobsForFetchingTwelveCurrentData;
