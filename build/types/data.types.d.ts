export interface Candle {
    close: number;
    open: number;
    high: number;
    low: number;
    time: number;
}
export interface HistoricalData {
    [symbol: string]: Candle[];
}
export interface Current {
    price: number;
    time: number;
}
export interface CurrentData {
    [symbol: string]: Current;
}
export interface MoreInfo {
    [key: string]: any;
}
export interface MoreInfoData {
    [symbol: string]: MoreInfo;
}
export interface SocketLiveData extends Current {
    symbol: string;
}
