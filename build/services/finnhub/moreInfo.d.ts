import { SymbolConfigWithType } from '../../types';
import { QueueJob } from '../queue';
export declare const createJobsForFetchingFinnhubAdditionalStockData: (symbols: SymbolConfigWithType[]) => QueueJob<{
    [key: string]: any;
}>[];
