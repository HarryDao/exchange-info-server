export interface WatchItemData {
  symbol: string;
  token: string;
  price: number;
  isLargerOrEqual: boolean;
}

export interface WatchItem extends WatchItemData {
  id: number;
  timestamp: number;
}

export interface WatchListMap {
  [symbol: string]: {
    [id: string]: WatchItem;
  };
}

export interface WatchList {
  [symbol: string]: WatchItem[];
}
