"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyRouter = void 0;
const express_1 = require("express");
const historyController_1 = __importDefault(require("../controllers/historyController"));
exports.historyRouter = (0, express_1.Router)();
exports.historyRouter.get('/short', historyController_1.default.fetchHistoryShort);
exports.historyRouter.get('/long/:symbol', historyController_1.default.fetchHistoryLong);
