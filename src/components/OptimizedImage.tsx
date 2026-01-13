'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate blur placeholder for better loading experience
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const defaultBlurDataURL = blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined);

  if (hasError) {
    return (
      <div 
        className={`bg-gray-800 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
        role="img"
        aria-label={alt}
      >
        <div className="text-center text-gray-400 p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">فشل تحميل الصورة</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center z-10"
          aria-hidden="true"
        >
          <div className="text-gray-400">
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}

// مكون مخصص للصور المتجاوبة
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  priority = false,
  quality = 85,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}) {
  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill={true}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

// مكون للصور مع lazy loading محسن
export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  threshold = 0.1
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  threshold?: number;
}) {
  const [isInView, setIsInView] = useState(false);

  // استخدام Intersection Observer للتحميل الذكي
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    });
  };

  return (
    <div 
      ref={(el) => {
        if (el && !isInView) {
          const observer = new IntersectionObserver(handleIntersection, {
            threshold,
            rootMargin: '50px'
          });
          observer.observe(el);
          return () => observer.disconnect();
        }
      }}
      className={className}
      style={{ width, height }}
    >
      {isInView ? (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full"
        />
      ) : (
        <div 
          className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center"
          aria-label={`جاري تحميل: ${alt}`}
        >
          <div className="text-gray-400 text-sm">جاري التحميل...</div>
        </div>
      )}
    </div>
  );
}
