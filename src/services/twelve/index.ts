import { DATA_FETCHING_INTERVAL, TWELVE_API_QUOTA_PER_MINUTE } from '../../configs';
import { DATA_CONFIGS } from '../../data-configs';
import { DataProviderEnum, SymbolConfigWithType } from '../../types';
import { createRequestQueue } from '../queue';

import { createJobsForFetchingTwelveCurrentData } from './current';

import { createJobsForFetchingHistoricalData } from './historical';
import { initTwelveSocket } from './socket';

const createAndRunQueue = async (symbols: SymbolConfigWithType[], isFirstTime?: boolean) => {
  const { addToQueue, startQueue } = createRequestQueue({
    creditQuota: {
      limit: TWELVE_API_QUOTA_PER_MINUTE,
      waitingTimeForReset: 1 * 60 * 1000, // 1 minute
    },
  });

  addToQueue(...createJobsForFetchingTwelveCurrentData(symbols));
  addToQueue(...createJobsForFetchingHistoricalData(symbols, isFirstTime));

  await startQueue();
};

const startRequestLoop = async (symbols: SymbolConfigWithType[]) => {
  setInterval(async () => {
    await createAndRunQueue(symbols);
  }, DATA_FETCHING_INTERVAL);
  await createAndRunQueue(symbols, true);
};

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
    await startRequestLoop(symbols);
  }

  await initTwelveSocket(symbols);
};
