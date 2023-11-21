"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
const fetchCurrentData = (req, res) => {
    const currentData = (0, data_1.getCurrentData)();
    return res.status(200).send({ currentData });
};
exports.default = {
    fetchCurrentData,
};
