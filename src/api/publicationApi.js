/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { simulateNetwork, getFromStorage, saveToStorage } from './apiClient';
import { initialPublications } from '../data';

const STORAGE_KEY = 'rpms_pubs';

export const fetchPublications = async () => {
  await simulateNetwork(100);
  return getFromStorage(STORAGE_KEY, initialPublications);
};

export const fetchPublicationById = async (id) => {
  await simulateNetwork(100);
  const pubs = getFromStorage(STORAGE_KEY, initialPublications);
  return pubs.find(p => p.id === id);
};

export const savePublication = async (newPub) => {
  await simulateNetwork(200);
  const pubs = getFromStorage(STORAGE_KEY, initialPublications);
  const newPubs = [newPub, ...pubs];
  saveToStorage(STORAGE_KEY, newPubs);
  return newPub;
};

export const updatePublication = async (id, updates) => {
  await simulateNetwork(200);
  const pubs = getFromStorage(STORAGE_KEY, initialPublications);
  const updated = pubs.map(p => p.id === id ? { ...p, ...updates } : p);
  saveToStorage(STORAGE_KEY, updated);
  return updated.find(p => p.id === id);
};
