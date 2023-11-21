"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobsForFetchingFinnhubAdditionalStockData = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../../configs");
const types_1 = require("../../types");
const data_1 = require("../../data");
const createStockProfileUrl = (symbol) => {
    return `${configs_1.FINNHUB_API_URL}/${configs_1.FINNHUB_STOCK_PROFILE2_ENDPOINT}?token=${configs_1.FINNHUB_REST_API_TOKEN}&symbol=${symbol}`;
};
const createJobsForFetchingFinnhubAdditionalStockData = (symbols) => {
    return symbols
        .filter((s) => s.type === types_1.DataTypeEnum.STOCK)
        .map((symbolData) => {
        const job = {
            request: async () => {
                const { data } = await axios_1.default.get(createStockProfileUrl(symbolData.symbol));
                return data;
            },
            onRequestError(error) {
                console.warn(`Error when fetching Finnhub additional info for ${symbolData.symbol}:`, error);
            },
            onRequestSuccessful: (data) => {
                const info = {};
                Object.entries(data).forEach(([k, v]) => {
                    let key = k.replace(/([A-Z])/g, ' $1');
                    key = key.toLowerCase();
                    key = key[0].toUpperCase() + key.slice(1);
                    info[key] = v;
                });
                (0, data_1.setMoreInfoData)(symbolData.symbol, info);
                console.log(`Done fetching Finnhub additional info for ${symbolData.symbol}`);
            },
            maxRetries: configs_1.MAX_RETRIES_CURRENT_DATA,
        };
        return job;
    });
};
exports.createJobsForFetchingFinnhubAdditionalStockData = createJobsForFetchingFinnhubAdditionalStockData;
