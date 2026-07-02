/**
 * services/uploadService.js
 *
 * File Upload Service.
 * Wraps fileStore.js for current mock session-scoped file storage.
 *
 * When backend is ready, replace internals with:
 *   1. POST /api/upload/sign → get AWS S3 signed URL
 *   2. PUT <signedUrl> with file → upload directly to S3
 *   3. POST /api/upload/confirm → confirm upload in database
 *
 * The UI and Hooks must never import from fileStore.js directly.
 * All file operations must go through this service.
 */

import { storeFile, getFileUrl, downloadFile as fileStoreDownload } from '../fileStore';

/**
 * Uploads a file and returns the session-scoped blob URL.
 * Future: Signs URL from backend → uploads to S3 → returns S3 URL
 *
 * @param {File} file - The file object from input[type=file]
 * @param {string} pubId - Publication ID
 * @param {number} version - Version number
 * @returns {string} Blob URL (mock) or S3 URL (production)
 */
export const uploadFile = (file, pubId, version) => {
  return storeFile(pubId, version, file);
};

/**
 * Gets the URL for a previously uploaded file.
 * Future: Returns the S3 signed URL from the backend
 *
 * @param {string} pubId
 * @param {number} version
 * @returns {string|undefined}
 */
export const getUploadedFileUrl = (pubId, version) => {
  return getFileUrl(pubId, version);
};

/**
 * Downloads a file. Uses blob URL if available, falls back to placeholder PDF.
 * Future: Fetches S3 signed download URL from backend
 *
 * @param {string} pubId
 * @param {number} version
 * @param {string} fileName
 */
export const downloadManuscript = (pubId, version, fileName) => {
  fileStoreDownload(pubId, version, fileName);
};
