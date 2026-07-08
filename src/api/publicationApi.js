/**
 * api/publicationApi.js
 *
 * Publication categories API layer.
 * Talks to real backend category-control endpoints.
 *
 * Note: Publication CRUD has moved to submissionApi.js.
 * This file now only handles category management.
 */

import { apiClient, unwrap } from './apiClient';
import { mapCategory } from '../utils/mapFields';

// ─────────────────────────────────────────────────────────────────────────────
// Publication Categories
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all publication categories.
 * GET /api/admin/category-control/categories
 */
export const fetchCategories = async () => {
  const res = await apiClient.get('/admin/category-control/categories');
  return unwrap(res).data.map(mapCategory);
};

/**
 * Creates a new publication category.
 * POST /api/admin/category-control/category
 */
export const createCategory = async ({ name, amount }) => {
  const res = await apiClient.post('/admin/category-control/category', {
    category_name: name, fees: amount,
  });
  return mapCategory(unwrap(res).data);
};

/**
 * Updates an existing publication category.
 * PUT /api/admin/category-control/category/:id
 */
export const updateCategoryById = async (id, { name, amount, is_disabled }) => {
  const res = await apiClient.put(`/admin/category-control/category/${id}`, {
    category_name: name, fees: amount, is_disabled: is_disabled,
  });
  return mapCategory(unwrap(res).data);
};

/**
 * Deletes a publication category.
 * DELETE /api/admin/category-control/category/:id
 */
export const deleteCategoryById = async (id) => {
  await apiClient.delete(`/admin/category-control/category/${id}`);
  return true;
};
