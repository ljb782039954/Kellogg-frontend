import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Product } from '../types';

export function useProductDetail(id: string | number | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prod, relRes] = await Promise.all([
          api.getProduct(Number(id)),
          api.getProducts({ pageSize: 5 }) // Simple recommendation
        ]);
        
        if (isMounted) {
          setProduct(prod);
          setRelatedProducts(relRes.data.filter(p => String(p.id) !== String(id)).slice(0, 4));
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error('Failed to fetch product details'));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [id]);

  return { product, relatedProducts, loading, error };
}
