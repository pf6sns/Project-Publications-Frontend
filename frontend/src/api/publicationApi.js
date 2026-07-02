/**
 * api/publicationApi.js
 *
 * Publication data API layer.
 * Currently uses localStorage for persistence.
 *
 * When backend is ready, replace each function body with Axios calls:
 *   import { apiClient } from './apiClient';
 *   return apiClient.get('/publications');
 *   return apiClient.post('/publications', newPub);
 *   return apiClient.put(`/publications/${id}`, updates);
 *   return apiClient.delete(`/publications/${id}`);
 *
 * Categories:
 *   return apiClient.get('/publication-categories');
 *   return apiClient.post('/publication-categories', data);
 *   return apiClient.put(`/publication-categories/${id}`, data);
 *   return apiClient.delete(`/publication-categories/${id}`);
 */

import { simulateNetwork, getFromStorage, saveToStorage } from './apiClient';
import { initialPublications } from '../mocks/publications.mock.js';
import { defaultCategories } from '../mocks/categories.mock.js';

const PUBS_STORAGE_KEY = 'rpms_pubs';
const CATEGORIES_STORAGE_KEY = 'rpms_publication_categories';

// ─────────────────────────────────────────────────────────────────────────────
// Publications
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all publications.
 * Future: GET /api/publications
 */
export const fetchPublications = async () => {
  await simulateNetwork(100);
  return getFromStorage(PUBS_STORAGE_KEY, initialPublications);
};

/**
 * Fetches a single publication by ID.
 * Future: GET /api/publications/:id
 */
export const fetchPublicationById = async (id) => {
  await simulateNetwork(100);
  const pubs = getFromStorage(PUBS_STORAGE_KEY, initialPublications);
  return pubs.find(p => p.id === id) || null;
};

/**
 * Saves a new publication.
 * Future: POST /api/publications
 */
export const savePublication = async (newPub) => {
  await simulateNetwork(200);
  const pubs = getFromStorage(PUBS_STORAGE_KEY, initialPublications);
  const newPubs = [newPub, ...pubs];
  saveToStorage(PUBS_STORAGE_KEY, newPubs);
  return newPub;
};

/**
 * Updates an existing publication by ID.
 * Future: PUT /api/publications/:id
 */
export const updatePublication = async (id, updates) => {
  await simulateNetwork(200);
  const pubs = getFromStorage(PUBS_STORAGE_KEY, initialPublications);
  const updated = pubs.map(p => p.id === id ? { ...p, ...updates } : p);
  saveToStorage(PUBS_STORAGE_KEY, updated);
  return updated.find(p => p.id === id);
};

// ─────────────────────────────────────────────────────────────────────────────
// Publication Categories
// ─────────────────────────────────────────────────────────────────────────────

const getStoredCategories = () => {
  const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
  return defaultCategories;
};

/**
 * Fetches all publication categories.
 * Future: GET /api/publication-categories
 */
export const fetchCategories = async () => {
  await simulateNetwork(300);
  return getStoredCategories();
};

/**
 * Creates a new publication category.
 * Future: POST /api/publication-categories
 */
export const createCategory = async (categoryData) => {
  await simulateNetwork(300);
  const categories = getStoredCategories();
  const newCategory = {
    id: `cat_${Date.now()}`,
    name: categoryData.name,
    amount: Number(categoryData.amount),
  };
  categories.push(newCategory);
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  return newCategory;
};

/**
 * Updates an existing publication category.
 * Future: PUT /api/publication-categories/:id
 */
export const updateCategoryById = async (id, categoryData) => {
  await simulateNetwork(300);
  const categories = getStoredCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index] = {
      ...categories[index],
      name: categoryData.name,
      amount: Number(categoryData.amount),
    };
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    return categories[index];
  }
  throw new Error('Category not found');
};

/**
 * Deletes a publication category.
 * Future: DELETE /api/publication-categories/:id
 */
export const deleteCategoryById = async (id) => {
  await simulateNetwork(300);
  let categories = getStoredCategories();
  categories = categories.filter(c => c.id !== id);
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  return true;
};
