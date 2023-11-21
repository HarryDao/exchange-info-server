"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTwelveSocket = void 0;
const ws_1 = __importDefault(require("ws"));
const configs_1 = require("../../configs");
const data_1 = require("../../data");
const socket_1 = require("../../socket");
exports.initTwelveSocket = (() => {
    let socket;
    let symbols = [];
    const init = async (inputSymbols) => {
        await new Promise((resolve) => {
            if (inputSymbols)
                symbols = inputSymbols;
            socket = new ws_1.default(`${configs_1.TWELVE_SOCKET_URL}?apikey=${configs_1.TWELVE_DATA_API_TOKEN}`);
            socket.addEventListener('open', () => {
                subscribeSymbols();
                resolve(undefined);
            });
            socket.addEventListener('message', onMessage);
            socket.addEventListener('error', (err) => {
                console.error('Finnhub Socket error:', err);
            });
            setResetSocketWait();
        });
    };
    const subscribeSymbols = () => {
        socket?.send(JSON.stringify({
            action: 'subscribe',
            params: {
                symbols: symbols.map((s) => s.symbol).join(','),
            },
        }));
        console.log('Done Twelve Data Socket symbol subscriptions');
    };
    const onMessage = (event) => {
        if (event.type === 'error') {
            console.error('Twelve Socket error:', event);
        }
        else if (event.type === 'message') {
            onData(event.data);
        }
        else {
            console.error('Twelve Socket exception:', event);
        }
    };
    const onData = (dataRaw) => {
        try {
            setResetSocketWait();
            const response = JSON.parse(dataRaw);
            if (response.event === 'subscribe-status') {
                console.log('Twelve Data socket subscribe status:', response);
                return;
            }
            if (response.event === 'price') {
                const { symbol, price, timestamp } = response;
                (0, data_1.setCurrentData)(symbol, {
                    price,
                    time: timestamp,
                });
                (0, socket_1.broadcastNewData)({
                    symbol,
                    price,
                    time: timestamp,
                });
            }
        }
        catch (error) {
            console.error('Twelve Socket read data error:', error);
        }
    };
    let resetSocketTimeout;
    const setResetSocketWait = () => {
        if (resetSocketTimeout) {
            clearTimeout(resetSocketTimeout);
        }
        resetSocketTimeout = setTimeout(async () => {
            socket?.removeAllListeners();
            socket?.close();
            await init();
        }, configs_1.SOCKET_WAIT_TIME_BEFORE_RESET);
    };
    return { initTwelveSocket: (symbols) => init(symbols) };
})().initTwelveSocket;
