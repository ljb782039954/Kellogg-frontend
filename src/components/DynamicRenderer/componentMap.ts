// 组件映射表 - 将 BlockType 映射到对应的 React 组件

import { lazy, type ComponentType } from 'react';
import { type BlockType } from '@/types';

interface BlockProps {
  t: (obj: { zh: string; en: string }) => string;
  props: any;
}

// 懒加载所有展示组件
const Carousel = lazy(() => import('@/components/blocks/Carousel'));
const BrandValues = lazy(() => import('@/components/blocks/BrandValues'));
const Statistics = lazy(() => import('@/components/blocks/Statistics'));
const Testimonials = lazy(() => import('@/components/blocks/Testimonials'));

// 新建的区块组件
const Categories = lazy(() => import('@/components/blocks/Categories'));
const NewArrivals = lazy(() => import('@/components/blocks/NewArrivals'));
const FeaturedProducts = lazy(() => import('@/components/blocks/FeaturedProducts'));
const ProductGrid = lazy(() => import('@/components/blocks/ProductGrid'));
const Faq = lazy(() => import('@/components/blocks/Faq'));
const TextSection = lazy(() => import('@/components/blocks/TextSection'));
const ImageBanner = lazy(() => import('@/components/blocks/ImageBanner'));
const ImageFull = lazy(() => import('@/components/blocks/ImageFull'));
const ImageText = lazy(() => import('@/components/blocks/ImageText'));
const Countdown = lazy(() => import('@/components/blocks/Countdown'));
const PartnerLogos = lazy(() => import('@/components/blocks/PartnerLogos'));
const Gallery = lazy(() => import('@/components/blocks/Gallery'));
const FeatureList = lazy(() => import('@/components/blocks/FeatureList'));
const CtaBanner = lazy(() => import('@/components/blocks/CtaBanner'));
const VideoSection = lazy(() => import('@/components/blocks/VideoSection'));



// 组件映射
export const componentMap: Partial<Record<BlockType, ComponentType<BlockProps>>> = {
  carousel: Carousel as ComponentType<BlockProps>,
  categories: Categories as ComponentType<BlockProps>,
  newArrivals: NewArrivals as ComponentType<BlockProps>,
  featuredProducts: FeaturedProducts as ComponentType<BlockProps>,
  productGrid: ProductGrid as ComponentType<BlockProps>,
  brandValues: BrandValues as ComponentType<BlockProps>,
  statistics: Statistics as ComponentType<BlockProps>,
  testimonials: Testimonials as ComponentType<BlockProps>,
  faq: Faq as ComponentType<BlockProps>,
  textSection: TextSection as ComponentType<BlockProps>,
  imageBanner: ImageBanner as ComponentType<BlockProps>,
  imageFull: ImageFull as ComponentType<BlockProps>,
  imageText: ImageText as ComponentType<BlockProps>,
  countdown: Countdown as ComponentType<BlockProps>,
  partnerLogos: PartnerLogos as ComponentType<BlockProps>,
  gallery: Gallery as ComponentType<BlockProps>,
  featureList: FeatureList as ComponentType<BlockProps>,
  ctaBanner: CtaBanner as ComponentType<BlockProps>,
  videoSection: VideoSection as ComponentType<BlockProps>,
};

// 获取组件
export function getBlockComponent(type: BlockType): ComponentType<BlockProps> | null {
  return componentMap[type] || null;
}
