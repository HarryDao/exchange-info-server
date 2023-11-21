import http from 'http';
import { Server } from 'socket.io';
import { SocketNewData } from '../types';
export declare const initSocket: (httpServer: http.Server) => void, broadcastNewData: (data: SocketNewData) => void;
