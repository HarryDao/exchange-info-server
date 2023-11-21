"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobsForFetchingFinnhubCurrentData = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../../configs");
const data_1 = require("../../data");
const createCurrentDataUrl = (symbol) => {
    return `${configs_1.FINNHUB_API_URL}/${configs_1.FINNHUB_QUOTE_ENDPOINT}?token=${configs_1.FINNHUB_REST_API_TOKEN}&symbol=${symbol}`;
};
const createJobsForFetchingFinnhubCurrentData = (symbols) => {
    return symbols.map((symbolData) => {
        const job = {
            request: async () => {
                const { data } = await axios_1.default.get(createCurrentDataUrl(symbolData.symbol));
                return data;
            },
            onRequestError: (error) => {
                console.warn(`Error when fetching Finnhub current data for ${symbolData.symbol}:`, error);
            },
            onRequestSuccessful: (quote) => {
                (0, data_1.setCurrentData)(symbolData.symbol, {
                    price: quote.c,
                    time: quote.t * 1000,
                });
                (0, data_1.setMoreInfoData)(symbolData.symbol, {
                    'High price of the day': quote.h,
                    'Low price of the day': quote.l,
                    'Open price of the day': quote.o,
                    'Previous close price': quote.pc,
                });
                console.log(`Done fetching Finnhub current price for ${symbolData.symbol}`);
            },
            maxRetries: configs_1.MAX_RETRIES_CURRENT_DATA,
        };
        return job;
    });
};
exports.createJobsForFetchingFinnhubCurrentData = createJobsForFetchingFinnhubCurrentData;
