"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
const utils_1 = require("../utils");
const dto_1 = require("../dto");
const fetchMoreInfo = async (req, res) => {
    let symbol;
    try {
        const dto = await (0, utils_1.validate)(req.query, dto_1.GetMoreInfoQueryDto);
        symbol = dto.symbol;
    }
    catch (error) {
        return res.status(403).send(error.message);
    }
    const info = (0, data_1.getMoreInfoForSymbol)(symbol);
    return res.status(200).send({ data: info });
};
exports.default = {
    fetchMoreInfo,
};
