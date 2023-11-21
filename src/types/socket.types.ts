export enum SocketEventEum {
  NEW_DATA = 'new-data',
}

export interface SocketNewData {
  symbol: string;
  price: number;
  time: number;
}
