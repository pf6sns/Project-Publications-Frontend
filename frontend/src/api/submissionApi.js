/**
 * api/submissionApi.js
 *
 * Submission evaluation API layer.
 * Currently delegates to publicationApi for storage.
 *
 * When backend is ready, replace with Axios calls:
 *   import { apiClient } from './apiClient';
 *   return apiClient.get('/submissions', { params: { page, pageSize, search, status } });
 *   return apiClient.post(`/submissions/${id}/evaluate`, { action, feedback });
 */

import { simulateNetwork } from './apiClient';
import { fetchPublications, updatePublication } from './publicationApi';

/**
 * Fetches a paginated, filtered list of submissions (for Admin queue).
 * Future: GET /api/submissions?page=&pageSize=&search=&status=&institution=
 *
 * @param {{ page?: number, pageSize?: number, search?: string, status?: string, institution?: string }} params
 * @returns {{ data: object[], total: number, page: number, totalPages: number }}
 */
export const fetchSubmissions = async ({ page = 1, pageSize = 20, search = '', status = 'All', institution = 'All Institutions' } = {}) => {
  await simulateNetwork(200);

  let all = await fetchPublications();

  // Apply filters (mock — future backend handles this via query params)
  if (search) {
    const q = search.toLowerCase();
    all = all.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.author?.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  }

  if (status && status !== 'All' && status !== 'All statuses') {
    all = all.filter(p => p.status === status);
  }

  if (institution && institution !== 'All Institutions') {
    all = all.filter(p => {
      const pubInstitution = p.institution || (() => {
        const hash = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const institutions = ['SNSCT', 'SNSCE', 'SNSRCAS', 'SNSCAHS'];
        return institutions[hash % institutions.length];
      })();
      return pubInstitution === institution;
    });
  }

  const startIndex = (page - 1) * pageSize;
  const paginated = all.slice(startIndex, startIndex + pageSize);

  return {
    data: paginated,
    total: all.length,
    page,
    pageSize,
    totalPages: Math.ceil(all.length / pageSize),
  };
};

/**
 * Evaluates a submission (approve or reject).
 * Future: POST /api/submissions/:pubId/evaluate
 *
 * @param {string} pubId
 * @param {'approve'|'reject'} action
 * @param {string} feedback
 * @param {object} reviewer
 * @param {string|null} reviewedFileName
 * @returns {object} Updated publication
 */
export const evaluateSubmission = async (pubId, action, feedback, reviewer, reviewedFileName) => {
  await simulateNetwork(300);
  // Delegates to publicationApi for mock storage
  return await updatePublication(pubId, { _evaluate: { action, feedback, reviewer, reviewedFileName } });
};
