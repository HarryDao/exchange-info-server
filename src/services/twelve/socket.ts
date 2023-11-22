import WebSocket from 'ws';

import { SymbolConfigWithType, TwelveSocketPrice } from '../../types';
import {
  SOCKET_WAIT_TIME_BEFORE_RESET,
  TWELVE_DATA_API_TOKEN,
  TWELVE_SOCKET_URL,
} from '../../configs';
import { setCurrentData } from '../../data';
import { broadcastNewData } from '../../socket';

export const { initTwelveSocket } = (() => {
  let socket: WebSocket;
  let symbols: SymbolConfigWithType[] = [];

  const init = async (inputSymbols?: SymbolConfigWithType[]) => {
    await new Promise((resolve) => {
      if (inputSymbols) symbols = inputSymbols;

      socket = new WebSocket(`${TWELVE_SOCKET_URL}?apikey=${TWELVE_DATA_API_TOKEN}`);

      socket.addEventListener('open', () => {
        subscribeSymbols();
        resolve(undefined);
      });
      socket.addEventListener('message', onMessage);
      socket.addEventListener('error', (err: any) => {
        console.error('Finnhub Socket error:', err);
      });

      setResetSocketWait();
    });
  };

  const subscribeSymbols = () => {
    socket?.send(
      JSON.stringify({
        action: 'subscribe',
        params: {
          symbols: symbols.map((s) => s.symbol).join(','),
        },
      })
    );
    console.warn('Done Twelve Data Socket symbol subscriptions:', new Date());
  };

  const onMessage = (event: WebSocket.MessageEvent) => {
    if (event.type === 'error') {
      console.error('Twelve Socket error:', event);
    } else if (event.type === 'message') {
      onData(event.data as string);
    } else {
      console.error('Twelve Socket exception:', event);
    }
  };

  const onData = (dataRaw: string) => {
    try {
      setResetSocketWait();
      const response = JSON.parse(dataRaw);

      if (response.event === 'subscribe-status') {
        console.log('Twelve Data socket subscribe status:', response);
        return;
      }

      if (response.event === 'price') {
        const { symbol, price, timestamp } = response as TwelveSocketPrice;
        setCurrentData(symbol, {
          price,
          time: timestamp,
        });
        broadcastNewData({
          symbol,
          price,
          time: timestamp,
        });
      }
    } catch (error) {
      console.error('Twelve Socket read data error:', error);
    }
  };

  let resetSocketTimeout: NodeJS.Timeout;
  const setResetSocketWait = () => {
    if (resetSocketTimeout) {
      clearTimeout(resetSocketTimeout);
    }

    resetSocketTimeout = setTimeout(async () => {
      console.warn('Twelve socket is resetting...:', new Date());
      socket?.removeAllListeners();
      socket?.close();

      await init();
    }, SOCKET_WAIT_TIME_BEFORE_RESET);
  };

  return { initTwelveSocket: (symbols: SymbolConfigWithType[]) => init(symbols) };
})();
