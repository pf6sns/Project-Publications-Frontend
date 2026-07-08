/**
 * context/AuthContext.jsx
 *
 * Authentication Context.
 * Manages ONLY React state for the current user session.
 * All data operations delegate to authService.
 *
 * Delegates to authService → authApi → JWT-backed API
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const restoredUser = await authService.restoreSession();
        setCurrentUser(restoredUser);
      } catch (err) {
        console.error('[AuthContext] Failed to restore session:', err);
      } finally {
        setIsInitialized(true);
      }
    };
    init();
  }, []);

  /**
   * Logs in a user via SSO payload.
   *
   * @param {object} ssoPayload - Data to forward to /auth/sso-login
   * @returns {{ success: boolean, user?: object, error?: string }}
   */
  const login = async (ssoPayload) => {
    const result = await authService.login(ssoPayload);
    if (result.success) {
      setCurrentUser(result.user);
    }
    return result;
  };

  /**
   * Logs out the current user.
   */
  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  if (!isInitialized) {
    // Do not render children until session is restored
    return null;
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
