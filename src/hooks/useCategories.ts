import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Category } from '../types';

export function useCategories(maxItems?: number) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await api.getCategories();
        if (isMounted) {
          setCategories(maxItems ? data.slice(0, maxItems) : data);
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, [maxItems]);

  return { categories, loading, error };
}
