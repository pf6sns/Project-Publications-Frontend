/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simulates network latency
export const simulateNetwork = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getFromStorage = (key, initialValue) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : initialValue;
};

export const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
