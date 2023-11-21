"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTwelveService = void 0;
const configs_1 = require("../../configs");
const data_configs_1 = require("../../data-configs");
const types_1 = require("../../types");
const queue_1 = require("../queue");
const current_1 = require("./current");
const historical_1 = require("./historical");
const socket_1 = require("./socket");
const createAndRunQueue = async (symbols, isFirstTime) => {
    const { addToQueue, startQueue } = (0, queue_1.createRequestQueue)({
        creditQuota: {
            limit: configs_1.TWELVE_API_QUOTA_PER_MINUTE,
            waitingTimeForReset: 1 * 60 * 1000, // 1 minute
        },
    });
    addToQueue(...(0, current_1.createJobsForFetchingTwelveCurrentData)(symbols));
    addToQueue(...(0, historical_1.createJobsForFetchingHistoricalData)(symbols, isFirstTime));
    await startQueue();
};
const startRequestLoop = async (symbols) => {
    setInterval(async () => {
        await createAndRunQueue(symbols);
    }, configs_1.DATA_FETCHING_INTERVAL);
    await createAndRunQueue(symbols, true);
};
const initTwelveService = async () => {
    const symbols = [];
    data_configs_1.DATA_CONFIGS.forEach((config) => {
        if (config.provider === types_1.DataProviderEnum.TWELVE) {
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
    await (0, socket_1.initTwelveSocket)(symbols);
};
exports.initTwelveService = initTwelveService;
