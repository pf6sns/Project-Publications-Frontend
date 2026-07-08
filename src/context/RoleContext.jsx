/**
 * context/RoleContext.jsx
 *
 * Manages granular access grants and revocations.
 * Permissions are now server-authoritative — delegates to tempAdminApi.
 */

import React, { createContext, useContext } from 'react';
import * as tempAdminApi from '../api/tempAdminApi';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const grantTemporaryAdmin = async (userId, permissions) => {
    await tempAdminApi.grantAccess(userId, permissions);
  };
  const revokeTemporaryAdmin = async (userId) => {
    await tempAdminApi.revokeAccess(userId);
  };
  return (
    <RoleContext.Provider value={{ grantTemporaryAdmin, revokeTemporaryAdmin }}>
      {children}
    </RoleContext.Provider>
  );
};
export const useRoleContext = () => useContext(RoleContext);
