/**
 * hooks/useNotifications.js
 *
 * Notifications Hook.
 * Provides notifications state and actions to any component.
 * All data goes through notificationService.
 */

import { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationsAsRead } from '../services/notificationService';

/**
 * @returns {{
 *   notifications: object[],
 *   unreadCount: number,
 *   loading: boolean,
 *   markAllRead: () => Promise<void>,
 *   refresh: () => Promise<void>,
 * }}
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('[useNotifications] Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      const updated = await markNotificationsAsRead();
      setNotifications(updated);
    } catch (err) {
      console.error('[useNotifications] Failed to mark as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    refresh: fetchNotifications,
  };
}
