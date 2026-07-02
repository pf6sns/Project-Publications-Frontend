/**
 * hooks/usePublications.js
 *
 * Publications Hook.
 * Provides publications state and actions to any page/component.
 * All data goes through publicationService.
 */

import { useState, useEffect, useCallback } from 'react';
import { getPublications } from '../services/publicationService';

/**
 * @returns {{
 *   publications: object[],
 *   loading: boolean,
 *   error: string|null,
 *   refresh: () => Promise<void>,
 * }}
 */
export function usePublications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublications();
      setPublications(data);
    } catch (err) {
      setError(err.message || 'Failed to load publications');
    } finally {
      setLoading(false);
    }
  }, []);

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
