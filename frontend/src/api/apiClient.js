/**
 * api/apiClient.js
 *
 * Central API client. Currently uses localStorage + simulated network delay
 * to mock backend responses. When the backend is ready:
 *
 *   1. Set VITE_ENABLE_MOCK=false in .env.production
 *   2. Replace simulateNetwork/getFromStorage/saveToStorage with Axios calls below
 *   3. No other file needs to change
 *
 * Future Axios implementation template:
 *
 *   import axios from 'axios';
 *   import config from '../config';
 *
 *   export const apiClient = axios.create({
 *     baseURL: config.apiBaseUrl,
 *     timeout: config.requestTimeoutMs,
 *     headers: { 'Content-Type': 'application/json' },
 *   });
 *
 *   // Request interceptor — attach JWT token
 *   apiClient.interceptors.request.use(config => {
 *     const token = localStorage.getItem('rpms_token');
 *     if (token) config.headers.Authorization = `Bearer ${token}`;
 *     return config;
 *   });
 *
 *   // Response interceptor — handle 401 globally
 *   apiClient.interceptors.response.use(
 *     res => res,
 *     err => {
 *       if (err.response?.status === 401) {
 *         window.location.href = '/login';
 *       }
 *       return Promise.reject(err);
 *     }
 *   );
 */

import config from '../config';

/**
 * Simulates network latency in mock mode.
 * Remove entirely when switching to real API.
 */
export const simulateNetwork = (ms = 300) =>
  config.isMockEnabled
    ? new Promise(resolve => setTimeout(resolve, ms))
    : Promise.resolve();

/**
 * Reads a value from localStorage (mock persistence layer).
 * In production, this is replaced by Axios GET requests.
 */
export const getFromStorage = (key, initialValue) => {
  if (!config.isMockEnabled) {
    throw new Error(`[apiClient] getFromStorage called in non-mock mode for key: ${key}`);
  }
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : initialValue;
};

/**
 * Saves a value to localStorage (mock persistence layer).
 * In production, this is replaced by Axios POST/PUT requests.
 */
export const saveToStorage = (key, value) => {
  if (!config.isMockEnabled) {
    throw new Error(`[apiClient] saveToStorage called in non-mock mode for key: ${key}`);
  }
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Removes a value from localStorage (mock persistence layer).
 */
export const removeFromStorage = (key) => {
  localStorage.removeItem(key);
};
