import http from 'http';

import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { SocketEventEum, SocketNewData } from '../types';

export const { initSocket, broadcastNewData } = (() => {
  let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  const init = (httpServer: http.Server) => {
    io = new Server(httpServer, {
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

  const broadcastNewData = (data: SocketNewData) => {
    io?.sockets.emit(SocketEventEum.NEW_DATA, data);
  };

  return {
    initSocket: init,
    broadcastNewData,
  };
})();
