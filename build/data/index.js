"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToLocal = exports.setMoreInfoData = exports.getMoreInfoForSymbol = exports.getMoreInfoData = exports.setCurrentData = exports.getCurrentData = exports.setHistoricalData = exports.getShortHistoricalData = exports.getLongHistoricalData = exports.getAllLongHistoricalData = void 0;
const fs_1 = __importDefault(require("fs"));
const data_1 = require("../configs/data");
const sample_current_json_1 = __importDefault(require("./sample/sample-current.json"));
const sample_historical_json_1 = __importDefault(require("./sample/sample-historical.json"));
const sample_more_info_json_1 = __importDefault(require("./sample/sample-more-info.json"));
_a = (() => {
    const historicalData = process.env.USE_SAMPLE_DATA ? sample_historical_json_1.default : {};
    const currentData = process.env.USE_SAMPLE_DATA ? sample_current_json_1.default : {};
    const moreInfoData = process.env.USE_SAMPLE_DATA ? sample_more_info_json_1.default : {};
    return {
        saveToLocal: () => {
            console.log('Saving data to local files...');
            fs_1.default.writeFileSync(`${__dirname}/sample/sample-current.json`, JSON.stringify(currentData, null, 2));
            fs_1.default.writeFileSync(`${__dirname}/sample/sample-historical.json`, JSON.stringify(historicalData, null, 2));
            fs_1.default.writeFileSync(`${__dirname}/sample/sample-more-info.json`, JSON.stringify(moreInfoData, null, 2));
            console.log('Saved to local files');
        },
        getAllLongHistoricalData: () => historicalData,
        getLongHistoricalData: (symbol) => {
            return historicalData[symbol] || [];
        },
        getShortHistoricalData: (symbols) => {
            const short = {};
            // all symbols
            if (!symbols) {
                Object.entries(historicalData).forEach(([symbol, data]) => {
                    short[symbol] = data.slice(0, data_1.SHORT_HISTORICAL_LENGTH);
                });
                return short;
            }
            // targeted symbols
            symbols.forEach((symbol) => {
                if (!historicalData[symbol])
                    return;
                short[symbol] = historicalData[symbol].slice(0, data_1.SHORT_HISTORICAL_LENGTH);
            });
            return short;
        },
        setHistoricalData: (symbol, candles) => {
            candles.sort((a, b) => {
                return a.time > b.time ? -1 : 1;
            });
            // Temporarily set current data to latest historical data if it is unavailable
            if (!currentData[symbol]) {
                currentData[symbol] = {
                    price: candles[0].close,
                    time: candles[0].time,
                };
            }
            historicalData[symbol] = candles;
        },
        getCurrentData: () => currentData,
        setCurrentData: (symbol, data) => {
            const existing = currentData[symbol];
            if (!existing || existing.time < data.time) {
                currentData[symbol] = data;
            }
        },
        getMoreInfoData: () => moreInfoData,
        getMoreInfoForSymbol: (symbol) => {
            return moreInfoData[symbol] || {};
        },
        setMoreInfoData: (symbol, moreInfo) => {
            moreInfoData[symbol] = {
                ...(moreInfoData[symbol] || {}),
                ...moreInfo,
            };
        },
    };
})(), exports.getAllLongHistoricalData = _a.getAllLongHistoricalData, exports.getLongHistoricalData = _a.getLongHistoricalData, exports.getShortHistoricalData = _a.getShortHistoricalData, exports.setHistoricalData = _a.setHistoricalData, exports.getCurrentData = _a.getCurrentData, exports.setCurrentData = _a.setCurrentData, exports.getMoreInfoData = _a.getMoreInfoData, exports.getMoreInfoForSymbol = _a.getMoreInfoForSymbol, exports.setMoreInfoData = _a.setMoreInfoData, exports.saveToLocal = _a.saveToLocal;
