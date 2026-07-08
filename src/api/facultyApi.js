/**
 * api/facultyApi.js
 *
 * Faculty management API layer.
 * Talks to real backend endpoints for faculty profiles and social-links (global fields).
 */

import { apiClient, unwrap } from './apiClient';
import { mapFacultyListItem, mapUser } from '../utils/mapFields';
import { INSTITUTION_OPTIONS } from '../utils/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Faculty List API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches a paginated, searchable faculty list.
 * GET /api/admin/faculty-profiles?institutionId=
 *
 * Note: Backend does not support server-side search/pagination yet —
 * filtering and pagination are done client-side until the backend adds those params.
 *
 * @param {number} page
 * @param {number} limit
 * @param {string} searchQuery
 * @param {string[]} institutionFilters
 * @returns {{ data: object[], total: number, page: number, limit: number, totalPages: number }}
 */
export const fetchFacultyList = async (page = 1, limit = 20, searchQuery = '', institutionFilters = ['All Institutions']) => {
  const filters = Array.isArray(institutionFilters) ? institutionFilters : [institutionFilters];
  let institutionId = undefined;
  if (!filters.includes('All Institutions') && filters.length > 0) {
    const instIndex = INSTITUTION_OPTIONS.indexOf(filters[0]);
    if (instIndex > 0) institutionId = instIndex.toString();
  }
  const res = await apiClient.get('/admin/faculty-profiles', {
    params: { page, limit, search: searchQuery, institutionId }
  });
  const body = unwrap(res);
  const result = body.data;
  return {
    data: result.faculties.map(mapFacultyListItem),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages
  };
};

/**
 * Fetches a single faculty member by user ID.
 * GET /api/admin/faculty-profile/:userId
 *
 * Uses mapUser() to resolve institution_id → institution name via BRANCH_MAP.
 *
 * @param {string} userId
 * @returns {object|null}
 */
export const fetchFacultyById = async (userId) => {
  const res = await apiClient.get(`/admin/faculty-profile/${userId}`);
  const body = unwrap(res); // { profile, socialLinks, publications }
  const mapped = mapUser(body.data.profile);
  return {
    ...mapped,
    socialLinks: body.data.socialLinks,   // [{ social_media_name, social_media_link }]
    publications: body.data.publications, // [{ custom_publication_id, title, status, submission_date }]
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Global Profile Fields API (repurposed from social-links)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all global profile fields (admin-managed social media platforms).
 * GET /api/admin/social-links
 *
 * @returns {Array<{ id: string, name: string }>}
 */
export const fetchGlobalFields = async () => {
  const res = await apiClient.get('/admin/social-links');
  const body = unwrap(res);
  return body.data.filter(p => p.is_enabled).map(p => ({ id: p.id, name: p.social_media_name }));
};

/**
 * Creates a new global profile field (social media platform).
 * POST /api/admin/social-links
 *
 * @param {string} name
 * @returns {{ id: string, name: string }}
 */
export const createGlobalField = async (name) => {
  const res = await apiClient.post('/admin/social-links', { social_media_name: name });
  const body = unwrap(res);
  return { id: body.data.id, name: body.data.social_media_name };
};

/**
 * Deletes a global profile field by ID.
 * DELETE /api/admin/social-links/:id
 *
 * @param {string} id
 * @returns {boolean}
 */
export const deleteGlobalField = async (id) => {
  await apiClient.delete(`/admin/social-links/${id}`);
  return true;
};

/**
 * Saves the current faculty user's social link values.
 * PUT /api/faculty/social-links/profile/social-links
 *
 * @param {Array<{ social_media_name: string, social_media_link: string }>} links
 */
export const saveMySocialLinks = async (links) => {
  const res = await apiClient.put('/faculty/social-links/profile/social-links', links);
  return unwrap(res);
};

/**
 * Saves a specific faculty member's social links (Admin only).
 * PUT /api/admin/faculty-profile/:userId/social-links
 */
export const saveUserSocialLinksAsAdmin = async (userId, links) => {
  const res = await apiClient.put(`/admin/faculty-profile/${userId}/social-links`, links);
  return unwrap(res);
};
