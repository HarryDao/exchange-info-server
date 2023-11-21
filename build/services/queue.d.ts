export interface QueueJob<T> {
    request: () => Promise<T>;
    isRequestSuccessful?: (data: T) => boolean;
    onRequestError: (error: any, currentTry: number) => void;
    onRequestSuccessful: (data: T) => void;
    maxRetries: number;
    currentTry?: number;
}
export declare const createRequestQueue: (options: {
    creditQuota: {
        limit: number;
        waitingTimeForReset: number;
    };
}) => {
    addToQueue: (...jobs: QueueJob<any>[]) => void;
    startQueue: () => Promise<void>;
};
