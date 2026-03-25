import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Product } from '../types';

interface UseProductsParams {
  category?: string;
  featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'sales';
  pageSize?: number;
}

export function useProducts(params: UseProductsParams = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.getProducts(params);
        if (isMounted && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [paramsKey]); // 使用字符串化的参数作为依赖

  return { products, loading, error };
}
