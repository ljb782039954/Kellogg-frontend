import type { Translation } from "./common";

// ============================================
// 商品与分类 (D1 关系型数据)
// ============================================

export interface Category {
  id: string;
  name: Translation;
  image?: string;
}

export interface SortOption {
  id: string;
  name: Translation;
}

export interface Product {
  id: number;
  name: Translation;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  rating: number;
  sales: number;
  tag?: Translation;
  category?: string;
  releaseDate?: string;
  description?: Translation;
  isFeatured: boolean;
}

