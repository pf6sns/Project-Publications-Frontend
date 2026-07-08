/**
 * api/profileApi.js
 *
 * Faculty/Admin profile API layer.
 * Fetches profile from real backend endpoints.
 * Note: No PUT /api/faculty/profile exists — only social links are editable.
 */

import { apiClient, unwrap } from './apiClient';
import { mapUser } from '../utils/mapFields';

/**
 * Fetches the current user's profile.
 * GET /api/faculty/profile or /api/admin/profile based on role.
 *
 * @param {string} role - 'Admin' or 'Faculty' (the mapped RPMS role)
 * @returns {object|null}
 */
export const fetchProfile = async (role) => {
  const path = role === 'Admin' ? '/admin/profile' : '/faculty/profile';
  const res = await apiClient.get(path);
  const body = unwrap(res);
  return mapUser(body.data);
};
