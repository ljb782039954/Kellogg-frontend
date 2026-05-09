/**
 * API 客户端（webApp）
 * 封装所有与 worker-api 的请求通信
 * 注意已经注释了非GET请求，因为webApp不需要修改数据
 */

import type {
  Product,
  Category,
  CustomPage
  // ProductInput,
  // CategoryInput,
} from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL_LOCAL || '').replace(/\/$/, '');
const ENABLE_CACHE = import.meta.env.VITE_ENABLE_API_CACHE === 'true';
const CACHE_DURATION = 15 * 60 * 1000; // 15 mins

// 内存缓存存储
const apiCache = new Map<string, { data: unknown; timestamp: number }>();

// API 错误类型
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// 通用请求函数
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const method = (options.method || 'GET').toUpperCase();
  const isCacheable = ENABLE_CACHE && method === 'GET';

  if (import.meta.env.DEV) {
    console.log(`缓存是否开启: ${ENABLE_CACHE}`);
  }

  // 1. 检查缓存
  if (isCacheable) {
    const cached = apiCache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`[API Cache] Hit: ${path}`);
      return cached.data as T;
    }
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(
      errorData.error || errorData.message || 'Request failed',
      response.status,
      errorData
    );
  }

  // 处理空响应
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  const result = JSON.parse(text);

  // 2. 写入缓存
  if (isCacheable) {
    apiCache.set(url, { data: result, timestamp: Date.now() });
  }

  return result;
}

// 分页响应类型
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 商品列表查询参数
interface ProductsQuery {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'sales';
  search?: string;
}

// API 接口
export const api = {
  // ============================================
  // 商品 (保持为核心实体)
  // ============================================
  getProducts: (params?: ProductsQuery) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.set(key, String(value));
        }
      });
    }
    const queryStr = query.toString();
    return request<PaginatedResponse<Product>>(
      `/api/products${queryStr ? `?${queryStr}` : ''}`
    );
  },

  getProduct: (id: number) => request<Product>(`/api/products/${id}`),

  // createProduct: (data: ProductInput) =>
  //   request<Product>('/api/products', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   }),

  // updateProduct: (id: number, data: Partial<ProductInput>) =>
  //   request<Product>(`/api/products/${id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(data),
  //   }),

  // deleteProduct: (id: number) =>
  //   request<{ success: boolean }>(`/api/products/${id}`, {
  //     method: 'DELETE',
  //   }),

  // ============================================
  // 分类 (保持为核心实体)
  // ============================================
  getCategories: () => request<Category[]>('/api/categories'),

  // createCategory: (data: CategoryInput) =>
  //   request<Category>('/api/categories', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   }),

  // updateCategory: (id: string, data: Partial<CategoryInput>) =>
  //   request<Category>(`/api/categories/${id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(data),
  //   }),

  // deleteCategory: (id: string) =>
  //   request<{ success: boolean }>(`/api/categories/${id}`, {
  //     method: 'DELETE',
  //   }),

  // ============================================
  // 通用配置 KV 系统 (积木与页面全靠它通信)
  // ============================================
  getConfig: <T = unknown>(key: string) =>
    request<T>(`/api/config/${key}`).catch((err) => {
      // 如果配置不存在，返回 null
      if (err.status === 404) {
        return null;
      }
      throw err;
    }),

  getPageById: (id: string) => request<CustomPage>(`/api/config/pages/${id}`),

  // setConfig: <T = unknown>(key: string, value: T) =>
  //   request<{ success: boolean }>('/api/config', {
  //     method: 'POST',
  //     body: JSON.stringify({ key, value }),
  //   }),

  // ============================================
  // 图片与静态资源上传
  // ============================================
  uploadImage: async (file: File): Promise<{ url: string; key: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      // Authorization handled by interceptor if needed
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new ApiError(error.error || 'Upload failed', response.status);
    }

    return response.json();
  },

  deleteImage: (key: string) =>
    request<{ success: boolean }>(`/api/upload?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    }),

  /**
   * 解析媒体 URL (统一指向 R2 资源域名)
   */
  resolveMediaUrl: (url: string | null | undefined): string => {
    if (!url) return '/placeholder.jpg';
    if (url.startsWith('http')) return url;
    
    const assetsBase = import.meta.env.VITE_API_ASSETS || 'https://assets.kelloggfashion.com';
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    
    return `${assetsBase}/${cleanPath}`;
  },

  /**
   * 获取优化后的图片 URL (利用 Cloudflare 官方 Transformations)
   */
  getOptimizedImageUrl: (url: string | null | undefined, width: number): string => {
    if (!url) return '/placeholder.jpg';
    
    // 如果是外部 URL，不走优化逻辑
    if (url.startsWith('http') && !url.includes('kelloggfashion.com')) {
      return url;
    }

    // 处理本地开发环境
    if (import.meta.env.VITE_IS_LOCAL_DEV === "true") {
      return api.resolveMediaUrl(url);
    }

    // 1. 去掉 URL 中的查询参数
    const cleanUrl = url.split('?')[0];
    
    // 2. 提取路径部分
    let path = cleanUrl;
    if (cleanUrl.startsWith('http')) {
      try {
        path = new URL(cleanUrl).pathname;
      } catch (e) {}
    }

    // 3. 提取文件名并去除 uploads/ 前缀
    const filename = path
      .replace(/^\//, '')
      .replace(/^uploads\//, '');

    if (!filename) return api.resolveMediaUrl(url);

    // 4. 核心逻辑：直接使用资源域名下的 /cdn-cgi/image 接口
    // 这样不经过 Worker，速度最快，且避开了 .workers.dev 域名的限制
    const assetsBase = import.meta.env.VITE_API_ASSETS || 'https://assets.kelloggfashion.com';
    const quality = width <= 768 ? 75 : 85;

    return `${assetsBase}/cdn-cgi/image/width=${width},quality=${quality},format=auto/uploads/${filename}`;
  },

  submitInquiry: (data: any) => request('/api/inquiries/submit', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
};

export default api;
