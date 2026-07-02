/**
 * context/AuthContext.jsx
 *
 * Authentication Context.
 * Manages ONLY React state for the current user session.
 * All data operations delegate to authService — never to data.js or localStorage directly.
 *
 * Current: delegates to authService (mock)
 * Future:  same code, authService delegates to JWT-backed API
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore session on mount (equivalent to GET /auth/me in production)
  useEffect(() => {
    const init = async () => {
      try {
        const [restoredUser, allUsers] = await Promise.all([
          authService.restoreSession(),
          authService.getAllUsers(),
        ]);
        setUsers(allUsers);
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
   * Logs in a user.
   *
   * @param {string} email
   * @param {string} password
   * @returns {{ success: boolean, user?: object, error?: string }}
   */
  const login = async (email, password) => {
    const result = await authService.login(email, password);
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

  /**
   * Updates a user profile record (used by Profile page).
   *
   * @param {string} oldId
   * @param {object} updatedUser
   */
  const updateUser = async (oldId, updatedUser) => {
    const nextUsers = await authService.updateUserRecord(oldId, updatedUser);
    setUsers(nextUsers);
    if (currentUser?.id === oldId || currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  if (!isInitialized) {
    // Do not render children until session is restored
    return null;
  }

  return (
    <AuthContext.Provider value={{ users, setUsers, currentUser, setCurrentUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
