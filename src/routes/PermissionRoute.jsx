/**
 * routes/PermissionRoute.jsx
 *
 * A lightweight route guard that checks whether the current user
 * has temporary admin access to a specific page.
 *
 * Usage:
 *   <PermissionRoute pageId="dashboard">
 *     <AdminDashboardPage />
 *   </PermissionRoute>
 *
 * If the user lacks the permission, they are redirected to their
 * default Faculty page (Upload Manuscript).
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';

export default function PermissionRoute({ pageId, children }) {
  const { hasPageAccess } = usePermissions();

  if (!hasPageAccess(pageId)) {
    return <Navigate to="/faculty/upload" replace />;
  }

  return children;
}
