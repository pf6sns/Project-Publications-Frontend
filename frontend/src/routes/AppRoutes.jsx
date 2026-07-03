/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import PermissionRoute from './PermissionRoute';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import SignIn from '../pages/Auth/SignIn';
import PageWrapper from '../components/PageWrapper';

// Admin Pages
import AdminDashboardPage from '../pages/Admin/Dashboard';
import { AdminQueuePage } from '../pages/Admin/SubmissionsQueue';
import { AdminEvaluationPage } from '../pages/Admin/EvaluationConsole';
import { AssignAccessPage } from '../pages/Admin/AssignAccess';
import { AdminFacultyProfilesPage } from '../pages/Admin/FacultyProfiles';

// Faculty Pages
import { UploadPage } from '../pages/Faculty/UploadManuscript';
import { PublicationsPage } from '../pages/Faculty/MyPublications';
import { ProfilePage } from '../pages/Shared/Profile';

// Developer Pages
import { AssignRolePage } from '../pages/Developer/AssignRole';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<SignIn />} />
      </Route>

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        
        {/* Admin Routes */}
        <Route element={<RoleRoute allowedRoles={['Admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/queue" element={<PageWrapper Component={AdminQueuePage} />} />
          <Route path="/admin/evaluation" element={<PageWrapper Component={AdminEvaluationPage} />} />
          <Route path="/admin/assign-access" element={<PageWrapper Component={AssignAccessPage} />} />
          <Route path="/admin/upload" element={<PageWrapper Component={UploadPage} />} />
          <Route path="/admin/publications" element={<PageWrapper Component={PublicationsPage} />} />
          <Route path="/admin/profile" element={<PageWrapper Component={ProfilePage} />} />
          <Route path="/admin/faculty" element={<PageWrapper Component={AdminFacultyProfilesPage} />} />
        </Route>

        {/* Faculty Routes */}
        <Route element={<RoleRoute allowedRoles={['Faculty']} />}>
          <Route path="/faculty/upload" element={<PageWrapper Component={UploadPage} />} />
          <Route path="/faculty/publications" element={<PageWrapper Component={PublicationsPage} />} />
          <Route path="/faculty/profile" element={<PageWrapper Component={ProfilePage} />} />

          {/* Temporary Admin Routes — reuses existing Admin page components, guarded by permission */}
          <Route path="/faculty/dashboard" element={<PermissionRoute pageId="dashboard"><AdminDashboardPage /></PermissionRoute>} />
          <Route path="/faculty/queue" element={<PermissionRoute pageId="queue"><PageWrapper Component={AdminQueuePage} /></PermissionRoute>} />
          <Route path="/faculty/evaluation" element={<PermissionRoute pageId="queue"><PageWrapper Component={AdminEvaluationPage} /></PermissionRoute>} />
          <Route path="/faculty/assign-access" element={<PermissionRoute pageId="assign_access"><PageWrapper Component={AssignAccessPage} /></PermissionRoute>} />
          <Route path="/faculty/faculty-profiles" element={<PermissionRoute pageId="faculty_profiles"><PageWrapper Component={AdminFacultyProfilesPage} /></PermissionRoute>} />
        </Route>

        {/* Developer Routes */}
        <Route element={<RoleRoute allowedRoles={['Developer']} />}>
          <Route path="/developer/assign-role" element={<PageWrapper Component={AssignRolePage} />} />
          <Route path="/developer/profile" element={<PageWrapper Component={ProfilePage} />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}
