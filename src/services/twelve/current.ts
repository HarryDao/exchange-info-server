import axios from 'axios';

import {
  MAX_RETRIES_CURRENT_DATA,
  TWELVE_API_URL,
  TWELVE_DATA_API_TOKEN,
  TWELVE_QUOTE_ENDPOINT,
} from '../../configs';
import { Current, SymbolConfigWithType, TwelveQuote } from '../../types';
import { setCurrentData } from '../../data';

const createCurrentDataUrl = (symbol: string) => {
  return `${TWELVE_API_URL}/${TWELVE_QUOTE_ENDPOINT}?apikey=${TWELVE_DATA_API_TOKEN}&symbol=${symbol}`;
};

const convertTwelveQuoteToCurrentPrice = ({
  close,
  timestamp,
  symbol,
  name,
  exchange,
}: TwelveQuote): Current => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return {
    price: Number(close),
    time: timestamp,
    info: { Symbol: symbol, Name: name, Exchange: exchange },
  };
};

export const fetchTwelveCurrentData = async (symbols: SymbolConfigWithType[]) => {
  let retries = 0;
  let nextRun = [...symbols];

  while (retries < MAX_RETRIES_CURRENT_DATA && nextRun.length) {
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, 2000));
    }

    const toRun = [...nextRun];
    nextRun = [];

    for (const symbolData of toRun) {
      const url = createCurrentDataUrl(symbolData.symbol);
      try {
        const { data } = await axios.get<TwelveQuote>(url);
        const current = convertTwelveQuoteToCurrentPrice(data);
        setCurrentData(symbolData.symbol, current);
        console.log(`Done fetching Twelve current price for ${symbolData.symbol}`);
      } catch (error) {
        console.warn(`Error when fetching Twelve current data for ${symbolData.symbol}:`, error);
        nextRun.push(symbolData);
      }
    }

    retries += 1;
  }

  if (nextRun.length) {
    console.warn(`Failed to fetch Twelve current data for: ${JSON.stringify(nextRun, null, 2)}`);
  }
};
