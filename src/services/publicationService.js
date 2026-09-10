/**
 * services/publicationService.js
 *
 * Publication Service.
 * All publication operations go through here.
 * Delegates to submissionApi (submissions) and publicationApi (categories).
 *
 * Note: Version-bump, reject, revision-limit, and notification logic
 * have been removed — the backend does not support these features.
 */

import * as submissionApi from '../api/submissionApi';
import * as pubApi from '../api/publicationApi';

// ─────────────────────────────────────────────────────────────────────────────
// Submissions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the admin submission queue.
 */
export const getSubmissionQueue = (params) => submissionApi.fetchSubmissionQueue(params);

/**
 * Returns the current faculty's publications.
 */
export const getMyPublications = (params) => submissionApi.fetchMyPublications(params);

/**
 * Returns a single publication detail (Faculty view).
 */
export const getPublicationDetail = (id) => submissionApi.fetchMyPublicationDetail(id);

/**
 * Returns a single publication detail (Admin evaluation view).
 */
export const getAdminSubmissionDetail = (id) => submissionApi.fetchSubmissionDetail(id);

const notifyPublicationUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('publication-updated'));
  }
};

/**
 * Submits a new publication.
 *
 * @param {object} data - { title, categoryId, fileObject }
 * @returns {{ success: boolean, publication: object }}
 */
export const submitPublication = async (data) => {
  const created = await submissionApi.createSubmission({
    title: data.title,
    categoryId: data.categoryId,
    file: data.fileObject,
  });
  notifyPublicationUpdated();
  return { success: true, publication: created };
};

export const deletePublication = async (customPublicationId) => {
  const res = await submissionApi.deleteSubmission(customPublicationId);
  notifyPublicationUpdated();
  return res;
};

export const getDrafts = async () => {
  return submissionApi.fetchDrafts();
};

export const markDraftAsSubmitted = async (customPublicationId) => {
  const res = await submissionApi.markSubmitted(customPublicationId);
  notifyPublicationUpdated();
  return res;
};

export const updateDraft = async (customPublicationId, data) => {
  const res = await submissionApi.updateDraft(customPublicationId, {
    title: data.title,
    file: data.fileObject
  });
  notifyPublicationUpdated();
  return res;
};

/**
 * Only "approve" exists server-side (upload review → status becomes Completed).
 * There is no reject/rejection-reason endpoint.
 *
 * @param {string} customPublicationId
 * @param {File} reviewFileObject
 */
export const completeReview = async (customPublicationId, reviewFileObject) => {
  const res = await submissionApi.uploadReview(customPublicationId, reviewFileObject);
  notifyPublicationUpdated();
  return res;
};

export const reattemptSubmission = async (customPublicationId, fileObject) => {
  const res = await submissionApi.reattemptSubmission(customPublicationId, fileObject);
  notifyPublicationUpdated();
  return res;
};

// ─────────────────────────────────────────────────────────────────────────────
// Publication Categories
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all publication categories.
 */
export const fetchCategories = () => pubApi.fetchCategories();

/**
 * Creates a new publication category.
 *
 * @param {{ name: string, amount: number }} categoryData
 */
export const addCategory = (data) => pubApi.createCategory(data);

/**
 * Updates an existing publication category.
 *
 * @param {string} id
 * @param {{ name: string, amount: number }} categoryData
 */
export const updateCategory = (id, data) => pubApi.updateCategoryById(id, data);

/**
 * Deletes a publication category.
 *
 * @param {string} id
 */
export const deleteCategory = (id) => pubApi.deleteCategoryById(id);
