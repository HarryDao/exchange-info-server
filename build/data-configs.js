"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_CONFIGS = void 0;
const types_1 = require("./types");
exports.DATA_CONFIGS = [
    {
        type: types_1.DataTypeEnum.STOCK,
        provider: types_1.DataProviderEnum.FINNHUB,
        symbols: [
            {
                symbol: 'AAPL',
                description: 'Apple Inc',
            },
            {
                symbol: 'MSFT',
                description: 'Microsoft Corp',
            },
            {
                symbol: 'GOOG',
                description: 'Alphabet Inc Class C',
            },
            {
                symbol: 'AMZN',
                description: 'Amazon.com, Inc',
            },
            {
                symbol: 'NVDA',
                description: 'NVIDIA Corp',
            },
            {
                symbol: 'TSLA',
                description: 'Tesla Inc',
            },
            {
                symbol: 'META',
                description: 'Meta Platforms Inc',
            },
            {
                symbol: 'BRK-B',
                description: 'Berkshire Hathaway',
            },
            {
                symbol: 'LLY',
                description: 'Eli Lilly And Co',
            },
            {
                symbol: 'V',
                description: 'Visa Inc',
            },
        ],
    },
    {
        type: types_1.DataTypeEnum.FOREX,
        provider: types_1.DataProviderEnum.TWELVE,
        symbols: [
            {
                symbol: 'EUR/USD',
                description: 'Euro to US Dollar',
            },
            {
                symbol: 'USD/JPY',
                description: 'US Dollar to Yen',
            },
            {
                symbol: 'GBP/USD',
                description: 'British Pound to US Dollar',
            },
            {
                symbol: 'AUD/USD',
                description: 'Australian Dollar to US Dollar',
            },
            {
                symbol: 'USD/CAD',
                description: 'US Dollar to Canadian Dollar',
            },
        ],
    },
    {
        type: types_1.DataTypeEnum.CRYPTO,
        provider: types_1.DataProviderEnum.FINNHUB,
        symbols: [
            {
                description: 'Bitcoin',
                displaySymbol: 'BTC/USDT',
                symbol: 'BINANCE:BTCUSDT',
            },
            {
                description: 'Etherium',
                displaySymbol: 'ETH/USDT',
                symbol: 'BINANCE:ETHUSDT',
            },
            {
                description: 'Litecoin',
                displaySymbol: 'LTC/USDT',
                symbol: 'BINANCE:LTCUSDT',
            },
        ],
    },
];
