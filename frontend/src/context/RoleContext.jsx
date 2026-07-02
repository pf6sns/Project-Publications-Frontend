/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { users, setUsers, currentUser, setCurrentUser } = useAuth();

  const grantTemporaryAdmin = (userId, accessType) => {
    const targetUser = users[userId];
    if (!targetUser) return;

    setUsers(prev => {
      const u = prev[userId];
      if (!u) return prev;
      const updatedUser = {
        ...u,
        isTemporaryAdmin: true,
        tempAdminAccessType: accessType,
        isAccessRevoked: false,
        grantCount: (u.grantCount || 0) + 1,
      };
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updatedUser);
      }
      return { ...prev, [userId]: updatedUser };
    });
  };

  const revokeTemporaryAdmin = (userId) => {
    const targetUser = users[userId];
    if (!targetUser) return;

    setUsers(prev => {
      const u = prev[userId];
      if (!u) return prev;
      const updatedUser = {
        ...u,
        isTemporaryAdmin: false,
        tempAdminAccessType: undefined,
        isAccessRevoked: true,
      };
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updatedUser);
      }
      return { ...prev, [userId]: updatedUser };
    });
  };

  return (
    <RoleContext.Provider value={{ grantTemporaryAdmin, revokeTemporaryAdmin }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => useContext(RoleContext);
