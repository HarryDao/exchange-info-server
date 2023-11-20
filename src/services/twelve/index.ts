import { DATA_CONFIGS } from '../../data-configs';
import { DataProviderEnum, SymbolConfigWithType } from '../../types';

import { fetchTwelveCurrentData } from './current';

import { initTwelveHistoricalFetchingLoop } from './historical';
import { initTwelveSocket } from './socket';

export const initTwelveService = async () => {
  const symbols: SymbolConfigWithType[] = [];
  DATA_CONFIGS.forEach((config) => {
    if (config.provider === DataProviderEnum.TWELVE) {
      config.symbols.forEach((symbol) => {
        symbols.push({
          ...symbol,
          type: config.type,
        });
      });
    }
  });

  if (!process.env.USE_SAMPLE_DATA) {
    await initTwelveHistoricalFetchingLoop(symbols);
    await new Promise((res) => setTimeout(res, 60 * 1000)); // wait 1 minute because of API Limit
    await fetchTwelveCurrentData(symbols);
  }

  await initTwelveSocket(symbols);
};
