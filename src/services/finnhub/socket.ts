import WebSocket from 'ws';

import {
  FINNHUB_SOCKET_API_TOKEN,
  FINNHUB_SOCKET_URL,
  SOCKET_WAIT_TIME_BEFORE_RESET,
} from '../../configs';
import { FinnhubTradeDataResponse, SymbolConfigWithType } from '../../types';
import { setCurrentData } from '../../data';
import { broadcastNewData } from '../../socket';

export const { initFinnhubSocket } = (() => {
  let socket: WebSocket;
  let symbols: SymbolConfigWithType[] = [];

  const init = async (inputSymbols?: SymbolConfigWithType[]) => {
    await new Promise((resolve) => {
      if (inputSymbols) symbols = inputSymbols;

      socket = new WebSocket(`${FINNHUB_SOCKET_URL}?token=${FINNHUB_SOCKET_API_TOKEN}`);

      socket.addEventListener('message', onMessage);
      socket.addEventListener('error', (err: any) => {
        console.error('Finnhub Socket error:', err);
      });
      socket.addEventListener('open', async () => {
        await subscribeSymbols();
        resolve(undefined);
      });

      setResetSocketWait();
    });
  };
  const onMessage = (event: WebSocket.MessageEvent) => {
    if (event.type === 'error') {
      console.error('Finnhub Socket error:', event);
    } else if (event.type === 'message') {
      onData(event.data as string);
    } else {
      console.error('Finnhub Socket exception:', event);
    }
  };

  const onData = (dataRaw: string) => {
    try {
      setResetSocketWait();
      const response = JSON.parse(dataRaw);

      if (
        !response ||
        response.type !== 'trade' ||
        !response.data ||
        !response.data[0] ||
        !response.data[0].s
      )
        return;

      const { data } = response as FinnhubTradeDataResponse;

      setCurrentData(data[0].s, {
        price: data[0].p,
        time: data[0].t,
      });
      broadcastNewData({
        symbol: data[0].s,
        price: data[0].p,
        time: data[0].t,
      });
    } catch (error) {
      console.error('Finnhub Socket read data error:', error);
    }
  };

  const subscribeSymbols = async () => {
    for (const symbolData of symbols) {
      socket?.send(
        JSON.stringify({
          type: 'subscribe',
          symbol: symbolData.symbol,
        })
      );
      await new Promise((res) => setTimeout(res, 200));
    }
    console.log('Done Finnhub Socket symbol subscriptions');
  };

  let resetSocketTimeout: NodeJS.Timeout;
  const setResetSocketWait = () => {
    if (resetSocketTimeout) {
      clearTimeout(resetSocketTimeout);
    }

    resetSocketTimeout = setTimeout(async () => {
      socket?.removeAllListeners();
      socket?.close();

      await init();
    }, SOCKET_WAIT_TIME_BEFORE_RESET);
  };

  return { initFinnhubSocket: (symbols: SymbolConfigWithType[]) => init(symbols) };
})();
