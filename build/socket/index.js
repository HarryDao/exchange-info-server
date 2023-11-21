"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastNewData = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const types_1 = require("../types");
_a = (() => {
    let io;
    const init = (httpServer) => {
        io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
            path: '/socket.io',
        });
        io.on('connection', () => {
            console.log('New Socket connected!');
        });
    };
    const broadcastNewData = (data) => {
        io?.sockets.emit(types_1.SocketEventEum.NEW_DATA, data);
    };
    return {
        initSocket: init,
        broadcastNewData,
    };
})(), exports.initSocket = _a.initSocket, exports.broadcastNewData = _a.broadcastNewData;
