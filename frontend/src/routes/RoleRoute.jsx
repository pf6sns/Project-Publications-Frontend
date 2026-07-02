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

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to default dashboard based on their role
    return <Navigate to={currentUser.role === 'Admin' ? '/admin/dashboard' : '/faculty/dashboard'} replace />;
  }

  return <Outlet />;
}
