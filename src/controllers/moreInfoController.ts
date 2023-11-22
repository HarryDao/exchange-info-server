import { Request, Response } from 'express';

import { getMoreInfoForSymbol } from '../data';
import { validate } from '../utils';
import { GetMoreInfoQueryDto } from '../dto';

const fetchMoreInfo = async (req: Request, res: Response) => {
  let symbol: string;
  try {
    const dto = await validate(req.query, GetMoreInfoQueryDto);
    symbol = dto.symbol;
  } catch (error) {
    return res.status(403).send(error.message);
  }

  const info = getMoreInfoForSymbol(symbol);
  return res.status(200).send({ data: info });
};

export default {
  fetchMoreInfo,
};
