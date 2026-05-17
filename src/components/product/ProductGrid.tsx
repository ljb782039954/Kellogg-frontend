import React, { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { Product, Category, SortOption, Language } from '../../types';
import ProductCard from './ProductCard';
import Pagination from '../Pagination';
import { t } from '../../utils/common';

export interface ProductGridProps {
  itemsPerPage?: number;
  categories: Category[];
  products: Product[];
  lang: Language;
}

const SORT_OPTIONS: SortOption[] = [
  { id: 'newest', name: { zh: '最新上架', en: 'Newest' } },
  { id: 'price-asc', name: { zh: '价格从低到高', en: 'Price Low-High' } },
  { id: 'price-desc', name: { zh: '价格从高到低', en: 'Price High-Low' } },
  { id: 'sales', name: { zh: '销量优先', en: 'Best Selling' } },
];

export default function ProductGrid({
  itemsPerPage: defaultItemsPerPage = 12,
  categories = [],
  products = [],
  lang,
}: ProductGridProps) {
  const currentItemsPerPage = defaultItemsPerPage;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. 筛选并排序产品
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // 筛选
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 排序
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'sales':
        result.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      default:
        result.sort((a, b) =>
          new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime()
        );
    }
    return result;
  }, [products, selectedCategory, sortBy]);

  // 2. 分页逻辑
  const totalPages = Math.ceil(filteredProducts.length / currentItemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * currentItemsPerPage,
    currentPage * currentItemsPerPage
  );

  return (
    <section className="pt-20 w-full">
      <div className="container mx-auto px-4">
        {/* Filters Bar */}
        <div className="w-full border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang === 'zh' ? '全部' : 'All'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t(cat.name, lang)}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800 border-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {t(opt.name, lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid Display */}
        <div className="py-12">
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">
                {lang === 'zh' ? '暂无商品' : 'No products available'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 md:gap-6">
                {paginatedProducts.map((product, index) => (
                  <a key={product.id} href={`/product/${product.id}`} className="block group h-full">
                    <ProductCard lang={lang} product={product} index={index} />
                  </a>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={filteredProducts.length}
                  lang={lang}
                />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
