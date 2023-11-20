import axios from 'axios';

import { setHistoricalData } from '../../data';
import {
  FINNHUB_API_URL,
  FINNHUB_CRYPTO_CANDLE_ENDPOINT,
  HISTORICAL_DATA_FETCHING_INTERVAL,
  MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME,
  MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME,
  FINNHUB_REST_API_TOKEN,
  FINNHUB_STOCK_CANDLE_ENDPOINT,
  HISTORICAL_FINNHUB_RESOLUTION,
  HISTORICAL_UNIT,
  LONG_HISTORICAL_LENGTH,
} from '../../configs';
import { Candle, DataTypeEnum, SymbolConfigWithType } from '../../types';
import { FinnhubCandleStatusEnum, FinnhubCandles } from '../../types/finnhub.types';

const createHistoricalDataUrl = ({ type, symbol }: SymbolConfigWithType) => {
  const to = Math.floor(new Date().getTime() / 1000);
  const from = to - (LONG_HISTORICAL_LENGTH * HISTORICAL_UNIT) / 1000;

  const url = `${FINNHUB_API_URL}/${
    type === DataTypeEnum.STOCK ? FINNHUB_STOCK_CANDLE_ENDPOINT : FINNHUB_CRYPTO_CANDLE_ENDPOINT
  }?token=${FINNHUB_REST_API_TOKEN}&symbol=${symbol}&resolution=${HISTORICAL_FINNHUB_RESOLUTION}&from=${from}&to=${to}`;

  return url;
};

const convertFinhubCandlesToCandles = (input: FinnhubCandles): Candle[] => {
  const { c, o, h, l, t } = input;
  const candles: Candle[] = [];
  c.forEach((_nouse, i) => {
    candles.push({
      close: c[i],
      open: o[i],
      high: h[i],
      low: l[i],
      time: t[i] * 1000,
    });
  });

  return candles;
};

const fetchHistoricalData = async (symbols: SymbolConfigWithType[], isFirstTime: boolean) => {
  let retries = 0;
  let nextRun = [...symbols];
  const maxRetries = isFirstTime
    ? MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME
    : MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME;

  while (retries < maxRetries && nextRun.length) {
    if (retries > 0) {
      console.log(
        `Retry fetching Historical data for Finnhub for ${retries + 1} time: ${JSON.stringify(
          nextRun,
          null,
          2
        )}`
      );

      // cool down for 2s before fetching next round
      await new Promise((res) => setTimeout(res, 2000));
    }

    const toRun = [...nextRun];
    nextRun = [];

    for (const symbolData of toRun) {
      const url = createHistoricalDataUrl(symbolData);

      try {
        const { data } = await axios.get<FinnhubCandles>(url);

        if (data.s === FinnhubCandleStatusEnum.OK) {
          const candles = convertFinhubCandlesToCandles(data);
          setHistoricalData(symbolData.symbol, candles);
          console.log(`Done fetching Finnhub historical data for ${symbolData.symbol}`);
        } else {
          toRun.push(symbolData);
        }
      } catch (error) {
        console.error(
          `Error with fetching Finnhub historical data for ${symbolData.symbol}: ${error}`
        );
        toRun.push(symbolData);
      }
    }
    retries += 1;
  }

  if (nextRun.length) {
    console.error(
      `Failed to fetch Finnhub Historical Data for: ${JSON.stringify(nextRun, null, 2)}`
    );

    if (isFirstTime) {
      throw new Error('Failed to fetch Finnhub Historical Data');
    }
  }
};

export const initFinnhubHistoricalFetchingLoop = async (symbols: SymbolConfigWithType[]) => {
  setInterval(async () => {
    await fetchHistoricalData(symbols, false);
  }, HISTORICAL_DATA_FETCHING_INTERVAL);
  await fetchHistoricalData(symbols, true);
};
