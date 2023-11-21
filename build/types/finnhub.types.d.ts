export declare enum FinnhubCandleStatusEnum {
    OK = "ok",
    NO_DATA = "no_data"
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
    c: number;
    d: number;
    dp: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
}
export interface FinnhubTrade {
    s: string;
    t: number;
    v: number;
    p: number;
}
export interface FinnhubTradeDataResponse {
    data: FinnhubTrade[];
    type: 'trade';
}
