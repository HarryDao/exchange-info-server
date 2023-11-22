import { Router } from 'express';

import moreInfoController from '../controllers/moreInfoController';

export const moreInfoRouter = Router();

moreInfoRouter.get('/', moreInfoController.fetchMoreInfo);
