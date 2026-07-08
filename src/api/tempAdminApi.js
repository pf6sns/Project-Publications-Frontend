// src/api/tempAdminApi.js
import { apiClient, unwrap } from './apiClient';

// Frontend page/feature ids → backend boolean columns.
// Backend columns: dashboard, evaluation_console, my_publications, submissions_queue,
// upload_manuscript, assign_access, evaluate_manuscript, export_data,
// delete_manuscript, manage_users
const toBackendPermissions = (pages = [], features = []) => ({
  dashboard: pages.includes('dashboard'),
  submissions_queue: pages.includes('queue'),
  evaluation_console: pages.includes('queue'), // frontend reuses 'queue' guard for evaluation route too
  my_publications: pages.includes('publications'),
  upload_manuscript: pages.includes('upload'),
  assign_access: pages.includes('assign_access'),
  evaluate_manuscript: features.includes('edit') || pages.includes('queue'),
  export_data: features.includes('export_data'),
  delete_manuscript: features.includes('delete'),
  manage_users: pages.includes('assign_access'),
});

import { INSTITUTION_OPTIONS } from '../utils/constants';

export const fetchFacultyForAccess = async (query = {}) => {
  const filters = Array.isArray(query.institution) ? query.institution : [query.institution || 'All Institutions'];
  let branchId = undefined;
  if (!filters.includes('All Institutions') && filters.length > 0) {
    const instIndex = INSTITUTION_OPTIONS.indexOf(filters[0]);
    if (instIndex > 0) branchId = instIndex.toString();
  }
  const params = {
    page: query.page,
    limit: query.limit,
    branchId,
    search: query.search
  };
  const res = await apiClient.get('/admin/tempadmin/faculties', { params });
  return unwrap(res).data;
};

export const fetchPermissions = async (userId) => {
  const res = await apiClient.get(`/admin/tempadmin/permissions/${userId}`);
  return unwrap(res).data;
};

export const grantAccess = async (userId, { pages, features }) => {
  const res = await apiClient.post('/admin/tempadmin/grant-access', {
    user_id: userId,
    ...toBackendPermissions(pages, features),
  });
  return unwrap(res);
};

export const revokeAccess = async (userId) => {
  const res = await apiClient.delete(`/admin/tempadmin/revoke-access/${userId}`);
  return unwrap(res);
};
