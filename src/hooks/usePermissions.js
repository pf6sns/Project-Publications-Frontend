/**
 * hooks/usePermissions.js
 *
 * Centralized permission-checking hook.
 * Provides helpers to determine page access, feature access,
 * and granted admin pages for the current user.
 *
 * - Admin users → full access to all pages and features.
 * - Faculty with permissions (temp_admin) → granted subset via backend boolean columns.
 * - Regular Faculty → no admin access.
 */

import { useAuth } from './useAuth';

/**
 * Page ID → label mapping, kept in sync with AssignAccessModal PAGES.
 */
const PAGE_LABELS = {
  dashboard: 'Dashboard',
  queue: 'Submissions Queue',
  upload: 'Upload Manuscript',
  publications: 'My Publications',
  assign_access: 'Assign Access',
  faculty_profiles: 'Faculty Profiles',
};

/**
 * Maps frontend page IDs to backend boolean column names.
 */
const PAGE_TO_COLUMN = {
  dashboard: 'dashboard',
  queue: 'submissions_queue',
  upload: 'upload_manuscript',
  publications: 'my_publications',
  assign_access: 'assign_access',
  faculty_profiles: 'manage_users',
};

/**
 * Maps frontend feature IDs to backend boolean column names.
 */
const FEATURE_TO_COLUMN = {
  export_data: 'export_data',
  delete: 'delete_manuscript',
  edit: 'evaluate_manuscript',
};

export function usePermissions() {
  const { currentUser } = useAuth();

  const isAdmin = currentUser?.role === 'Admin';
  const isTemporaryAdmin = !!currentUser?.permissions;

  /**
   * Checks if the current user has access to a given admin page.
   * @param {string} pageId — e.g. 'dashboard', 'queue', 'evaluation'
   * @returns {boolean}
   */
  const hasPageAccess = (pageId) => {
    if (isAdmin) return true;
    if (!isTemporaryAdmin) return false;
    return !!currentUser.permissions[PAGE_TO_COLUMN[pageId]];
  };

  /**
   * Checks if the current user has access to a specific feature.
   * @param {string} featureId — e.g. 'evaluate_manuscript', 'export_data'
   * @returns {boolean}
   */
  const hasFeatureAccess = (featureId) => {
    if (isAdmin) return true;
    if (!isTemporaryAdmin) return false;
    return !!currentUser.permissions[FEATURE_TO_COLUMN[featureId]];
  };

  /**
   * Returns the list of admin page IDs the current user has been granted.
   * Empty array for regular Faculty, all pages for Admin.
   * @returns {string[]}
   */
  const getGrantedAdminPages = () => {
    if (isAdmin) return Object.keys(PAGE_LABELS);
    if (!isTemporaryAdmin) return [];
    return Object.entries(PAGE_TO_COLUMN)
      .filter(([, col]) => !!currentUser.permissions[col])
      .map(([pageId]) => pageId);
  };

  return {
    isAdmin,
    isTemporaryAdmin,
    hasPageAccess,
    hasFeatureAccess,
    getGrantedAdminPages,
    PAGE_LABELS,
  };
}
