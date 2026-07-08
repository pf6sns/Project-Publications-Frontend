/**
 * services/assignRoleService.js
 *
 * Handles logic for the Developer Portal's role management.
 * Backend does not expose role-assignment endpoints yet.
 * These functions are stubs that will error until the backend adds
 * POST /api/admin/assign-role and POST /api/admin/revoke-role.
 */

import { apiClient, unwrap } from '../api/apiClient';

/**
 * Assigns the 'Admin' role to a faculty member.
 * @param {string} userId
 */
export const assignMainAdmin = async (userId) => {
  const res = await apiClient.put(`/developer/role/${userId}`, { role: 'admin' });
  return unwrap(res).data;
};

/**
 * Revokes the 'Admin' role and reverts them to 'Faculty'.
 * @param {string} userId
 */
export const revokeMainAdmin = async (userId) => {
  const res = await apiClient.put(`/developer/role/${userId}`, { role: 'faculty' });
  return unwrap(res).data;
};
