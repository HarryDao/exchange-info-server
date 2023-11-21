export interface QueueJob<T> {
  request: () => Promise<T>;
  isRequestSuccessful?: (data: T) => boolean;
  onRequestError: (error: any, currentTry: number) => void;
  onRequestSuccessful: (data: T) => void;
  maxRetries: number;
  currentTry?: number;
}

export const createRequestQueue = (options: {
  creditQuota: {
    limit: number;
    waitingTimeForReset: number;
  };
}) => {
  const queue: QueueJob<any>[] = [];

  const addToQueue = (...jobs: QueueJob<any>[]) => {
    queue.push(...jobs);
  };

  const startQueue = async () => {
    let currentCreditCount = 0;
    while (queue.length) {
      if (currentCreditCount === options.creditQuota.limit) {
        await new Promise((res) => setTimeout(res, options.creditQuota.waitingTimeForReset));
        currentCreditCount = 0;
      }

      const job = queue.shift()!;
      currentCreditCount += 1;

      const { request, isRequestSuccessful, onRequestError, onRequestSuccessful, maxRetries } = job;
      const currentTry = job.currentTry || 0;

      try {
        if (currentTry >= maxRetries) {
          continue;
        }

        const data = await request();
        const isSuccessful = isRequestSuccessful ? isRequestSuccessful(data) : true;

        if (!isSuccessful) {
          throw new Error('request is not successful');
        }

        onRequestSuccessful(data);
      } catch (error) {
        onRequestError(error, currentTry);
        if (currentTry + 1 < maxRetries) {
          queue.push({
            ...job,
            currentTry: currentTry + 1,
          });
        }
      }
    }
  };

  return {
    addToQueue,
    startQueue,
  };
};
