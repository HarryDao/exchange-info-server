"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moreInfoRouter = void 0;
const express_1 = require("express");
const moreInfoController_1 = __importDefault(require("../controllers/moreInfoController"));
exports.moreInfoRouter = (0, express_1.Router)();
exports.moreInfoRouter.get('/', moreInfoController_1.default.fetchMoreInfo);
