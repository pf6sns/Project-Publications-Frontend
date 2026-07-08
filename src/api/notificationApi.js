/**
 * api/notificationApi.js
 *
 * Notifications API layer.
 * Talks to real backend endpoints.
 *
 * Backend now returns the same shape for both roles:
 *   { success: true, unread_count: N, data: [{ notification_id, type, title, message, publication_id, is_read, created_at }] }
 */

import { apiClient, unwrap } from './apiClient';

/**
 * Fetches notifications for the current user.
 * GET /api/notifications
 *
 * @returns {{ unreadCount: number, items: object[] }}
 */
export const fetchNotifications = async () => {
  const res = await apiClient.get('/notifications');
  const body = unwrap(res);
  const items = (body.data || []).map(n => ({
    id: n.notification_id,
    type: n.type,
    title: n.title,
    message: n.message,
    publicationId: n.publication_id,
    read: n.is_read,
    timestamp: n.created_at,
  }));
  return { unreadCount: body.unread_count ?? 0, items };
};

/**
 * Marks a single notification as read.
 * PUT /api/notifications/read/:id
 */
export const markAsRead = async (notificationId) => {
  const res = await apiClient.put(`/notifications/read/${notificationId}`);
  return unwrap(res);
};

/**
 * Marks all notifications as read.
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = async () => {
  const res = await apiClient.put('/notifications/read-all');
  return unwrap(res);
};
