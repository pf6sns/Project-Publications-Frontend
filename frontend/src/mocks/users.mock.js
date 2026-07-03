/**
 * mocks/users.mock.js
 *
 * Mock user data for development/testing.
 * Used ONLY by the API layer (authApi.js, profileApi.js).
 * Pages, Components, Hooks, and Contexts must NEVER import from this file.
 */

export const mockUsers = {
  FAC001: {
    id: 'FAC001',
    name: 'Dr. A. Kumar',
    email: 'kumar@snsgroups.com',
    role: 'Faculty',
    department: 'Computer Science and Engineering',
    designation: 'Faculty member',
    grantCount: 0,
  },
  FAC002: {
    id: 'FAC002',
    name: 'Prof. M. Priya',
    email: 'priya@snsgroups.com',
    role: 'Faculty',
    department: 'Electronics and Communication Engineering',
    designation: 'Faculty member',
    grantCount: 0,
  },
  ADMIN01: {
    id: 'ADMIN01',
    name: 'Dr. S. Vignesh',
    email: 'vignesh@snsgroups.com',
    role: 'Admin',
    department: 'Office of Dean (Research)',
    designation: 'Dean - Research & Development',
  },
  DEV01: {
    id: 'DEV01',
    name: 'SNS Developer',
    email: 'developer@snsgroups.com',
    role: 'Developer',
    department: 'IT Infrastructure',
    designation: 'Senior Developer',
  }
};

/**
 * Mock password map — used only in authApi mock implementation.
 * In production, authentication is handled entirely by the backend.
 */
export const mockPasswords = {
  Faculty: 'faculty123',
  Admin: 'admin123',
  Developer: 'developer123',
};

/**
 * Default global profile fields shown on faculty profiles.
 * Used only by facultyApi mock implementation.
 */
export const defaultGlobalFields = [
  { id: 'f1', name: 'Google Scholar' },
  { id: 'f2', name: 'ResearchGate' },
];
