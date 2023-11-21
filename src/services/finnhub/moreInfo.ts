import axios from 'axios';

import {
  FINNHUB_API_URL,
  FINNHUB_REST_API_TOKEN,
  FINNHUB_STOCK_PROFILE2_ENDPOINT,
  MAX_RETRIES_CURRENT_DATA,
} from '../../configs';
import { DataTypeEnum, SymbolConfigWithType } from '../../types';
import { QueueJob } from '../queue';
import { setMoreInfoData } from '../../data';

const createStockProfileUrl = (symbol: string) => {
  return `${FINNHUB_API_URL}/${FINNHUB_STOCK_PROFILE2_ENDPOINT}?token=${FINNHUB_REST_API_TOKEN}&symbol=${symbol}`;
};

export const createJobsForFetchingFinnhubAdditionalStockData = (
  symbols: SymbolConfigWithType[]
) => {
  return symbols
    .filter((s) => s.type === DataTypeEnum.STOCK)
    .map((symbolData) => {
      const job: QueueJob<{ [key: string]: any }> = {
        request: async () => {
          const { data } = await axios.get<{ [key: string]: any }>(
            createStockProfileUrl(symbolData.symbol)
          );
          return data;
        },
        onRequestError(error) {
          console.warn(
            `Error when fetching Finnhub additional info for ${symbolData.symbol}:`,
            error
          );
        },
        onRequestSuccessful: (data) => {
          const info: { [key: string]: any } = {};
          Object.entries(data).forEach(([k, v]) => {
            let key = k.replace(/([A-Z])/g, ' $1');
            key = key.toLowerCase();
            key = key[0].toUpperCase() + key.slice(1);
            info[key] = v;
          });
          setMoreInfoData(symbolData.symbol, info);
          console.log(`Done fetching Finnhub additional info for ${symbolData.symbol}`);
        },
        maxRetries: MAX_RETRIES_CURRENT_DATA,
      };
      return job;
    });
};
