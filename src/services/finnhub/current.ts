import axios from 'axios';

import {
  FINNHUB_API_URL,
  MAX_RETRIES_CURRENT_DATA,
  FINNHUB_QUOTE_ENDPOINT,
  FINNHUB_REST_API_TOKEN,
  FINNHUB_STOCK_PROFILE2_ENDPOINT,
} from '../../configs';

import { Current, DataTypeEnum, FinnhubQuote, SymbolConfigWithType } from '../../types';

import { setCurrentData } from '../../data';

const createCurrentDataUrl = (symbol: string) => {
  return `${FINNHUB_API_URL}/${FINNHUB_QUOTE_ENDPOINT}?token=${FINNHUB_REST_API_TOKEN}&symbol=${symbol}`;
};

const createStockProfileUrl = (symbol: string) => {
  return `${FINNHUB_API_URL}/${FINNHUB_STOCK_PROFILE2_ENDPOINT}?token=${FINNHUB_REST_API_TOKEN}&symbol=${symbol}`;
};

const convertFinnhubQuoteToCurrentPrice = (
  quote: FinnhubQuote,
  additionalData: { [key: string]: any }
): Current => {
  const info: { [key: string]: any } = {};
  Object.entries(additionalData).forEach(([k, v]) => {
    let key = k.replace(/([A-Z])/g, ' $1');
    key = key.toLowerCase();
    key = key[0].toUpperCase() + key.slice(1);
    info[key] = v;
  });

  return {
    price: quote.c,
    time: quote.t * 1000,
    info,
  };
};

export const fetchFinnhubCurrentData = async (symbols: SymbolConfigWithType[]) => {
  let retries = 0;
  let nextRun = [...symbols];

  while (retries < MAX_RETRIES_CURRENT_DATA && nextRun.length) {
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, 2000));
    }

    const toRun = [...nextRun];
    nextRun = [];

    for (const symbolData of toRun) {
      try {
        const { data } = await axios.get<FinnhubQuote>(createCurrentDataUrl(symbolData.symbol));
        let additionalData = {};
        if (symbolData.type === DataTypeEnum.STOCK) {
          const additionalDataRes = await axios.get<any>(createStockProfileUrl(symbolData.symbol));
          additionalData = additionalDataRes.data;
        }
        const current = convertFinnhubQuoteToCurrentPrice(data, additionalData);
        setCurrentData(symbolData.symbol, current);
        console.log(`Done fetching Finnhub current price for ${symbolData.symbol}`);
      } catch (error) {
        console.warn(`Error when fetching Finnhub current data for ${symbolData.symbol}:`, error);
        nextRun.push(symbolData);
      }
    }

    retries += 1;
  }

  if (nextRun.length) {
    console.warn(`Failed to fetch Finnhub current data for: ${JSON.stringify(nextRun, null, 2)}`);
  }
};
