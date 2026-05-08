import React, { useMemo } from 'react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined;
  /** 默认展示的宽度（像素），对应 src 属性 */
  width?: number;
  /** 期望展示的高度（像素） */
  height?: number;
  /** 图片质量 (1-100)，现在由 Worker 自动根据宽度控制 */
  quality?: number;
  /** 是否优先加载（首屏图片建议设为 true） */
  priority?: boolean;
  /** 
   * 响应式宽度配置 
   * 如果传了，会根据传的宽度生成 srcset
   * 如果没传，会生成一套默认的 (320, 480, 768, 1200, 1600)
   */
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

/**
 * 智能优化图片组件
 * 自动集成 Cloudflare Image Resizing 功能，支持响应式加载和 WebP 自动转换
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  width = 768, // 默认请求 768 宽
  height,
  // quality = 80,
  priority = false,
  responsive,
  className,
  alt = '',
  sizes: propSizes,
  ...props
}) => {
  // 1. 计算主 src
  const imageUrl = useMemo(() => {
    if (!src) return '';
    return api.getOptimizedImageUrl(src, width);
  }, [src, width]);

  // 2. 计算 srcSet (核心：实现按需加载)
  const srcSet = useMemo(() => {
    if (!src) return undefined;

    // 如果指定了响应式宽度
    if (responsive) {
      const widths = [
        responsive.sm, 
        responsive.md, 
        responsive.lg, 
        responsive.xl
      ].filter((w): w is number => !!w);

      if (widths.length > 0) {
        return widths
          .sort((a, b) => a - b)
          .map(w => `${api.getOptimizedImageUrl(src, w)} ${w}w`)
          .join(', ');
      }
    }

    // 默认生成一套标准的 srcset 覆盖绝大多数场景
    const defaultWidths = [320, 480, 768, 1024, 1200, 1600];
    return defaultWidths
      .map(w => `${api.getOptimizedImageUrl(src, w)} ${w}w`)
      .join(', ');
  }, [src, responsive]);

  // 3. 计算 sizes 属性 (告知浏览器如何根据屏幕宽度选择图片)
  const sizes = useMemo(() => {
    if (propSizes) return propSizes;
    if (!responsive) return '(max-width: 768px) 100vw, 1200px';

    const parts = [];
    if (responsive.xl) parts.push(`(min-width: 1280px) ${responsive.xl}px`);
    if (responsive.lg) parts.push(`(min-width: 1024px) ${responsive.lg}px`);
    if (responsive.md) parts.push(`(min-width: 768px) ${responsive.md}px`);
    if (responsive.sm) parts.push(`(min-width: 640px) ${responsive.sm}px`);
    
    parts.push(`${width}px`);
    return parts.join(', ');
  }, [responsive, width, propSizes]);

  // 如果没有 src，展示一个占位底色
  if (!src) {
    return (
      <div 
        className={cn("bg-gray-100 animate-pulse rounded-lg", className)} 
        style={{ width: width || '100%', height: height || '100%' }} 
      />
    );
  }

  return (
    <img
      src={imageUrl}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt+'-image'}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn("transition-opacity duration-300", className)}
      onLoad={(e) => {
        (e.currentTarget as HTMLImageElement).style.opacity = '1';
      }}
      style={{ opacity: 0, ...props.style }} // 初始透明，加载后渐显
      {...props}
    />
  );
};

export default OptimizedImage;
