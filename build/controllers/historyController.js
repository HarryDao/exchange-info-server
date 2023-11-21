"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const dto_1 = require("../dto");
const data_1 = require("../data");
const fetchHistoryShort = async (req, res) => {
    let symbols = [];
    try {
        const { symbols: symbolsString } = await (0, utils_1.validate)(req.query, dto_1.GetHistoryShortQueryDto);
        symbols = symbolsString.split(',');
    }
    catch (error) {
        return res.status(403).send(error.message);
    }
    const shortHistoricalData = (0, data_1.getShortHistoricalData)(symbols);
    return res.status(200).send({ shortHistoricalData });
};
const fetchHistoryLong = async (req, res) => {
    let symbol;
    try {
        const dto = await (0, utils_1.validate)(req.params, dto_1.GetHistoryLongParamsDto);
        symbol = dto.symbol;
    }
    catch (error) {
        return res.status(403).send(error.message);
    }
    const candles = (0, data_1.getLongHistoricalData)(symbol);
    return res.status(200).send({ candles });
};
exports.default = {
    fetchHistoryShort,
    fetchHistoryLong,
};
