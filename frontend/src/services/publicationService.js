/**
 * services/publicationService.js
 *
 * Publication Service.
 * All publication operations go through here.
 * No direct data.js imports, no direct localStorage access.
 * All data access is delegated to publicationApi.
 *
 * Current: delegates to publicationApi mock
 * Future:  delegates to publicationApi → REST API → backend
 */

import * as pubApi from '../api/publicationApi';
import { logSystemEvent } from './notificationService';

// ─────────────────────────────────────────────────────────────────────────────
// Publications
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all publications.
 */
export const getPublications = async () => {
  return await pubApi.fetchPublications();
};

/**
 * Submits a new publication or re-uploads a new version if title matches.
 *
 * @param {object} data - Publication form data
 * @param {object} currentUser - Authenticated user
 * @returns {{ success: boolean, isUpdate: boolean, publication: object }}
 */
export const submitPublication = async (data, currentUser) => {
  const dateStr = new Date().toISOString();
  const pubs = await getPublications();

  const existingPub = pubs.find(
    p => p.title.trim().toLowerCase() === data.title.trim().toLowerCase()
  );

  if (existingPub) {
    const nextVer = existingPub.currentVersion + 1;
    const newVersionObj = {
      version: nextVer,
      fileName: data.fileName,
      fileSize: data.fileSize,
      uploadDate: dateStr,
      reviewDate: null,
      status: 'Pending',
      feedback: null,
      rejectionReason: null,
    };

    const updated = await pubApi.updatePublication(existingPub.id, {
      status: 'Pending',
      currentVersion: nextVer,
      lastUpdated: dateStr,
      versions: [...existingPub.versions, newVersionObj],
      paymentStatus: 'Paid',
      paymentDetails: {
        transactionId: data.transactionId,
        amount: data.amount || 150,
        date: dateStr,
      },
    });

    logSystemEvent(
      currentUser.id, currentUser.name, 'Faculty',
      existingPub.id, existingPub.title,
      'Manuscript Reuploaded',
      `Reuploaded a new version (V${nextVer}) via upload form.`,
      `Your publication "${existingPub.title}" has been updated to V${nextVer}.`,
      'info'
    );
    return { success: true, isUpdate: true, publication: updated };
  }

  const newPubId = 'PUB-2026-' + String(pubs.length + 1).padStart(3, '0');
  const newPublication = {
    id: newPubId,
    title: data.title,
    author: currentUser.name,
    authorId: currentUser.id,
    department: data.department,
    category: data.category,
    abstract: data.abstract,
    status: 'Pending',
    currentVersion: 1,
    submissionDate: dateStr,
    lastUpdated: dateStr,
    paymentStatus: 'Paid',
    paymentDetails: {
      transactionId: data.transactionId,
      amount: data.amount || 150,
      date: dateStr,
    },
    citations: 0,
    versions: [{
      version: 1,
      fileName: data.fileName,
      fileSize: data.fileSize,
      uploadDate: dateStr,
      reviewDate: null,
      status: 'Pending',
      feedback: null,
      rejectionReason: null,
    }],
  };

  const saved = await pubApi.savePublication(newPublication);
  logSystemEvent(
    currentUser.id, currentUser.name, 'Faculty',
    newPubId, data.title,
    'Publication Submitted',
    'Submitted Version 1',
    'Submitted successfully.',
    'info'
  );
  return { success: true, isUpdate: false, publication: saved };
};

/**
 * Evaluates a publication (approve or reject).
 *
 * @param {string} pubId
 * @param {'approve'|'reject'} action
 * @param {string} feedback
 * @param {object} reviewer
 * @param {string|null} reviewedFileName
 * @returns {object|null} Updated publication
 */
export const evaluatePublication = async (pubId, action, feedback, reviewer, reviewedFileName) => {
  const pub = await pubApi.fetchPublicationById(pubId);
  if (!pub) return null;

  const dateStr = new Date().toISOString();
  const isAtMaxLimit = pub.currentVersion >= 3;
  const nextStatus =
    action === 'approve'
      ? 'Approved'
      : isAtMaxLimit
      ? 'Closed – Maximum Revision Limit Reached'
      : 'Rejected';

  const updatedVersions = pub.versions.map((v, i) => {
    if (i === pub.versions.length - 1) {
      return {
        ...v,
        status: nextStatus,
        reviewDate: dateStr,
        feedback,
        rejectionReason: action === 'reject' ? feedback : null,
        reviewedFileName: reviewedFileName || null,
      };
    }
    return v;
  });

  const updated = await pubApi.updatePublication(pubId, {
    status: nextStatus,
    lastUpdated: dateStr,
    versions: updatedVersions,
    assignedReviewerId: pub.assignedReviewerId || reviewer.id,
  });

  logSystemEvent(
    reviewer.id, reviewer.name, reviewer.role,
    pubId, pub.title,
    `publication ${action}d.`,
    `Evaluated with status ${nextStatus}`,
    `Your publication has been ${nextStatus}.`,
    action === 'approve' ? 'success' : 'error'
  );

  return updated;
};

// ─────────────────────────────────────────────────────────────────────────────
// Publication Categories
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all publication categories.
 */
export const fetchCategories = async () => {
  return await pubApi.fetchCategories();
};

/**
 * Creates a new publication category.
 *
 * @param {{ name: string, amount: number }} categoryData
 */
export const addCategory = async (categoryData) => {
  return await pubApi.createCategory(categoryData);
};

/**
 * Updates an existing publication category.
 *
 * @param {string} id
 * @param {{ name: string, amount: number }} categoryData
 */
export const updateCategory = async (id, categoryData) => {
  return await pubApi.updateCategoryById(id, categoryData);
};

/**
 * Deletes a publication category.
 *
 * @param {string} id
 */
export const deleteCategory = async (id) => {
  return await pubApi.deleteCategoryById(id);
};
