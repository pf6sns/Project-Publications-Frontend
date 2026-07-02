import { useState, useEffect, useCallback } from 'react';
import * as publicationService from '../services/publicationService';

export function usePublicationCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await publicationService.fetchCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = async (categoryData) => {
    try {
      const newCategory = await publicationService.addCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      throw new Error('Failed to create category');
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const updatedCategory = await publicationService.updateCategory(id, categoryData);
      setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
      return updatedCategory;
    } catch (err) {
      throw new Error('Failed to update category');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await publicationService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      throw new Error('Failed to delete category');
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: loadCategories
  };
}
