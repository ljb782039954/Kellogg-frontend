import React, { useMemo } from 'react';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | null | undefined;
  width?: number;
  height?: number;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  width = 800,
  height,
  priority = false,
  className,
  alt = '',
  sizes: propSizes,
  ...props
}) => {
  const imageUrl = useMemo(() => {
    if (!src) return '';
    return api.getOptimizedImageUrl(src, width);
  }, [src, width]);

  const srcSet = useMemo(() => {
    if (!src) return undefined;

    const defaultWidths = [200, 320, 480, 640, 800, 960, 1080, 1280, 1440, 1600, 1920];
    return defaultWidths
      .map(w => `${api.getOptimizedImageUrl(src, w)} ${w}w`)
      .join(', ');
  }, [src]);

  const sizes = useMemo(() => {
    if (propSizes) return propSizes;
    return '(max-width: 768px) 100vw, 33vw';
  }, [propSizes]);

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
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn("transition-opacity duration-300", className)}
      style={props.style}
      {...props}
    />
  );
};

export default OptimizedImage;
