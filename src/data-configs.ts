import { DataConfig, DataProviderEnum, DataTypeEnum, SymbolConfigWithType } from './types';

export const DATA_CONFIGS: DataConfig[] = [
  {
    type: DataTypeEnum.STOCK,
    provider: DataProviderEnum.FINNHUB,
    symbols: [
      {
        symbol: 'AAPL',
        description: 'Apple Inc',
      },
      {
        symbol: 'MSFT',
        description: 'Microsoft Corp',
      },
      {
        symbol: 'GOOG',
        description: 'Alphabet Inc Class C',
      },
      {
        symbol: 'AMZN',
        description: 'Amazon.com, Inc',
      },
      {
        symbol: 'NVDA',
        description: 'NVIDIA Corp',
      },
      {
        symbol: 'TSLA',
        description: 'Tesla Inc',
      },
      {
        symbol: 'META',
        description: 'Meta Platforms Inc',
      },
      {
        symbol: 'BRK-B',
        description: 'Berkshire Hathaway',
      },
      {
        symbol: 'LLY',
        description: 'Eli Lilly And Co',
      },
      {
        symbol: 'V',
        description: 'Visa Inc',
      },
    ],
  },
  {
    type: DataTypeEnum.FOREX,
    provider: DataProviderEnum.TWELVE,
    symbols: [
      {
        symbol: 'EUR/USD',
        description: 'Euro to US Dollar',
      },
      {
        symbol: 'USD/JPY',
        description: 'US Dollar to Yen',
      },
      {
        symbol: 'GBP/USD',
        description: 'British Pound to US Dollar',
      },
      {
        symbol: 'AUD/USD',
        description: 'Australian Dollar to US Dollar',
      },
      {
        symbol: 'USD/CAD',
        description: 'US Dollar to Canadian Dollar',
      },
    ],
  },
  {
    type: DataTypeEnum.CRYPTO,
    provider: DataProviderEnum.FINNHUB,
    symbols: [
      {
        description: 'Bitcoin',
        displaySymbol: 'BTC/USDT',
        symbol: 'BINANCE:BTCUSDT',
      },
      {
        description: 'Etherium',
        displaySymbol: 'ETH/USDT',
        symbol: 'BINANCE:ETHUSDT',
      },
      {
        description: 'Litecoin',
        displaySymbol: 'LTC/USDT',
        symbol: 'BINANCE:LTCUSDT',
      },
    ],
  },
];

export const DATA_CONFIGS_WITH_TYPE = (() => {
  const map: { [symbol: string]: SymbolConfigWithType } = {};
  DATA_CONFIGS.forEach(({ type, symbols }) => {
    symbols.forEach((symbolConfig) => {
      map[symbolConfig.symbol] = {
        ...symbolConfig,
        type,
      };
    });
  });
  return map;
})();
