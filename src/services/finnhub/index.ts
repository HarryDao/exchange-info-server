import { DATA_FETCHING_INTERVAL, FINNHUB_API_QUOTA_PER_MINUTE } from '../../configs';
import { DATA_CONFIGS } from '../../data-configs';
import { DataProviderEnum, SymbolConfigWithType } from '../../types';
import { createRequestQueue } from '../queue';

import { createJobsForFetchingFinnhubCurrentData } from './current';
import { createJobsForFetchingFinnhubHistoricalData } from './historical';
import { createJobsForFetchingFinnhubAdditionalStockData } from './moreInfo';

import { initFinnhubSocket } from './socket';

const createAndRunQueue = async (symbols: SymbolConfigWithType[], isFirstTime?: boolean) => {
  const { addToQueue, startQueue } = createRequestQueue({
    creditQuota: {
      limit: FINNHUB_API_QUOTA_PER_MINUTE,
      waitingTimeForReset: 1 * 60 * 1000, // 1 minute
    },
  });

  addToQueue(...createJobsForFetchingFinnhubCurrentData(symbols));
  addToQueue(...createJobsForFetchingFinnhubHistoricalData(symbols, isFirstTime));
  addToQueue(...createJobsForFetchingFinnhubAdditionalStockData(symbols));

  await startQueue();
};

const startRequestLoop = async (symbols: SymbolConfigWithType[]) => {
  setInterval(async () => {
    await createAndRunQueue(symbols);
  }, DATA_FETCHING_INTERVAL);
  await createAndRunQueue(symbols, true);
};

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
    await startRequestLoop(symbols);
  }
  await initFinnhubSocket(symbols);
};
