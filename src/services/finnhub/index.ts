import { DATA_CONFIGS } from '../../data-configs';
import { DataProviderEnum, SymbolConfigWithType } from '../../types';

import { fetchFinnhubCurrentData } from './current';

import { initFinnhubHistoricalFetchingLoop } from './historical';
import { initFinnhubSocket } from './socket';

export const initFinhubService = async () => {
  const symbols: SymbolConfigWithType[] = [];
  DATA_CONFIGS.forEach((config) => {
    if (config.provider === DataProviderEnum.FINNHUB) {
      config.symbols.forEach((symbol) => {
        symbols.push({
          ...symbol,
          type: config.type,
        });
      });
    }
  });

  if (!process.env.USE_SAMPLE_DATA) {
    await initFinnhubHistoricalFetchingLoop(symbols);
    await fetchFinnhubCurrentData(symbols);
  }
  await initFinnhubSocket(symbols);
};
