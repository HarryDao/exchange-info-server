import { Request, Response } from 'express';

import { validate } from '../utils';
import { GetHistoryLongParamsDto, GetHistoryShortQueryDto } from '../dto';
import { getLongHistoricalData, getShortHistoricalData } from '../data';

const fetchHistoryShort = async (req: Request, res: Response) => {
  let symbols: string[] = [];
  try {
    const { symbols: symbolsString } = await validate(req.query, GetHistoryShortQueryDto);
    symbols = symbolsString.split(',');
  } catch (error) {
    return res.status(403).send(error.message);
  }

  const shortHistoricalData = getShortHistoricalData(symbols);
  return res.status(200).send({ shortHistoricalData });
};

const fetchHistoryLong = async (req: Request, res: Response) => {
  let symbol: string;
  try {
    const dto = await validate(req.params, GetHistoryLongParamsDto);
    symbol = dto.symbol;
  } catch (error) {
    return res.status(403).send(error.message);
  }

  const candles = getLongHistoricalData(symbol);
  return res.status(200).send({ candles });
};

export default {
  fetchHistoryShort,
  fetchHistoryLong,
};
