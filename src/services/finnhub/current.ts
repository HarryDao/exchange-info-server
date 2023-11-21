import axios from 'axios';

import {
  FINNHUB_API_URL,
  FINNHUB_QUOTE_ENDPOINT,
  FINNHUB_REST_API_TOKEN,
  MAX_RETRIES_CURRENT_DATA,
} from '../../configs';
import { FinnhubQuote, SymbolConfigWithType } from '../../types';
import { QueueJob } from '../queue';
import { setCurrentData, setMoreInfoData } from '../../data';

const createCurrentDataUrl = (symbol: string) => {
  return `${FINNHUB_API_URL}/${FINNHUB_QUOTE_ENDPOINT}?token=${FINNHUB_REST_API_TOKEN}&symbol=${symbol}`;
};

export const createJobsForFetchingFinnhubCurrentData = (symbols: SymbolConfigWithType[]) => {
  return symbols.map((symbolData) => {
    const job: QueueJob<FinnhubQuote> = {
      request: async () => {
        const { data } = await axios.get<FinnhubQuote>(createCurrentDataUrl(symbolData.symbol));
        return data;
      },
      onRequestError: (error) => {
        console.warn(`Error when fetching Finnhub current data for ${symbolData.symbol}:`, error);
      },
      onRequestSuccessful: (quote) => {
        setCurrentData(symbolData.symbol, {
          price: quote.c,
          time: quote.t * 1000,
        });

        setMoreInfoData(symbolData.symbol, {
          'High price of the day': quote.h,
          'Low price of the day': quote.l,
          'Open price of the day': quote.o,
          'Previous close price': quote.pc,
        });

        console.log(`Done fetching Finnhub current price for ${symbolData.symbol}`);
      },
      maxRetries: MAX_RETRIES_CURRENT_DATA,
    };
    return job;
  });
};
