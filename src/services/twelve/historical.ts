import axios from 'axios';
import moment from 'moment-timezone';

import {
  HISTORICAL_API_TWELVE_DATA_UNIT,
  HISTORICAL_DATA_FETCHING_INTERVAL,
  LONG_HISTORICAL_LENGTH,
  MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME,
  MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME,
  TWELVE_API_URL,
  TWELVE_DATA_API_TOKEN,
  TWELVE_TIME_SERIES_ENDPOINT,
} from '../../configs';
import { Candle, SymbolConfigWithType, TwelveTimeSeriesResponse } from '../../types';
import { setHistoricalData } from '../../data';

const convertTwelveTimeSeriesResponseToCandles = ({ meta, values }: TwelveTimeSeriesResponse) => {
  const { exchange_timezone } = meta;
  const candles: Candle[] = [];

  values.forEach(({ datetime, open, high, low, close }) => {
    const time = moment.tz(datetime, exchange_timezone);
    candles.push({
      close: Number(close),
      open: Number(open),
      high: Number(high),
      low: Number(low),
      time: time.valueOf(),
    });
  });

  return candles;
};

const createHistoricalDataUrl = ({ symbol }: SymbolConfigWithType) => {
  return `${TWELVE_API_URL}/${TWELVE_TIME_SERIES_ENDPOINT}?apikey=${TWELVE_DATA_API_TOKEN}&symbol=${symbol}&interval=${HISTORICAL_API_TWELVE_DATA_UNIT}&outputsize=${LONG_HISTORICAL_LENGTH}`;
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
        `Retry fetching Historical data for Twelve for ${retries + 1} time: ${JSON.stringify(
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
        const { data } = await axios.get<TwelveTimeSeriesResponse>(url);

        if (data.status !== 'ok') {
          toRun.push(symbolData);
          continue;
        }

        const candles = convertTwelveTimeSeriesResponseToCandles(data);
        setHistoricalData(symbolData.symbol, candles);

        console.log(`Done fetching Twelve historical data for ${symbolData.symbol}`);
      } catch (error) {
        console.error(
          `Error with fetching Twelve historical data for ${symbolData.symbol}: ${error}`
        );
        toRun.push(symbolData);
      }
    }
    retries += 1;
  }

  if (nextRun.length) {
    console.error(
      `Failed to fetch Twelve Historical Data for: ${JSON.stringify(nextRun, null, 2)}`
    );

    if (isFirstTime) {
      throw new Error('Failed to fetch Twelve Historical Data');
    }
  }
};

export const initTwelveHistoricalFetchingLoop = async (symbols: SymbolConfigWithType[]) => {
  setInterval(async () => {
    await fetchHistoricalData(symbols, false);
  }, HISTORICAL_DATA_FETCHING_INTERVAL);
  await fetchHistoricalData(symbols, true);
};
