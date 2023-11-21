"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentRouter = void 0;
const express_1 = require("express");
const currentController_1 = __importDefault(require("../controllers/currentController"));
exports.currentRouter = (0, express_1.Router)();
exports.currentRouter.get('/', currentController_1.default.fetchCurrentData);
