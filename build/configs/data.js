"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_WAIT_TIME_BEFORE_RESET = exports.DATA_FETCHING_INTERVAL = exports.MAX_RETRIES_CURRENT_DATA = exports.MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME = exports.MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME = exports.SHORT_HISTORICAL_LENGTH = exports.LONG_HISTORICAL_LENGTH = exports.HISTORICAL_FINNHUB_RESOLUTION = exports.HISTORICAL_API_TWELVE_DATA_UNIT = exports.HISTORICAL_UNIT = void 0;
// Unit of the chart
exports.HISTORICAL_UNIT = 1 * 24 * 60 * 60 * 1000; // 1 day
exports.HISTORICAL_API_TWELVE_DATA_UNIT = '1day';
exports.HISTORICAL_FINNHUB_RESOLUTION = 'D'; // day
// Length of the detailed chart
exports.LONG_HISTORICAL_LENGTH = 90; // 90 days
// Length of the mini chart
exports.SHORT_HISTORICAL_LENGTH = 30; // 30 days
// Retry when fail to fetch historical data
exports.MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME = 10;
exports.MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME = 5;
// Retry when fail to fetch current data
exports.MAX_RETRIES_CURRENT_DATA = 2;
// Historical data fetching interval
exports.DATA_FETCHING_INTERVAL = 1 * 24 * 60 * 60 * 1000; // ms
// Live data
exports.SOCKET_WAIT_TIME_BEFORE_RESET = 30 * 60 * 1000; // 30 minutes
