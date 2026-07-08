/**
 * services/notificationService.js
 *
 * Notification Service.
 * Thin wrapper around notificationApi.
 *
 * Removed: logSystemEvent, notifyAdminNewPublication, notifyFacultyPublicationReviewed
 * (notifications are now server-generated on events).
 */

import * as notifApi from '../api/notificationApi';

/**
 * Fetches notifications for the logged-in user.
 *
 * @returns {{ unreadCount: number, items: object[] }}
 */
export const getNotifications = async () => {
  return await notifApi.fetchNotifications();
};

/**
 * Marks a single notification as read.
 *
 * @param {string} id
 */
export const markNotificationAsRead = async (id) => {
  return await notifApi.markAsRead(id);
};

/**
 * Marks all notifications as read.
 */
export const markAllNotificationsAsRead = async () => {
  return await notifApi.markAllAsRead();
};
