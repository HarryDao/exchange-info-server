export enum FinnhubCandleStatusEnum {
  OK = 'ok',
  NO_DATA = 'no_data',
}

export interface FinnhubCandles {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  t: number[];
  v: number[];
  s: FinnhubCandleStatusEnum;
}

export interface FinnhubQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percentage change
  h: number; // high price
  l: number; // low price
  o: number; // open price
  pc: number; // previous close price
  t: number; // time
}

export interface FinnhubTrade {
  s: string; // symbol
  t: number; // time
  v: number; // volume
  p: number; // last price
}

export interface FinnhubTradeDataResponse {
  data: FinnhubTrade[];
  type: 'trade';
}
