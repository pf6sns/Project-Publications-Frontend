/**
 * mocks/categories.mock.js
 *
 * Default publication categories for development/testing.
 * Used ONLY by the API layer (publicationApi.js).
 * Pages, Components, Hooks, and Contexts must NEVER import from this file.
 */

export const defaultCategories = [
  { id: 'cat_1', name: 'International Journal (Scopus Indexed)', amount: 150 },
  { id: 'cat_2', name: 'National Journal (UGC Care)', amount: 100 },
  { id: 'cat_3', name: 'International Conference', amount: 200 },
  { id: 'cat_4', name: 'Book Chapter', amount: 120 },
];
