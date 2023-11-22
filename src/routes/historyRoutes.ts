import { Router } from 'express';

import historyController from '../controllers/historyController';

export const historyRouter = Router();

historyRouter.get('/short', historyController.fetchHistoryShort);
historyRouter.get('/long', historyController.fetchHistoryLong);
