/**
 * services/profileService.js
 *
 * Faculty Profile Service.
 * All profile CRUD operations go through here.
 *
 * Current: delegates to profileApi mock
 * Future:  delegates to profileApi → REST API → backend
 */

import * as profileApi from '../api/profileApi';

/**
 * Fetches a user's profile by ID.
 *
 * @param {string} userId
 * @returns {object|null}
 */
export const getProfile = async (userId) => {
  return await profileApi.fetchProfile(userId);
};

/**
 * Updates a user's profile.
 *
 * @param {string} oldId - Previous ID (may change if employee ID is edited)
 * @param {object} updatedUser - New profile data
 * @returns {object} Updated users map
 */
export const updateProfile = async (oldId, updatedUser) => {
  return await profileApi.updateProfile(oldId, updatedUser);
};
