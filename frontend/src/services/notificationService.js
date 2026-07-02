/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as notifApi from '../api/notificationApi';

export const getNotifications = async () => {
  return await notifApi.fetchNotifications();
};

export const markNotificationsAsRead = async () => {
  return await notifApi.markAllRead();
};

export const logSystemEvent = async (userId, userName, userRole, pubId, pubTitle, action, details, notifMessage, notifType) => {
  const timestamp = new Date().toISOString();
  const activity = {
    id: 'ACT-' + Math.floor(1000 + Math.random() * 9000),
    userId, userName, userRole, publicationId: pubId, publicationTitle: pubTitle, action, details, timestamp
  };
  
  await notifApi.logActivity(activity);

  if (notifMessage && userRole !== 'Admin') {
    const notif = {
      id: 'NOT-' + Math.floor(10000 + Math.random() * 90000),
      userId, title: action, message: notifMessage, timestamp, read: false, type: notifType, publicationId: pubId
    };
    await notifApi.addNotification(notif);
  }
};
