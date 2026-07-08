/**
 * services/facultyService.js
 *
 * Faculty Service.
 * All faculty data operations go through here.
 * No direct data.js imports, no direct localStorage access.
 * All data access is delegated to facultyApi.
 *
 * Current: delegates to facultyApi mock
 * Future:  delegates to facultyApi → REST API → backend
 */

import * as facultyApi from '../api/facultyApi';

export const facultyService = {
  /**
   * Fetches a paginated, searchable list of faculty members.
   *
   * @param {number} page
   * @param {number} limit
   * @param {string} searchQuery
   * @param {string[]} institutionFilters
   * @returns {{ data: object[], total: number, page: number, limit: number, totalPages: number }}
   */
  getFacultyList: async (page = 1, limit = 20, searchQuery = '', institutionFilters = ['All Institutions']) => {
    return await facultyApi.fetchFacultyList(page, limit, searchQuery, institutionFilters);
  },

  /**
   * Fetches a single faculty member by ID.
   *
   * @param {string} id
   * @returns {object|null}
   */
  getFacultyById: async (id) => {
    return await facultyApi.fetchFacultyById(id);
  },

  /**
   * Fetches all global profile fields.
   *
   * @returns {Array<{ id: string, name: string }>}
   */
  getGlobalFields: async () => {
    return await facultyApi.fetchGlobalFields();
  },

  /**
   * Creates a new global profile field.
   *
   * @param {string} name
   * @returns {{ id: string, name: string }}
   */
  addField: async (name) => {
    return await facultyApi.createGlobalField(name);
  },

  /**
   * Deletes a global profile field by ID.
   *
   * @param {string} id
   * @returns {boolean}
   */
  deleteField: async (id) => {
    return await facultyApi.deleteGlobalField(id);
  },

  /**
   * Updates social links for the current user's profile.
   *
   * @param {Array<{ social_media_name: string, social_media_link: string }>} links
   */
  updateSocialLinks: async (links) => {
    return await facultyApi.saveMySocialLinks(links);
  },

  /**
   * Updates social links for any user as an Admin.
   *
   * @param {string} userId 
   * @param {Array<{ social_media_name: string, social_media_link: string }>} links
   */
  updateSocialLinksAsAdmin: async (userId, links) => {
    return await facultyApi.saveUserSocialLinksAsAdmin(userId, links);
  },
};
