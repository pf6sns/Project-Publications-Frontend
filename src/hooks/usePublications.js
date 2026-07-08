/**
 * hooks/usePublications.js
 *
 * Publications Hook.
 * Provides publications state and actions to any page/component.
 * All data goes through publicationService.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import * as publicationService from '../services/publicationService';

/**
 * @returns {{
 *   publications: object[],
 *   loading: boolean,
 *   error: string|null,
 *   refresh: () => Promise<void>,
 * }}
 */
export function usePublications() {
  const { currentUser } = useAuth();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdminLike = currentUser?.role === 'Admin' || currentUser?.tempAdmin;

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = isAdminLike
        ? await publicationService.getSubmissionQueue()
        : await publicationService.getMyPublications();
      setPublications(data);
    } catch (err) {
      setError(err.message || 'Failed to load publications');
    } finally {
      setLoading(false);
    }
  }, [isAdminLike]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  return {
    publications,
    loading,
    error,
    refresh: fetchPublications,
  };
}
