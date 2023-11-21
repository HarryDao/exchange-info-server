"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TWELVE_SOCKET_URL = exports.TWELVE_QUOTE_ENDPOINT = exports.TWELVE_TIME_SERIES_ENDPOINT = exports.TWELVE_API_URL = exports.TWELVE_API_QUOTA_PER_MINUTE = exports.TWELVE_DATA_API_TOKEN = void 0;
exports.TWELVE_DATA_API_TOKEN = process.env.TWELVE_DATA_API_TOKEN || '';
exports.TWELVE_API_QUOTA_PER_MINUTE = 6;
exports.TWELVE_API_URL = 'https://api.twelvedata.com';
exports.TWELVE_TIME_SERIES_ENDPOINT = 'time_series';
exports.TWELVE_QUOTE_ENDPOINT = 'quote';
exports.TWELVE_SOCKET_URL = 'wss://ws.twelvedata.com/v1/quotes/price';
