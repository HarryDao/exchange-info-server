"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const data_configs_1 = require("../data-configs");
const historyRoutes_1 = require("./historyRoutes");
const currentRoutes_1 = require("./currentRoutes");
const moreInfoRoutes_1 = require("./moreInfoRoutes");
exports.router = (0, express_1.Router)();
exports.router.get('/ping', (req, res) => res.status(200).send('pong'));
exports.router.get('/data-configs', (req, res) => {
    res.status(200).json({ dataConfigs: data_configs_1.DATA_CONFIGS });
});
exports.router.use('/history', historyRoutes_1.historyRouter);
exports.router.use('/current', currentRoutes_1.currentRouter);
exports.router.use('/more-info', moreInfoRoutes_1.moreInfoRouter);
