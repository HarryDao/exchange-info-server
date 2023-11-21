import { Request, Response } from 'express';

import { getMoreInfoForSymbol } from '../data';
import { validate } from '../utils';
import { GetMoreInfoParamsDto } from '../dto';

const fetchMoreInfo = async (req: Request, res: Response) => {
  let symbol: string;
  try {
    const dto = await validate(req.params, GetMoreInfoParamsDto);
    symbol = dto.symbol;
  } catch (error) {
    return res.status(403).send(error.message);
  }

  const info = getMoreInfoForSymbol(symbol);
  return res.status(200).send({ info });
};

export default {
  fetchMoreInfo,
};
