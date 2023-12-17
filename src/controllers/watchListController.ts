import { Request, Response } from 'express';

import { validate } from '../utils';
import {
  DeleteWatchItemQueryDto,
  DeleteWatchItemParamsDto,
  GetWatchListQueryDto,
  PostAddToWatchListDto,
  PutUpdateWatchListItemParamsDto,
} from '../dto/watchList';
import {
  addToWatchList,
  getWatchListFor1Device,
  removeWatchListItem,
  updateWatchListItem,
} from '../watchList';
import { WatchItemData } from '../types';

const getFetchWatchList = async (req: Request, res: Response) => {
  let symbols: string[] = [];
  let token;
  try {
    const dto = await validate(req.query, GetWatchListQueryDto);
    symbols = dto.symbols.split(',');
    token = dto.token;
  } catch (error) {
    return res.status(403).send(error.message);
  }

  const watchList = getWatchListFor1Device(token, symbols);
  return res.status(200).send({ data: watchList });
};

const postAddToWatchList = async (req: Request, res: Response) => {
  let itemData: WatchItemData;
  try {
    itemData = await validate(req.body, PostAddToWatchListDto);
  } catch (error) {
    return res.status(403).send(error.message);
  }

  const item = addToWatchList(itemData);
  return res.status(200).send({ data: item });
};

const putUpdateWatchItem = async (req: Request, res: Response) => {
  let id: string;
  let itemData: WatchItemData;
  try {
    ({ id } = await validate(req.params, PutUpdateWatchListItemParamsDto));
    itemData = await validate(req.body, PostAddToWatchListDto);
  } catch (error) {
    return res.status(403).send(error.message);
  }

  const updatedItem = updateWatchListItem(id, itemData);
  if (!updatedItem) {
    return res.status(404).send('Item not found');
  }
  return res.status(200).send({ data: updatedItem });
};

const deleteRemoveWatchItem = async (req: Request, res: Response) => {
  let id: string, token: string, symbol: string;
  try {
    ({ id } = await validate(req.params, DeleteWatchItemParamsDto));
    ({ token, symbol } = await validate(req.query, DeleteWatchItemQueryDto));
  } catch (error) {
    return res.status(403).send(error.message);
  }

  const isDeleted = removeWatchListItem(token, symbol, id);
  if (!isDeleted) {
    return res.status(404).send('Item not found');
  }
  return res.status(200).send({ deleted: true });
};

export default {
  getFetchWatchList,
  postAddToWatchList,
  putUpdateWatchItem,
  deleteRemoveWatchItem,
};
