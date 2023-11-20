import fs from 'fs';

import { SHORT_HISTORICAL_LENGTH } from '../configs/data';
import { HistoricalData, CurrentData, Candle, Current } from '../types';

import SAMPLE_CURRENT_DATA from './sample/sample-current.json';
import SAMPLE_HISTORICAL_DATA from './sample/sample-historical.json';

export const {
  getAllLongHistoricalData,
  getLongHistoricalData,
  getShortHistoricalData,
  setHistoricalData,
  getCurrentData,
  setCurrentData,
  saveToLocal,
} = (() => {
  const historicalData: HistoricalData = process.env.USE_SAMPLE_DATA ? SAMPLE_HISTORICAL_DATA : {};
  const currentData: CurrentData = process.env.USE_SAMPLE_DATA ? SAMPLE_CURRENT_DATA : {};

  return {
    saveToLocal: () => {
      console.log('Saving data to local files...');
      fs.writeFileSync(
        `${__dirname}/sample/sample-current.json`,
        JSON.stringify(currentData, null, 2)
      );
      fs.writeFileSync(
        `${__dirname}/sample/sample-historical.json`,
        JSON.stringify(historicalData, null, 2)
      );
      console.log('Saved to local files');
    },
    getAllLongHistoricalData: () => historicalData,
    getLongHistoricalData: (symbol: string) => {
      return historicalData[symbol] || [];
    },
    getShortHistoricalData: (symbols?: string[]) => {
      const short: HistoricalData = {};

      // all symbols
      if (!symbols) {
        Object.entries(historicalData).forEach(([symbol, data]) => {
          short[symbol] = data.slice(0, SHORT_HISTORICAL_LENGTH);
        });
        return short;
      }

      // targeted symbols
      symbols.forEach((symbol) => {
        if (!historicalData[symbol]) return;
        short[symbol] = historicalData[symbol].slice(0, SHORT_HISTORICAL_LENGTH);
      });
      return short;
    },
    setHistoricalData: (symbol: string, candles: Candle[]) => {
      candles.sort((a, b) => {
        return a.time > b.time ? -1 : 1;
      });

      // Temporarily set current data to latest historical data if it is unavailable
      if (!currentData[symbol]) {
        currentData[symbol] = {
          price: candles[0].close,
          time: candles[0].time,
        };
      }
      historicalData[symbol] = candles;
    },
    getCurrentData: () => currentData,
    setCurrentData: (symbol: string, data: Current) => {
      currentData[symbol] = { ...(currentData[symbol] || {}), ...data };
    },
  };
})();
