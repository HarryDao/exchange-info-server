import fs from 'fs';

import { SHORT_HISTORICAL_LENGTH } from '../configs/data';
import { HistoricalData, CurrentData, Candle, Current, MoreInfoData, MoreInfo } from '../types';

import { alertWatchList } from '../watchList';

import SAMPLE_CURRENT_DATA from './sample/sample-current.json';
import SAMPLE_HISTORICAL_DATA from './sample/sample-historical.json';
import SAMPLE_MORE_INFO_DATA from './sample/sample-more-info.json';

export const {
  getAllLongHistoricalData,
  getLongHistoricalData,
  getShortHistoricalData,
  setHistoricalData,
  getCurrentData,
  setCurrentData,
  getMoreInfoData,
  getMoreInfoForSymbol,
  setMoreInfoData,
  saveToLocal,
} = (() => {
  const historicalData: HistoricalData = process.env.USE_SAMPLE_DATA ? SAMPLE_HISTORICAL_DATA : {};
  const currentData: CurrentData = process.env.USE_SAMPLE_DATA ? SAMPLE_CURRENT_DATA : {};
  const moreInfoData: MoreInfoData = process.env.USE_SAMPLE_DATA ? SAMPLE_MORE_INFO_DATA : {};

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
      fs.writeFileSync(
        `${__dirname}/sample/sample-more-info.json`,
        JSON.stringify(moreInfoData, null, 2)
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
    setCurrentData: (symbol: string, data: Current, alert?: boolean) => {
      const existing = currentData[symbol];
      if (!existing || existing.time < data.time) {
        currentData[symbol] = data;
      }
      if (alert) {
        alertWatchList(symbol, data.price);
      }
    },
    getMoreInfoData: () => moreInfoData,
    getMoreInfoForSymbol: (symbol: string) => {
      return moreInfoData[symbol] || {};
    },
    setMoreInfoData: (symbol: string, moreInfo: MoreInfo) => {
      moreInfoData[symbol] = {
        ...(moreInfoData[symbol] || {}),
        ...moreInfo,
      };
    },
  };
})();
