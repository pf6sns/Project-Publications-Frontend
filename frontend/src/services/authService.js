/**
 * services/authService.js
 *
 * Authentication Service.
 * All authentication logic passes through here.
 * Contexts only manage React state — they call this service for all data operations.
 *
 * Current: delegates to authApi mock
 * Future:  delegates to authApi → JWT → backend
 */

import * as authApi from '../api/authApi';

/**
 * Logs in a user with email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export const login = async (email, password) => {
  return await authApi.login(email, password);
};

/**
 * Logs out the current user.
 *
 * @returns {{ success: boolean }}
 */
export const logout = async () => {
  return await authApi.logout();
};

/**
 * Restores the current session on page refresh.
 *
 * @returns {object|null} Current user or null
 */
export const restoreSession = async () => {
  return await authApi.restoreSession();
};

/**
 * Fetches all users (for Admin pages that list users).
 *
 * @returns {Record<string, object>} Map of userId → user
 */
export const getAllUsers = async () => {
  return await authApi.fetchAllUsers();
};

/**
 * Updates a user profile record.
 *
 * @param {string} oldId
 * @param {object} updatedUser
 * @returns {Record<string, object>} Updated users map
 */
export const updateUserRecord = async (oldId, updatedUser) => {
  return await authApi.updateUserRecord(oldId, updatedUser);
};
