import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

import { EXPO_ACCESS_TOKEN } from '../configs';
import { DataTypeEnum, WatchItem } from '../types';
import { DATA_CONFIGS_WITH_TYPE } from '../data-configs';
import { formatPrice } from '../helpers';

import { removeDeviceFromWatchList } from '.';

const composePriceAlertPushMessage = (item: WatchItem, price: number): ExpoPushMessage => {
  const config = DATA_CONFIGS_WITH_TYPE[item.symbol];
  const isForex = config.type === DataTypeEnum.FOREX;
  const body = `${isForex ? config.symbol : config.description} has reached ${formatPrice(price)}`;
  return {
    to: item.token,
    sound: 'default',
    title: 'Price Alert',
    body,
  };
};

export const { sendPriceAlertNotifications } = (() => {
  const expo = new Expo({ accessToken: EXPO_ACCESS_TOKEN });

  return {
    sendPriceAlertNotifications: async (items: WatchItem[], price: number) => {
      const messages = items
        .filter(({ token }) => {
          return Expo.isExpoPushToken(token);
        })
        .map((item) => composePriceAlertPushMessage(item, price));

      const chunks = expo.chunkPushNotifications(messages);
      const tickets: ExpoPushTicket[] = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }

      const ticketIdsToTokens: { [ticketId: string]: string } = {};
      const receiptIds: string[] = [];
      tickets.forEach((ticket, index) => {
        if (
          ticket.status === 'error' &&
          ticket.details?.error === 'DeviceNotRegistered' &&
          messages[index]
        ) {
          removeDeviceFromWatchList(messages[index].to as string);
          return;
        }

        if (ticket.status === 'ok' && ticket.id) {
          ticketIdsToTokens[ticket.id] = messages[index].to as string;
          receiptIds.push(ticket.id);
        }
      });

      const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
      for (const chunk of receiptIdChunks) {
        try {
          const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
          Object.entries(receipts).forEach(([receiptId, receipt]) => {
            if (
              receipt.status === 'error' &&
              receipt.details?.error === 'DeviceNotRegistered' &&
              ticketIdsToTokens[receiptId]
            ) {
              removeDeviceFromWatchList(ticketIdsToTokens[receiptId]);
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
  };
})();
