import { FinnhubCandles, SymbolConfigWithType } from '../../types';
import { QueueJob } from '../queue';
export declare const createJobsForFetchingFinnhubHistoricalData: (symbols: SymbolConfigWithType[], isFirstTime?: boolean) => QueueJob<FinnhubCandles>[];
