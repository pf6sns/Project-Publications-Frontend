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
 * Returns a single publication detail.
 */
export const getPublicationDetail = (id) => submissionApi.fetchMyPublicationDetail(id);

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
  return { success: true, publication: created };
};

export const deletePublication = async (customPublicationId) => {
  return submissionApi.deleteSubmission(customPublicationId);
};

export const getDrafts = async () => {
  return submissionApi.fetchDrafts();
};

export const markDraftAsSubmitted = async (customPublicationId) => {
  return submissionApi.markSubmitted(customPublicationId);
};

/**
 * Only "approve" exists server-side (upload review → status becomes Completed).
 * There is no reject/rejection-reason endpoint.
 *
 * @param {string} customPublicationId
 * @param {File} reviewFileObject
 */
export const completeReview = async (customPublicationId, reviewFileObject) => {
  return submissionApi.uploadReview(customPublicationId, reviewFileObject);
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
