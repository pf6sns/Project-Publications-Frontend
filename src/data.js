/**
 * data.js — DEPRECATED re-export barrel
 *
 * This file previously contained all mock data inline.
 * All data has been moved to src/mocks/ as part of the
 * Enterprise Architecture refactoring.
 *
 * This file now re-exports from mocks/ for backward compatibility.
 * Do NOT add new data here. Do NOT import this file in new code.
 * All new code must import directly from the relevant API layer.
 *
 * @deprecated — Will be removed once all direct imports are eliminated.
 */

export { mockUsers, defaultGlobalFields } from './mocks/users.mock.js';
export { historicalPublicationsForStats, initialPublications } from './mocks/publications.mock.js';
export { initialActivities, initialNotifications } from './mocks/notifications.mock.js';
export { defaultCategories as DEFAULT_CATEGORIES } from './mocks/categories.mock.js';

// Legacy aliases kept for backward compatibility
export { initialNotifications as initialNotificationsMock } from './mocks/notifications.mock.js';
export { initialActivities as initialActivitiesMock } from './mocks/notifications.mock.js';
