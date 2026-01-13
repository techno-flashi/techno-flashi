'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CLSOptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  style?: React.CSSProperties;
}

/**
 * CLS-Optimized Image Component
 * Prevents layout shift by enforcing fixed dimensions
 */
export function CLSOptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  style
}: CLSOptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = blurDataURL || `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect width="100%" height="100%" fill="url(#gradient)" opacity="0.3"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`
  ).toString('base64')}`;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width,
        height: height,
        minWidth: width,
        minHeight: height,
        ...style
      }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width: width, height: height }}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm"
          style={{ width: width, height: height }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div>فشل في تحميل الصورة</div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={defaultBlurDataURL}
          sizes={sizes}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: width,
            height: height,
            objectFit: 'cover'
          }}
        />
      )}
    </div>
  );
}

/**
 * Responsive CLS-Optimized Image
 * Maintains aspect ratio while preventing layout shift
 */
export function ResponsiveCLSImage({
  src,
  alt,
  aspectRatio = '16/9',
  maxWidth = '100%',
  className = '',
  priority = false,
  quality = 85
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
  maxWidth?: string | number;
  className?: string;
  priority?: boolean;
  quality?: number;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ 
        aspectRatio: aspectRatio,
        maxWidth: maxWidth
      }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div>فشل في تحميل الصورة</div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={quality}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
            `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#f3f4f6"/>
            </svg>`
          ).toString('base64')}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit: 'cover'
          }}
        />
      )}
    </div>
  );
}

/**
 * Article Featured Image with CLS Prevention
 */
export function ArticleFeaturedImage({
  src,
  alt,
  className = ''
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <ResponsiveCLSImage
      src={src}
      alt={alt}
      aspectRatio="16/9"
      className={`rounded-lg ${className}`}
      priority={true}
      quality={90}
    />
  );
}

/**
 * Card Image with CLS Prevention
 */
export function CardImage({
  src,
  alt,
  width = 300,
  height = 200,
  className = ''
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <CLSOptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg ${className}`}
      quality={85}
    />
  );
}

export default CLSOptimizedImage;
