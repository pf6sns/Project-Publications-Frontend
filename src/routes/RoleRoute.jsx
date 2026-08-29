/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RoleRoute({ allowedRoles }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const userRole = String(currentUser.role || '').toLowerCase();
  const isAdmin = currentUser.admin === true || userRole === 'admin';
  const isDeveloper = userRole === 'developer';

  const normalizedAllowedRoles = allowedRoles.map(r => String(r).toLowerCase());

  let userHasAccess = false;

  if (normalizedAllowedRoles.includes('developer')) {
    // Developer routes: ONLY developers allowed
    userHasAccess = isDeveloper;
  } else if (normalizedAllowedRoles.includes('admin')) {
    // Admin routes: Admin or Developer allowed
    userHasAccess = isAdmin || isDeveloper;
  } else if (normalizedAllowedRoles.includes('faculty')) {
    // Faculty routes: Faculty users only (non-developer, non-admin)
    userHasAccess = userRole === 'faculty' || (!isDeveloper && !isAdmin);
  } else {
    userHasAccess = normalizedAllowedRoles.includes(userRole);
  }

  if (!userHasAccess) {
    if (isDeveloper) return <Navigate to="/developer/assign-role" replace />;
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/faculty/upload" replace />;
  }

  return <Outlet />;
}
