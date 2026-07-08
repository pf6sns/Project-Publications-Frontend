/**
 * services/authService.js
 *
 * Authentication Service.
 * All authentication logic passes through here.
 * Contexts only manage React state — they call this service for all data operations.
 *
 * Delegates to authApi → JWT → backend
 */

import * as authApi from '../api/authApi';

/**
 * Logs in a user via SSO.
 *
 * @param {object} ssoPayload - Payload to forward to /auth/sso-login
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export const login = async (ssoPayload) => {
  return await authApi.login(ssoPayload);
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
