import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getNotifications, markNotificationsAsRead, markNotificationAsRead, clearNotifications } from '../services/notificationService';
import { useAuth } from '../hooks/useAuth';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getNotifications(currentUser);
      // Sort newest first
      const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotifications(sorted);
    } catch (err) {
      console.error('[NotificationContext] Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchNotifications();
    
    // Polling every 30 seconds for mock real-time updates (simulating WebSocket)
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = async () => {
    if (!currentUser) return;
    try {
      await markNotificationsAsRead(currentUser);
      await fetchNotifications();
    } catch (err) {
      console.error('[NotificationContext] Failed to mark as read:', err);
    }
  };

  const markAsRead = async (id) => {
    if (!currentUser) return;
    try {
      await markNotificationAsRead(id);
      await fetchNotifications();
    } catch (err) {
      console.error('[NotificationContext] Failed to mark single as read:', err);
    }
  };
  
  const clearAll = async () => {
    if (!currentUser) return;
    try {
      await clearNotifications(currentUser);
      await fetchNotifications();
    } catch (err) {
      console.error('[NotificationContext] Failed to clear notifications:', err);
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    markAsRead,
    clearAll,
    refresh: fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
