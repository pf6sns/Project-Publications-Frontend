/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { simulateNetwork, getFromStorage, saveToStorage } from './apiClient';
import { initialActivities, initialNotifications } from '../data';

const ACTIVITIES_KEY = 'rpms_activities';
const NOTIFICATIONS_KEY = 'rpms_notifications';

export const fetchActivities = async () => {
  await simulateNetwork(50);
  return getFromStorage(ACTIVITIES_KEY, initialActivities);
};

export const logActivity = async (activity) => {
  await simulateNetwork(50);
  const activities = getFromStorage(ACTIVITIES_KEY, initialActivities);
  const updated = [activity, ...activities];
  saveToStorage(ACTIVITIES_KEY, updated);
};

export const fetchNotifications = async () => {
  await simulateNetwork(50);
  return getFromStorage(NOTIFICATIONS_KEY, initialNotifications);
};

export const addNotification = async (notification) => {
  await simulateNetwork(50);
  const notifs = getFromStorage(NOTIFICATIONS_KEY, initialNotifications);
  const updated = [notification, ...notifs];
  saveToStorage(NOTIFICATIONS_KEY, updated);
};

export const markAllRead = async () => {
  await simulateNetwork(50);
  const notifs = getFromStorage(NOTIFICATIONS_KEY, initialNotifications);
  const updated = notifs.map(n => ({ ...n, read: true }));
  saveToStorage(NOTIFICATIONS_KEY, updated);
  return updated;
};
