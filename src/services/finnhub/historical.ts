import axios from 'axios';

import {
  FINNHUB_API_URL,
  FINNHUB_CRYPTO_CANDLE_ENDPOINT,
  FINNHUB_REST_API_TOKEN,
  FINNHUB_STOCK_CANDLE_ENDPOINT,
  HISTORICAL_FINNHUB_RESOLUTION,
  HISTORICAL_UNIT,
  LONG_HISTORICAL_LENGTH,
  MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME,
  MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME,
} from '../../configs';
import {
  Candle,
  DataTypeEnum,
  FinnhubCandleStatusEnum,
  FinnhubCandles,
  SymbolConfigWithType,
} from '../../types';
import { QueueJob } from '../queue';
import { setHistoricalData } from '../../data';

const createHistoricalDataUrl = ({ type, symbol }: SymbolConfigWithType) => {
  const to = Math.floor(new Date().getTime() / 1000);
  const from = to - (LONG_HISTORICAL_LENGTH * HISTORICAL_UNIT) / 1000;

  const url = `${FINNHUB_API_URL}/${
    type === DataTypeEnum.STOCK ? FINNHUB_STOCK_CANDLE_ENDPOINT : FINNHUB_CRYPTO_CANDLE_ENDPOINT
  }?token=${FINNHUB_REST_API_TOKEN}&symbol=${symbol}&resolution=${HISTORICAL_FINNHUB_RESOLUTION}&from=${from}&to=${to}`;

  return url;
};

export const createJobsForFetchingFinnhubHistoricalData = (
  symbols: SymbolConfigWithType[],
  isFirstTime?: boolean
) => {
  return symbols.map((symbolData) => {
    const job: QueueJob<FinnhubCandles> = {
      request: async () => {
        const url = createHistoricalDataUrl(symbolData);
        const { data } = await axios.get<FinnhubCandles>(url);
        return data;
      },
      isRequestSuccessful: (data) => {
        return data.s === FinnhubCandleStatusEnum.OK;
      },
      onRequestError: (error) => {
        console.error(
          `Error with fetching Finnhub historical data for ${symbolData.symbol}: ${error}`
        );
      },
      onRequestSuccessful: (data) => {
        const { c, o, h, l, t } = data;
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

        setHistoricalData(symbolData.symbol, candles);
        console.log(`Done fetching Finnhub historical data for ${symbolData.symbol}`);
      },
      maxRetries: isFirstTime
        ? MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME
        : MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME,
    };
    return job;
  });
};
