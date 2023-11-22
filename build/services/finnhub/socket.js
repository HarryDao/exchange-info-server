"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFinnhubSocket = void 0;
const ws_1 = __importDefault(require("ws"));
const configs_1 = require("../../configs");
const data_1 = require("../../data");
const socket_1 = require("../../socket");
exports.initFinnhubSocket = (() => {
    let socket;
    let symbols = [];
    const init = async (inputSymbols) => {
        await new Promise((resolve) => {
            if (inputSymbols)
                symbols = inputSymbols;
            socket = new ws_1.default(`${configs_1.FINNHUB_SOCKET_URL}?token=${configs_1.FINNHUB_SOCKET_API_TOKEN}`);
            socket.addEventListener('message', onMessage);
            socket.addEventListener('error', (err) => {
                console.error('Finnhub Socket error:', err);
            });
            socket.addEventListener('open', async () => {
                await subscribeSymbols();
                resolve(undefined);
            });
            setResetSocketWait();
        });
    };
    const onMessage = (event) => {
        if (event.type === 'error') {
            console.error('Finnhub Socket error:', event);
        }
        else if (event.type === 'message') {
            onData(event.data);
        }
        else {
            console.error('Finnhub Socket exception:', event);
        }
    };
    const onData = (dataRaw) => {
        try {
            setResetSocketWait();
            const response = JSON.parse(dataRaw);
            if (!response ||
                response.type !== 'trade' ||
                !response.data ||
                !response.data[0] ||
                !response.data[0].s)
                return;
            const { data } = response;
            (0, data_1.setCurrentData)(data[0].s, {
                price: data[0].p,
                time: data[0].t,
            });
            (0, socket_1.broadcastNewData)({
                symbol: data[0].s,
                price: data[0].p,
                time: data[0].t,
            });
        }
        catch (error) {
            console.error('Finnhub Socket read data error:', error);
        }
    };
    const subscribeSymbols = async () => {
        for (const symbolData of symbols) {
            socket?.send(JSON.stringify({
                type: 'subscribe',
                symbol: symbolData.symbol,
            }));
            await new Promise((res) => setTimeout(res, 200));
        }
        console.warn('Done Finnhub Socket symbol subscriptions:', new Date());
    };
    let resetSocketTimeout;
    const setResetSocketWait = () => {
        if (resetSocketTimeout) {
            clearTimeout(resetSocketTimeout);
        }
        resetSocketTimeout = setTimeout(async () => {
            console.warn('Finnhub socket is resetting...:', new Date());
            socket?.removeAllListeners();
            socket?.close();
            await init();
        }, configs_1.SOCKET_WAIT_TIME_BEFORE_RESET);
    };
    return { initFinnhubSocket: (symbols) => init(symbols) };
})().initFinnhubSocket;
