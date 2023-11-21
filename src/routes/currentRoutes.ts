import { Router } from 'express';

import currentController from '../controllers/currentController';

export const currentRouter = Router();

currentRouter.get('/', currentController.fetchCurrentData);
