/**
 * api/notificationApi.js
 *
 * Notifications and activity log API layer.
 * Currently uses localStorage for persistence.
 *
 * When backend is ready, replace with Axios calls:
 *   import { apiClient } from './apiClient';
 *   return apiClient.get('/notifications');
 *   return apiClient.post('/notifications');
 *   return apiClient.patch('/notifications/mark-all-read');
 *   return apiClient.get('/activity-log');
 *   return apiClient.post('/activity-log');
 */

import { simulateNetwork, getFromStorage, saveToStorage } from './apiClient';
import { initialActivities, initialNotifications } from '../mocks/notifications.mock.js';

const ACTIVITIES_KEY = 'rpms_activities';
const NOTIFICATIONS_KEY = 'rpms_notifications';

// ─────────────────────────────────────────────────────────────────────────────
// Activity Log
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all activity log entries.
 * Future: GET /api/activity-log
 */
export const fetchActivities = async () => {
  await simulateNetwork(50);
  return getFromStorage(ACTIVITIES_KEY, initialActivities);
};

/**
 * Appends a new activity log entry.
 * Future: POST /api/activity-log
 *
 * @param {object} activity
 */
export const logActivity = async (activity) => {
  await simulateNetwork(50);
  const activities = getFromStorage(ACTIVITIES_KEY, initialActivities);
  const updated = [activity, ...activities];
  saveToStorage(ACTIVITIES_KEY, updated);
};

// ─────────────────────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all notifications for the current user.
 * Future: GET /api/notifications (returns only current user's notifications via JWT)
 */
export const fetchNotifications = async (currentUser) => {
  await simulateNetwork(50);
  const notifs = getFromStorage(NOTIFICATIONS_KEY, initialNotifications);
  if (!currentUser) return [];
  if (currentUser.role === 'Admin') {
    return notifs.filter(n => n.targetRole === 'Admin');
  }
  return notifs.filter(n => 
    n.userId === currentUser.id && 
    (n.type === 'PUBLICATION_REVIEWED' || n.title === 'Publication Reviewed')
  );
};

/**
 * Adds a new notification.
 * Future: POST /api/notifications (server generates notifications on events)
 *
 * @param {object} notification
 */
export const addNotification = async (notification) => {
  await simulateNetwork(50);
  const notifs = getFromStorage(NOTIFICATIONS_KEY, initialNotifications);
  const updated = [notification, ...notifs];
  saveToStorage(NOTIFICATIONS_KEY, updated);
  return notification;
};

/**
 * Updates a notification.
 * Future: PUT /api/notifications/:id
 */
export const updateNotification = async (id, updates) => {
  await simulateNetwork(50);
  const notifs = getFromStorage(NOTIFICATIONS_KEY, initialNotifications);
  const updated = notifs.map(n => n.id === id ? { ...n, ...updates } : n);
  saveToStorage(NOTIFICATIONS_KEY, updated);
  return updated.find(n => n.id === id);
};

/**
 * Marks all notifications as read.
 * Future: PATCH /api/notifications/mark-all-read
 *
 * @returns {object[]} Updated notifications
 */
export const markAllRead = async (currentUser) => {
  await simulateNetwork(50);
  const notifs = getFromStorage(NOTIFICATIONS_KEY, initialNotifications);
  const updated = notifs.map(n => {
    const isTarget = currentUser.role === 'Admin' 
      ? n.targetRole === 'Admin' 
      : (n.userId === currentUser.id && (n.type === 'PUBLICATION_REVIEWED' || n.title === 'Publication Reviewed'));
    return isTarget ? { ...n, read: true } : n;
  });
  saveToStorage(NOTIFICATIONS_KEY, updated);
  return updated.filter(n => currentUser.role === 'Admin' 
    ? n.targetRole === 'Admin' 
    : (n.userId === currentUser.id && (n.type === 'PUBLICATION_REVIEWED' || n.title === 'Publication Reviewed')));
};

export const clearNotifications = async (currentUser) => {
  await simulateNetwork(50);
  const notifs = getFromStorage(NOTIFICATIONS_KEY, initialNotifications);
  const updated = notifs.filter(n => {
    if (currentUser.role === 'Admin') return n.targetRole !== 'Admin';
    return !(n.userId === currentUser.id && (n.type === 'PUBLICATION_REVIEWED' || n.title === 'Publication Reviewed'));
  });
  saveToStorage(NOTIFICATIONS_KEY, updated);
};
