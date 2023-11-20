import { initFinhubService } from './finnhub';
import { initTwelveService } from './twelve';

export const initServices = async () => {
  await Promise.all([initFinhubService(), initTwelveService()]);
};
