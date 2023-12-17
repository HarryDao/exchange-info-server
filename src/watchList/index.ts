import { INTERVAL_TO_REMOVE_EXPIRED_WATCH_ITEMS, WATCH_ITEM_EXPIRY } from '../configs';
import { WatchItem, WatchItemData, WatchListMap, WatchList } from '../types';

import { sendPriceAlertNotifications } from './notifications';

export const {
  initWatchList,
  addToWatchList,
  getWatchListFor1Device,
  updateWatchListItem,
  removeWatchListItem,
  removeDeviceFromWatchList,
  alertWatchList,
} = (() => {
  let watchList: WatchListMap = {};

  return {
    initWatchList: () => {
      console.log('Init watchlist');
      setInterval(() => {
        const min = new Date().getTime() - WATCH_ITEM_EXPIRY;
        const filtered: WatchListMap = {};
        Object.entries(watchList).map(([symbol, items]) => {
          filtered[symbol] = {};
          Object.values(items).forEach((item) => {
            if (item.timestamp > min) {
              filtered[symbol][item.id] = item;
            }
          });
        });
        watchList = filtered;
      }, INTERVAL_TO_REMOVE_EXPIRED_WATCH_ITEMS);
    },
    addToWatchList: (itemData: WatchItemData) => {
      if (!watchList[itemData.symbol]) watchList[itemData.symbol] = {};
      const time = new Date().getTime();
      const item: WatchItem = {
        ...itemData,
        id: time,
        timestamp: time,
      };
      watchList[item.symbol][item.id] = item;
      return item;
    },
    getWatchListFor1Device: (token: string, symbols: string[]) => {
      const list: WatchList = {};
      symbols.forEach((symbol) => {
        list[symbol] = [];
        if (watchList[symbol]) {
          list[symbol] = Object.values(watchList[symbol]).filter((item) => {
            return item.token === token;
          });
        }
      });
      return list;
    },
    updateWatchListItem: (id: number | string, data: WatchItemData) => {
      if (
        !watchList[data.symbol] ||
        !watchList[data.symbol][id] ||
        watchList[data.symbol][id].token !== data.token
      )
        return null;
      watchList[data.symbol][id] = {
        ...watchList[data.symbol][id],
        ...data,
        timestamp: new Date().getTime(),
      };
      return watchList[data.symbol][id];
    },
    removeWatchListItem: (token: string, symbol: string, id: number | string) => {
      if (!watchList[symbol] || !watchList[symbol][id] || watchList[symbol][id].token !== token)
        return false;
      delete watchList[symbol][id];
      return true;
    },
    removeDeviceFromWatchList: (token: string) => {
      const filtered: WatchListMap = {};
      Object.entries(watchList).map(([symbol, items]) => {
        filtered[symbol] = {};
        Object.values(items).forEach((item) => {
          if (item.token !== token) filtered[symbol][item.id] = item;
        });
      });
      watchList = filtered;
    },
    alertWatchList: (symbol: string, price: number) => {
      const items = watchList[symbol] || {};
      const toBeAlerted: WatchItem[] = [];
      const left: { [id: string]: WatchItem } = {};
      Object.values(items).forEach((item) => {
        if (item.isLargerOrEqual && price >= item.price) {
          toBeAlerted.push(item);
          return;
        }
        if (!item.isLargerOrEqual && price <= item.price) {
          toBeAlerted.push(item);
          return;
        }
        left[item.id] = item;
      });

      watchList[symbol] = left;

      void sendPriceAlertNotifications(toBeAlerted, price);
    },
  };
})();
