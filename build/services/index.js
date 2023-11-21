"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServices = void 0;
const finnhub_1 = require("./finnhub");
const twelve_1 = require("./twelve");
const initServices = async () => {
    await Promise.all([(0, finnhub_1.initFinhubService)(), (0, twelve_1.initTwelveService)()]);
};
exports.initServices = initServices;
