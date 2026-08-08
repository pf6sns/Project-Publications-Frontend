/**
 * api/developerApi.js
 *
 * Developer portal API layer.
 * Uses the purpose-built GET /api/developer endpoint (server-side paginated)
 * instead of borrowing the Admin faculty-profiles endpoint.
 */

import { apiClient, unwrap } from './apiClient';
import { mapSubmission } from '../utils/mapFields';

/**
 * Fetches paginated faculty list for the Developer role-assignment screen.
 * GET /api/developer?page=&limit=&branchId=&department=
 *
 * @param {number} page
 * @param {number} limit
 * @param {string|null} branchId
 * @param {string|null} department
 * @returns {{ page: number, limit: number, total: number, faculties: object[] }}
 */
export const fetchDeveloperFacultyList = async (page = 1, limit = 20, branchId, department, search) => {
  const res = await apiClient.get('/developer', { params: { page, limit, branchId, department, search } });
  return unwrap(res).data;
};

export const createDeveloperFacultySubmission = async ({
  facultyUserId,
  title,
  categoryId,
  uploadDate,
  file
}) => {
  const form = new FormData();
  form.append('faculty_user_id', facultyUserId);
  form.append('title', title);
  form.append('category_id', categoryId);
  form.append('upload_date', uploadDate);
  form.append('manuscript', file);

  const res = await apiClient.post('/developer/submission/create', form);
  return mapSubmission(unwrap(res).data);
};

export const deleteDeveloperPublication = async (publicationId) => {
  const res = await apiClient.delete(`/developer/submission/${encodeURIComponent(publicationId)}`);
  return unwrap(res).data;
};
