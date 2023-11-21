"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const configs_1 = require("./configs");
const services_1 = require("./services");
const socket_1 = require("./socket");
const routes_1 = require("./routes");
const data_1 = require("./data");
(async () => {
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    (0, socket_1.initSocket)(server);
    await (0, services_1.initServices)();
    if (process.env.ENABLE_SAVE_FILE_TO_LOCAL) {
        (0, data_1.saveToLocal)();
    }
    server.listen(configs_1.PORT, () => {
        console.log(`Server for Exchange Info running on port ${configs_1.PORT}`);
    });
    app.use(body_parser_1.default.json());
    app.use((0, morgan_1.default)('dev'));
    app.use((0, cors_1.default)());
    app.use(routes_1.router);
})();
