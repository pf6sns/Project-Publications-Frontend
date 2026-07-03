/**
 * api/facultyApi.js
 *
 * Faculty management API layer.
 * Currently uses mock data generation + localStorage for fields.
 *
 * When backend is ready, replace with Axios calls:
 *   import { apiClient } from './apiClient';
 *   return apiClient.get('/faculty', { params: { page, limit, search } });
 *   return apiClient.get('/faculty/fields');
 *   return apiClient.post('/faculty/fields', { name });
 *   return apiClient.delete(`/faculty/fields/${id}`);
 */

import { simulateNetwork, getFromStorage, saveToStorage } from './apiClient';
import { mockUsers } from '../mocks/users.mock.js';
import { historicalPublicationsForStats } from '../mocks/publications.mock.js';
import { defaultGlobalFields } from '../mocks/users.mock.js';

const FIELDS_STORAGE_KEY = 'rpms_global_fields';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Faculty List Generation
// ─────────────────────────────────────────────────────────────────────────────

let _cachedFacultyList = null;

const generateMockFacultyList = () => {
  const baseFaculty = Object.values(mockUsers).filter(u => u.role === 'Faculty');
  const facultyList = [];
  const insts = ['SNSCT', 'SNSCE', 'SNSRCAS', 'SNSCAHS'];

  for (let i = 1; i <= 50; i++) {
    const base = baseFaculty[i % baseFaculty.length] || baseFaculty[0];
    const pubCount = historicalPublicationsForStats.filter(p => p.authorId === base.id).length;

    facultyList.push({
      ...base,
      id: `FAC${String(i).padStart(3, '0')}`,
      name: `${base.name.split(' ')[0]} ${base.name.split(' ')[1]} ${i}`,
      publications: pubCount + (i % 5),
      originalId: base.id,
      institution: insts[i % 4],
    });
  }
  return facultyList;
};

// ─────────────────────────────────────────────────────────────────────────────
// Faculty List API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches a paginated, searchable faculty list.
 * Future: GET /api/faculty?page=&limit=&search=
 *
 * @param {number} page
 * @param {number} limit
 * @param {string} searchQuery
 * @param {string[]} institutionFilters
 * @returns {{ data: object[], total: number, page: number, limit: number, totalPages: number }}
 */
export const fetchFacultyList = async (page = 1, limit = 20, searchQuery = '', institutionFilters = ['All Institutions']) => {
  await simulateNetwork(600);

  if (!_cachedFacultyList) {
    _cachedFacultyList = generateMockFacultyList();
  }

  let filtered = _cachedFacultyList;

  if (!institutionFilters.includes('All Institutions')) {
    filtered = filtered.filter(f => institutionFilters.includes(f.institution));
  }

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    filtered = filtered.filter(
      f =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.department.toLowerCase().includes(lowerQuery) ||
        f.id.toLowerCase().includes(lowerQuery)
    );
  }

  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    data: paginated,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
};

/**
 * Fetches a single faculty member by ID.
 * Future: GET /api/faculty/:id
 *
 * @param {string} id
 * @returns {object|null}
 */
export const fetchFacultyById = async (id) => {
  await simulateNetwork(300);
  if (!_cachedFacultyList) _cachedFacultyList = generateMockFacultyList();
  return _cachedFacultyList.find(f => f.id === id) || null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Global Profile Fields API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all global profile fields.
 * Future: GET /api/faculty/fields
 *
 * @returns {Array<{ id: string, name: string }>}
 */
export const fetchGlobalFields = async () => {
  await simulateNetwork(400);
  const stored = localStorage.getItem(FIELDS_STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  saveToStorage(FIELDS_STORAGE_KEY, defaultGlobalFields);
  return defaultGlobalFields;
};

/**
 * Creates a new global profile field.
 * Future: POST /api/faculty/fields
 *
 * @param {string} name
 * @returns {{ id: string, name: string }}
 */
export const createGlobalField = async (name) => {
  await simulateNetwork(300);
  const fields = await fetchGlobalFields();
  const newField = { id: `field_${Date.now()}`, name };
  fields.push(newField);
  saveToStorage(FIELDS_STORAGE_KEY, fields);
  return newField;
};

/**
 * Deletes a global profile field by ID.
 * Future: DELETE /api/faculty/fields/:id
 *
 * @param {string} id
 * @returns {boolean}
 */
export const deleteGlobalField = async (id) => {
  await simulateNetwork(300);
  const fields = await fetchGlobalFields();
  const updated = fields.filter(f => f.id !== id);
  saveToStorage(FIELDS_STORAGE_KEY, updated);
  return true;
};
