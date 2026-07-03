/**
 * services/assignRoleService.js
 *
 * Handles logic for the Developer Portal's role management.
 * In a real application, this would call specific endpoints like POST /api/roles/assign.
 * For now, it proxies through authService to update the mock database.
 */

import { getAllUsers, updateUserRecord } from './authService';

/**
 * Assigns the 'Admin' role to a faculty member.
 * @param {string} userId
 */
export const assignMainAdmin = async (userId) => {
  const users = await getAllUsers();
  const targetUser = users[userId];
  if (!targetUser) throw new Error('User not found');

  const updatedUser = {
    ...targetUser,
    role: 'Admin',
    // We should probably reset temporary admin properties when becoming full admin
    isTemporaryAdmin: false,
    granularPermissions: null,
    isAccessRevoked: false,
  };

  return await updateUserRecord(userId, updatedUser);
};

/**
 * Revokes the 'Admin' role and reverts them to 'Faculty'.
 * @param {string} userId
 */
export const revokeMainAdmin = async (userId) => {
  const users = await getAllUsers();
  const targetUser = users[userId];
  if (!targetUser) throw new Error('User not found');

  const updatedUser = {
    ...targetUser,
    role: 'Faculty',
    // Clear any previous granular permissions since they might have expired or shouldn't persist
    isTemporaryAdmin: false,
    granularPermissions: null,
    isAccessRevoked: false,
  };

  return await updateUserRecord(userId, updatedUser);
};
