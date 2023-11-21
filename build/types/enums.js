"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProviderEnum = exports.DataTypeEnum = void 0;
var DataTypeEnum;
(function (DataTypeEnum) {
    DataTypeEnum["STOCK"] = "Stock";
    DataTypeEnum["CRYPTO"] = "Crypto";
    DataTypeEnum["FOREX"] = "Forex";
})(DataTypeEnum || (exports.DataTypeEnum = DataTypeEnum = {}));
var DataProviderEnum;
(function (DataProviderEnum) {
    DataProviderEnum["FINNHUB"] = "FINNHUB";
    DataProviderEnum["TWELVE"] = "TWELVE";
})(DataProviderEnum || (exports.DataProviderEnum = DataProviderEnum = {}));
