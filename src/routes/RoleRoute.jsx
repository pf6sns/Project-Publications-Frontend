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

  const role = currentUser.admin === true ? 'Admin' : (currentUser.role || 'Faculty');

  if (!allowedRoles.includes(role) && !allowedRoles.includes(currentUser.role)) {
    // Redirect to base page based on their role (use /faculty/upload for faculty to avoid permission loop)
    return <Navigate to={role === 'Admin' ? '/admin/dashboard' : '/faculty/upload'} replace />;
  }

  return <Outlet />;
}
