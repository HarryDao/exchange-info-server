"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFinhubService = void 0;
const configs_1 = require("../../configs");
const data_configs_1 = require("../../data-configs");
const types_1 = require("../../types");
const queue_1 = require("../queue");
const current_1 = require("./current");
const historical_1 = require("./historical");
const moreInfo_1 = require("./moreInfo");
const socket_1 = require("./socket");
const createAndRunQueue = async (symbols, isFirstTime) => {
    const { addToQueue, startQueue } = (0, queue_1.createRequestQueue)({
        creditQuota: {
            limit: configs_1.FINNHUB_API_QUOTA_PER_MINUTE,
            waitingTimeForReset: 1 * 60 * 1000, // 1 minute
        },
    });
    addToQueue(...(0, current_1.createJobsForFetchingFinnhubCurrentData)(symbols));
    addToQueue(...(0, historical_1.createJobsForFetchingFinnhubHistoricalData)(symbols, isFirstTime));
    addToQueue(...(0, moreInfo_1.createJobsForFetchingFinnhubAdditionalStockData)(symbols));
    await startQueue();
};
const startRequestLoop = async (symbols) => {
    setInterval(async () => {
        await createAndRunQueue(symbols);
    }, configs_1.DATA_FETCHING_INTERVAL);
    await createAndRunQueue(symbols, true);
};
const initFinhubService = async () => {
    const symbols = [];
    data_configs_1.DATA_CONFIGS.forEach((config) => {
        if (config.provider === types_1.DataProviderEnum.FINNHUB) {
            config.symbols.forEach((symbol) => {
                symbols.push({
                    ...symbol,
                    type: config.type,
                });
            });
        }
    });
    if (!process.env.USE_SAMPLE_DATA) {
        await startRequestLoop(symbols);
    }
    await (0, socket_1.initFinnhubSocket)(symbols);
};
exports.initFinhubService = initFinhubService;
