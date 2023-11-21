// Unit of the chart
export const HISTORICAL_UNIT = 1 * 24 * 60 * 60 * 1000; // 1 day
export const HISTORICAL_API_TWELVE_DATA_UNIT = '1day';
export const HISTORICAL_FINNHUB_RESOLUTION = 'D'; // day
// Length of the detailed chart
export const LONG_HISTORICAL_LENGTH = 90; // 90 days
// Length of the mini chart
export const SHORT_HISTORICAL_LENGTH = 30; // 30 days

// Retry when fail to fetch historical data
export const MAX_RETRIES_HISTORICAL_DATA_FIRST_TIME = 10;
export const MAX_RETRIES_HISTORICAL_DATA_SUBSEQUENT_TIME = 5;

// Retry when fail to fetch current data
export const MAX_RETRIES_CURRENT_DATA = 2;

// Historical data fetching interval
export const DATA_FETCHING_INTERVAL = 1 * 24 * 60 * 60 * 1000; // ms

// Live data
export const SOCKET_WAIT_TIME_BEFORE_RESET = 30 * 60 * 1000; // 30 minutes
