import axios from 'axios';

import {
  MAX_RETRIES_CURRENT_DATA,
  TWELVE_API_URL,
  TWELVE_DATA_API_TOKEN,
  TWELVE_QUOTE_ENDPOINT,
} from '../../configs';
import { MoreInfo, SymbolConfigWithType, TwelveQuote } from '../../types';
import { QueueJob } from '../queue';
import { setCurrentData, setMoreInfoData } from '../../data';

const createCurrentDataUrl = (symbol: string) => {
  return `${TWELVE_API_URL}/${TWELVE_QUOTE_ENDPOINT}?apikey=${TWELVE_DATA_API_TOKEN}&symbol=${symbol}`;
};

export const createJobsForFetchingTwelveCurrentData = (symbols: SymbolConfigWithType[]) => {
  return symbols.map((symbolData) => {
    const job: QueueJob<TwelveQuote> = {
      request: async () => {
        const url = createCurrentDataUrl(symbolData.symbol);
        const { data } = await axios.get<TwelveQuote>(url);
        return data;
      },
      onRequestError: (error) =>
        console.warn(`Error when fetching Twelve current data for ${symbolData.symbol}:`, error),
      onRequestSuccessful(data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { close, timestamp, is_market_open, fifty_two_week, ...info } = data;

        setCurrentData(symbolData.symbol, {
          price: Number(close),
          time: timestamp * 1000,
        });

        const moreInfo: MoreInfo = {};
        Object.entries(info).map(([k, v]) => {
          let key = k.replace('_', ' ').toLowerCase();
          key = key[0].toUpperCase() + key.slice(1);
          moreInfo[key] = v;
        });

        setMoreInfoData(symbolData.symbol, moreInfo);
        console.log(`Done fetching Twelve current price for ${symbolData.symbol}`);
      },
      maxRetries: MAX_RETRIES_CURRENT_DATA,
    };
    return job;
  });
};
