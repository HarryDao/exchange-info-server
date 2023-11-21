export interface TwelveTimeSeriesMeta {
    symbol: string;
    interval: string;
    currency: string;
    exchange_timezone: string;
    exchange: string;
    mic_code: string;
    type: string;
}
export interface TwelveTimeSeriesUnit {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
}
export interface TwelveTimeSeriesResponse {
    meta: TwelveTimeSeriesMeta;
    values: TwelveTimeSeriesUnit[];
    status: string;
}
export interface TwelveQuote {
    symbol: string;
    name: string;
    exchange: string;
    mic_code: string;
    currency: string;
    datetime: string;
    timestamp: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    previous_close: string;
    change: string;
    percent_change: string;
    average_volume: string;
    is_market_open: boolean;
    fifty_two_week: {
        low: string;
        high: string;
        low_change: string;
        high_change: string;
        low_change_percent: string;
        high_change_percent: string;
        range: string;
    };
}
export interface TwelveSocketPrice {
    event: 'price';
    symbol: string;
    currency_base: string;
    currency_quote: string;
    exchange: string;
    type: string;
    timestamp: number;
    price: number;
    day_volume: number;
}
