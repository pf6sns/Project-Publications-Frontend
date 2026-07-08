/**
 * services/profileService.js
 *
 * Faculty Profile Service.
 * Profile read operations go through here.
 *
 * Note: No profile edit endpoint exists on the backend (only social links are editable).
 */

import * as profileApi from '../api/profileApi';

/**
 * Fetches the current user's profile by role.
 *
 * @param {string} role - 'Admin' or 'Faculty'
 * @returns {object|null}
 */
export const getProfile = async (role) => {
  return await profileApi.fetchProfile(role);
};
