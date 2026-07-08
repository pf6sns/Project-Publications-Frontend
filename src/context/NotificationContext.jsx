import React, { createContext } from 'react';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const value = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    markAsRead: async () => {},
    markAllRead: async () => {},
    clearAll: () => {},
    refresh: async () => {},
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
