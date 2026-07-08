/**
 * api/submissionApi.js
 *
 * Submission CRUD API layer.
 * Talks to real backend endpoints for submission creation, queue, review, and my-publications.
 */

import { apiClient, unwrap } from './apiClient';
import { mapSubmission } from '../utils/mapFields';

/** Admin submission queue — GET /api/admin/submissionqueue */
export const fetchSubmissionQueue = async (params = {}) => {
  const queryParams = { ...params };
  if (Array.isArray(queryParams.institution)) {
    queryParams.institution = JSON.stringify(queryParams.institution);
  }
  const res = await apiClient.get('/admin/submissionqueue', { params: queryParams });
  const data = unwrap(res).data;
  return {
    total: data.total,
    page: data.page,
    limit: data.limit,
    publications: data.publications.map(mapSubmission)
  };
};

/** Single submission detail for evaluation — GET /api/admin/submission/view/:id */
export const fetchSubmissionDetail = async (customPublicationId) => {
  const res = await apiClient.get(`/admin/submission/view/${customPublicationId}`);
  return mapSubmission(unwrap(res).data);
};

/** Faculty creates a new submission — POST /api/faculty/submission/create (multipart) */
export const createSubmission = async ({ title, categoryId, file }) => {
  const form = new FormData();
  form.append('title', title);
  form.append('category_id', categoryId);
  form.append('manuscript', file); // field name MUST be "manuscript" (multer .single("manuscript"))
  const res = await apiClient.post('/faculty/submission/create', form);
  return mapSubmission(unwrap(res).data);
};

export const deleteSubmission = async (customPublicationId) => {
  const res = await apiClient.delete(`/faculty/submission/delete/${customPublicationId}`);
  return unwrap(res).data;
};

export const fetchDrafts = async () => {
  const res = await apiClient.get('/faculty/submission/drafts');
  return unwrap(res).data.map(mapSubmission);
};

export const markSubmitted = async (customPublicationId) => {
  const res = await apiClient.patch(`/faculty/submission/submit/${customPublicationId}`);
  return unwrap(res).data;
};

/** Admin uploads a review PDF, marks Completed — PUT .../review (multipart) */
export const uploadReview = async (customPublicationId, reviewFile) => {
  const form = new FormData();
  form.append('reviewPdf', reviewFile); // field name MUST be "reviewPdf"
  const res = await apiClient.put(`/admin/submission/view/${customPublicationId}/review`, form);
  return mapSubmission(unwrap(res).data);
};

/** Faculty's own publications (or all, if Admin — pending JWT fix, see §0.3) */
export const fetchMyPublications = async (params = {}) => {
  const res = await apiClient.get('/my-publications', { params });
  const data = unwrap(res).data;
  return {
    total: data.total,
    page: data.page,
    limit: data.limit,
    publications: data.publications.map(mapSubmission)
  };
};

export const fetchMyPublicationDetail = async (customPublicationId) => {
  const res = await apiClient.get(`/my-publications/${customPublicationId}`);
  return mapSubmission(unwrap(res).data);
};
