/**
 * api/profileApi.js
 *
 * Faculty profile API layer.
 * Currently delegates to localStorage via authApi user store.
 *
 * When backend is ready, replace each function body with Axios calls:
 *   import { apiClient } from './apiClient';
 *   return apiClient.get(`/profiles/${userId}`);
 *   return apiClient.put(`/profiles/${userId}`, data);
 */

import { simulateNetwork } from './apiClient';
import { fetchAllUsers, updateUserRecord } from './authApi';

/**
 * Fetches a single user's profile by ID.
 * Future: GET /api/profiles/:userId
 *
 * @param {string} userId
 * @returns {object|null}
 */
export const fetchProfile = async (userId) => {
  await simulateNetwork(200);
  const users = await fetchAllUsers();
  return users[userId] || null;
};

/**
 * Updates a user's profile.
 * Future: PUT /api/profiles/:userId
 *
 * @param {string} oldId - Previous ID (if ID changes during update)
 * @param {object} updatedUser - New profile data
 * @returns {object} Updated users map
 */
export const updateProfile = async (oldId, updatedUser) => {
  return await updateUserRecord(oldId, updatedUser);
};
