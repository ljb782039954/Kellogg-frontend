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
        const [prod, relRes, categories] = await Promise.all([
          api.getProduct(Number(id)),
          api.getProducts({ pageSize: 5 }), // Simple recommendation
          api.getCategories()
        ]);
        
        if (isMounted && prod) {
          // 将 category ID 映射为分类名称对象
          const categoryObj = categories.find(c => c.id === prod.category);
          const mappedProduct = {
            ...prod,
            // 如果找到了分类，就把 ID 替换为名称对象，否则保持原样或显示 ID
            category: categoryObj ? categoryObj.name : prod.category
          };

          setProduct(mappedProduct as any);
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
