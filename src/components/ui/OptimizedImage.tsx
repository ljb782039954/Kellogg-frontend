import React from 'react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined;
  /** 期望展示的宽度（像素） */
  width?: number;
  /** 期望展示的高度（像素） */
  height?: number;
  /** 图片质量 (1-100) */
  quality?: number;
  /** 是否优先加载（首屏图片建议设为 true） */
  priority?: boolean;
}

/**
 * 智能优化图片组件
 * 自动根据指定宽度从后端请求缩略图，并支持 Retina 2x 自动切换
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  width,
  height,
  quality = 80,
  priority = false,
  className,
  alt = '',
  ...props
}) => {
  // 如果没有 src，展示一个占位底色
  if (!src) {
    return (
      <div 
        className={cn("bg-gray-100 animate-pulse rounded-lg", className)} 
        style={{ width: width || '100%', height: height || '100%' }} 
      />
    );
  }

  // 1x 图片 URL
  const imageUrl = width 
    ? api.getOptimizedImageUrl(src, width, quality)
    : api.resolveMediaUrl(src);

  // 2x 图片 URL (针对 Retina 屏幕)
  const srcSet = width
    ? `${api.getOptimizedImageUrl(src, width * 2, quality)} 2x`
    : undefined;

  return (
    <img
      src={imageUrl}
      srcSet={srcSet}
      width={width}
      height={height}
      alt={alt}
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
