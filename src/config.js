/**
 * config.js
 *
 * Central application configuration. All services and API modules
 * must read from this file. No hardcoded URLs or values anywhere else.
 *
 * To swap environments, change the relevant .env.* file.
 * When the backend is ready, set VITE_ENABLE_MOCK=false in .env.production.
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const currentHost = window.location.hostname;
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      if (envUrl.includes('localhost')) {
        return envUrl.replace('localhost', currentHost);
      }
      if (envUrl.includes('127.0.0.1')) {
        return envUrl.replace('127.0.0.1', currentHost);
      }
    }
  }
  return envUrl;
};

const config = {
  apiBaseUrl: getApiBaseUrl(),

  /** Human-readable application name */
  appName: import.meta.env.VITE_APP_NAME || 'SNS RPMS',

  /** Maximum allowed file upload size in megabytes */
  uploadLimitMb: Number(import.meta.env.VITE_UPLOAD_LIMIT_MB) || 10,

  /** Default number of records per page for all paginated tables */
  pageSize: Number(import.meta.env.VITE_PAGE_SIZE) || 20,

  /** Network request timeout in milliseconds */
  requestTimeoutMs: Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS) || 15000,

  /**
   * Feature Flags
   *
   * isMockEnabled: When true, all API layers use localStorage/mock data.
   *                When false, all API layers make real HTTP requests.
   *
   * Switching from mock to real backend only requires:
   *   1. Setting VITE_ENABLE_MOCK=false
   *   2. Implementing real HTTP calls in src/api/*.js
   */
  isMockEnabled: import.meta.env.VITE_ENABLE_MOCK !== 'false',

  /** Support Contact Information */
  supportEmail: 'support@okrion.ai',
  supportPhone: '+91 7200098866',
  supportAddress: 'SNS Institutions, Coimbatore, Tamil Nadu, India',
};

export default config;
