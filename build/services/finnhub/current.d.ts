import { FinnhubQuote, SymbolConfigWithType } from '../../types';
import { QueueJob } from '../queue';
export declare const createJobsForFetchingFinnhubCurrentData: (symbols: SymbolConfigWithType[]) => QueueJob<FinnhubQuote>[];
