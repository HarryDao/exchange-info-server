import { SymbolConfigWithType, TwelveQuote } from '../../types';
import { QueueJob } from '../queue';
export declare const createJobsForFetchingTwelveCurrentData: (symbols: SymbolConfigWithType[]) => QueueJob<TwelveQuote>[];
