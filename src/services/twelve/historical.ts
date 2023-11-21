import axios from 'axios';

import moment from 'moment-timezone';

import {
  HISTORICAL_API_TWELVE_DATA_UNIT,
  LONG_HISTORICAL_LENGTH,
  MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME,
  MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME,
  TWELVE_API_URL,
  TWELVE_DATA_API_TOKEN,
  TWELVE_TIME_SERIES_ENDPOINT,
} from '../../configs';
import { Candle, SymbolConfigWithType, TwelveTimeSeriesResponse } from '../../types';
import { QueueJob } from '../queue';
import { setHistoricalData } from '../../data';

const createHistoricalDataUrl = ({ symbol }: SymbolConfigWithType) => {
  return `${TWELVE_API_URL}/${TWELVE_TIME_SERIES_ENDPOINT}?apikey=${TWELVE_DATA_API_TOKEN}&symbol=${symbol}&interval=${HISTORICAL_API_TWELVE_DATA_UNIT}&outputsize=${LONG_HISTORICAL_LENGTH}`;
};

export const createJobsForFetchingHistoricalData = (
  symbols: SymbolConfigWithType[],
  isFirstTime?: boolean
) => {
  return symbols.map((symbolData) => {
    const job: QueueJob<TwelveTimeSeriesResponse> = {
      request: async () => {
        const url = createHistoricalDataUrl(symbolData);
        const { data } = await axios.get<TwelveTimeSeriesResponse>(url);
        return data;
      },
      isRequestSuccessful(data) {
        return data.status === 'ok';
      },
      onRequestError(error) {
        console.error(
          `Error with fetching Twelve historical data for ${symbolData.symbol}: ${error}`
        );
      },
      onRequestSuccessful: ({ meta, values }) => {
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

        setHistoricalData(symbolData.symbol, candles);

        console.log(`Done fetching Twelve historical data for ${symbolData.symbol}`);
      },
      maxRetries: isFirstTime
        ? MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME
        : MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME,
    };
    return job;
  });
};
