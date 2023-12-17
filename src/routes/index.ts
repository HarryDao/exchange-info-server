import { Request, Response, Router } from 'express';

import { DATA_CONFIGS } from '../data-configs';

import { historyRouter } from './historyRoutes';
import { currentRouter } from './currentRoutes';
import { moreInfoRouter } from './moreInfoRoutes';
import { watchListRouter } from './watchListRoutes';

export const router = Router();

router.get('/ping', (req: Request, res: Response) => res.status(200).send('pong'));
router.get('/data-configs', (req: Request, res: Response) => {
  res.status(200).json({ data: DATA_CONFIGS });
});

router.use('/history', historyRouter);
router.use('/current', currentRouter);
router.use('/more-info', moreInfoRouter);
router.use('/watch-list', watchListRouter);
