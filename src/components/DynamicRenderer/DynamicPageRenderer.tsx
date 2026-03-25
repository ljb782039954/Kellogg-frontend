import React, { Suspense, useMemo } from 'react';
import { type CustomPage, type PageBlock } from '@/types';
import { getBlockComponent } from './componentMap';
import { Skeleton } from '@/components/ui/skeleton';
import type { Language, } from '@/types';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';

interface DynamicPageRendererProps {
  language: Language;
  schema: CustomPage;
  theme?: 'light' | 'dark';
}

export function DynamicPageRenderer({ language, schema }: DynamicPageRendererProps) {
  // 过滤出启用的区块
  const enabledBlocks = schema.blocks.filter(block => block.isVisible);

  if (enabledBlocks.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <p>暂无内容</p>
      </div>
    );
  }

  return (
    <div className="dynamic-page">
      {enabledBlocks.map((block, index) => (
        <Suspense key={block.id} fallback={<BlockSkeleton type={block.type} />}>
          <DynamicBlock language={language} block={block} isFirst={index === 0} />
        </Suspense>
      ))}
    </div>
  );
}

// 单个区块渲染
interface DynamicBlockProps {
  language: Language;
  block: PageBlock;
  isFirst: boolean;
}

function DynamicBlock({ language, block, isFirst }: DynamicBlockProps) {
  // 所有 Hook 必须在任何早期返回之前调用
  const Component = useMemo(() => getBlockComponent(block.type), [block.type]);

  // 使用 useMemo 稳定翻译函数，并增加防错处理以应对空对象
  const t = useMemo(() => (obj: { zh: string; en: string } | undefined | null) => {
    if (!obj) return '';
    return obj[language] || '';
  }, [language]);

  // 合并并稳定区块属性
  const props = useMemo(() => ({
    ...block.content,
    // 第一个区块（通常是轮播图）需要特殊处理
    ...(isFirst && block.type === 'carousel' ? { isFirst: true } : {}),
  }), [block.content, isFirst, block.type]);

  if (!Component) {
    console.warn(`Unknown block type: ${block.type}`);
    return null;
  }

  // 需要进行数据注入的区块类型
  const dataNeedingBlocks = ['categories', 'productGrid', 'featuredProducts', 'newArrivals'];

  if (dataNeedingBlocks.includes(block.type)) {
    return (
      <BlockDataWrapper
        Component={Component as React.ComponentType<any>}
        block={block}
        t={t}
        props={props as Record<string, unknown>}
      />
    );
  }

  // 使用 React.createElement 替代 JSX 标签形式，显式告诉编译器这只是一个已存在的组件引用
  return React.createElement(Component, { t, props });
}

// 数据注入包装组件
interface BlockDataWrapperProps {
  Component: React.ComponentType<any>;
  block: PageBlock;
  t: (obj: { zh: string; en: string } | undefined | null) => string;
  props: Record<string, unknown>;
}

function BlockDataWrapper({ Component, block, t, props }: BlockDataWrapperProps) {
  // 根据区块类型决定请求参数
  const productParams = useMemo(() => {
    // 直接获取所有商品的数据
    const params: Record<string, unknown> = { pageSize: 200 };

    if (block.type === 'featuredProducts') {
      params.featured = true;
    } else if (block.type === 'newArrivals') {
      params.sort = 'newest';
    } else if (block.type === 'productGrid') {
      // 只有当明确指定了特定分类（非空串）时才在后端层过滤
      // 这样可以确保 ProductGrid 能获取到足够数据进行前端筛选
      const categoryId = props.category;
      if (typeof categoryId === 'string' && categoryId.trim() !== '' && categoryId !== 'all') {
        params.category = categoryId;
      }
    }
    return params;
  }, [block.type, props.category]);

  // 调用数据 Hooks
  const { categories, loading: catLoading } = useCategories();
  const { products, loading: prodLoading } = useProducts(productParams);

  // 综合加载状态
  const isLoading = (block.type === 'categories' && catLoading) ||
    (['productGrid', 'featuredProducts', 'newArrivals'].includes(block.type) && (prodLoading || catLoading));

  if (isLoading) {
    return <BlockSkeleton type={block.type} />;
  }

  // 注入数据到 Props
  const injectedProps: Record<string, unknown> = {
    t,
    props,
    categories: categories || [],
    products: products || [],
  };

  // 为 ProductGrid 注入排序选项
  if (block.type === 'productGrid') {
    injectedProps.sortOptions = [
      { id: 'newest', name: { zh: '最新上架', en: 'Newest' } },
      { id: 'price-asc', name: { zh: '价格从低到高', en: 'Price Low-High' } },
      { id: 'price-desc', name: { zh: '价格从高到低', en: 'Price High-Low' } },
      { id: 'sales', name: { zh: '销量优先', en: 'Best Selling' } },
    ];
  }

  return React.createElement(Component, injectedProps);
}

// 区块骨架屏
function BlockSkeleton({ type }: { type: string }) {
  const heightMap: Record<string, string> = {
    carousel: 'h-[500px]',
    categories: 'h-32',
    newArrivals: 'h-96',
    featuredProducts: 'h-96',
    productGrid: 'h-96',
    brandValues: 'h-64',
    statistics: 'h-48',
    testimonials: 'h-80',
    factoryPreview: 'h-64',
    faq: 'h-64',
    textSection: 'h-48',
    imageBanner: 'h-64',
    videoSection: 'h-96',
    imageText: 'h-80',
    countdown: 'h-72',
    partnerLogos: 'h-48',
    gallery: 'h-96',
    featureList: 'h-80',
    ctaBanner: 'h-64',
  };

  return (
    <div className={`w-full ${heightMap[type] || 'h-48'} bg-gray-100 animate-pulse`}>
      <Skeleton className="w-full h-full" />
    </div>
  );
}

export default DynamicPageRenderer;
