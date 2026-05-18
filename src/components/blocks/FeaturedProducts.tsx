import React, { useState, useEffect } from 'react';
import type { Translation, Product, Language } from "../../types";
import { api } from "../../lib/api";
import { createTranslate } from "../../lib/i18n";
import ProductCard from "../product/ProductCard";

interface FeaturedProductsProps {
  title?: Translation;
  subtitle?: Translation;
  maxItems?: number;
  initialProducts?: Product[]; // 可选：SSR 传进来的初始数据（用于首屏展示）
  lang: Language;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  title, 
  subtitle, 
  maxItems, 
  initialProducts = [], 
  lang 
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const t = createTranslate(lang);

  const displayLimit = maxItems || 8;

  useEffect(() => {
    // 在客户端重新抓取最新数据
    const fetchLatest = async () => {
      try {
        const res = await api.getProducts({ featured: true, pageSize: maxItems || 8 });
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, [maxItems]);

  if (loading && products.length === 0) {
    return (
      <section className="py-8 w-full animate-pulse">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            {Array.from({ length: maxItems || 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-8 w-full">
      <div className="container mx-auto px-4">
        {title && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t(title)}</h2>
            {subtitle && <p className="mt-2 text-gray-600">{t(subtitle)}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {products.slice(0, displayLimit).map((product) => (
            <a key={product.id} href={`/product/${product.id}`} className="block group">
              <ProductCard product={product} lang={lang} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
