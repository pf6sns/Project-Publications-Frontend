/**
 * api/authApi.js
 *
 * Authentication API layer.
 * Currently implements mock authentication using localStorage.
 *
 * When backend is ready, replace each function body with:
 *   import { apiClient } from './apiClient';
 *   return apiClient.post('/auth/login', { email, password });
 *   return apiClient.post('/auth/logout');
 *   return apiClient.get('/auth/me');
 */

import { simulateNetwork, getFromStorage, saveToStorage, removeFromStorage } from './apiClient';
import { mockUsers, mockPasswords } from '../mocks/users.mock.js';

const USERS_STORAGE_KEY = 'rpms_users_record';
const SESSION_STORAGE_KEY = 'rpms_user';

/**
 * Returns all users from the mock user store.
 * Future: GET /api/users (admin only)
 */
export const fetchAllUsers = async () => {
  await simulateNetwork(100);
  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  saveToStorage(USERS_STORAGE_KEY, mockUsers);
  return mockUsers;
};

/**
 * Authenticates a user with email + password.
 * Future: POST /api/auth/login → returns { user, accessToken, refreshToken }
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export const login = async (email, password) => {
  await simulateNetwork(300);

  const users = await fetchAllUsers();
  const inputEmail = email.trim().toLowerCase();
  const matched = Object.values(users).find(u => u.email.toLowerCase() === inputEmail);

  if (!matched) {
    return { success: false, error: 'Invalid credentials. Email address not registered.' };
  }

  const expectedPassword = mockPasswords[matched.role];
  if (password !== expectedPassword) {
    return {
      success: false,
      error: `Incorrect password. For ${matched.role}, use: ${expectedPassword}`,
    };
  }

  saveToStorage(SESSION_STORAGE_KEY, matched);
  return { success: true, user: matched };
};

/**
 * Clears the current session.
 * Future: POST /api/auth/logout → invalidates refresh token on server
 */
export const logout = async () => {
  await simulateNetwork(100);
  removeFromStorage(SESSION_STORAGE_KEY);
  return { success: true };
};

/**
 * Restores session from storage (used on page refresh).
 * Future: GET /api/auth/me with Authorization header → validates JWT
 *
 * @returns {object|null} The current user, or null if not authenticated
 */
export const restoreSession = async () => {
  await simulateNetwork(50);
  const saved = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!saved) return null;

  const parsed = JSON.parse(saved);
  const users = await fetchAllUsers();
  // Return the freshest version of the user from the user store
  return users[parsed.id] || parsed;
};

/**
 * Updates a user's profile data in the mock store.
 * Future: PUT /api/users/:id
 *
 * @param {string} oldId - Previous user ID (may change if ID is edited)
 * @param {object} updatedUser - New user data
 */
export const updateUserRecord = async (oldId, updatedUser) => {
  await simulateNetwork(200);
  const users = getFromStorage(USERS_STORAGE_KEY, mockUsers);
  const nextUsers = { ...users };
  if (oldId !== updatedUser.id) {
    delete nextUsers[oldId];
  }
  nextUsers[updatedUser.id] = updatedUser;
  saveToStorage(USERS_STORAGE_KEY, nextUsers);
  return nextUsers;
};
