import { SymbolConfigWithType, TwelveTimeSeriesResponse } from '../../types';
import { QueueJob } from '../queue';
export declare const createJobsForFetchingHistoricalData: (symbols: SymbolConfigWithType[], isFirstTime?: boolean) => QueueJob<TwelveTimeSeriesResponse>[];
