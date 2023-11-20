import { Request, Response } from 'express';

import { getCurrentData } from '../data';

const fetchCurrentData = (req: Request, res: Response) => {
  const currentData = getCurrentData();
  return res.status(200).send({ currentData });
};

export default {
  fetchCurrentData,
};
