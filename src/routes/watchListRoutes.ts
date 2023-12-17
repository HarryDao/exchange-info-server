import { Router } from 'express';

import watchListController from '../controllers/watchListController';

export const watchListRouter = Router();

watchListRouter.get('/', watchListController.getFetchWatchList);
watchListRouter.post('/', watchListController.postAddToWatchList);
watchListRouter.put('/:id', watchListController.putUpdateWatchItem);
watchListRouter.delete('/:id', watchListController.deleteRemoveWatchItem);
