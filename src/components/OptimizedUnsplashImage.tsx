'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedUnsplashImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

// Optimize Unsplash URLs for better performance
function optimizeUnsplashUrl(src: string, width: number, height: number, quality: number = 80): string {
  if (!src.includes('unsplash.com')) return src;
  
  // Extract the base URL and photo ID
  const urlParts = src.split('?');
  const baseUrl = urlParts[0];
  
  // Calculate optimal dimensions based on device pixel ratio
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const optimalWidth = Math.ceil(width * Math.min(dpr, 2)); // Cap at 2x for performance
  const optimalHeight = Math.ceil(height * Math.min(dpr, 2));
  
  // Build optimized Unsplash URL with WebP format
  const params = new URLSearchParams({
    w: optimalWidth.toString(),
    h: optimalHeight.toString(),
    fit: 'crop',
    crop: 'center',
    fm: 'webp', // Force WebP format
    q: quality.toString(),
    auto: 'format,compress', // Auto-optimize format and compression
  });
  
  return `${baseUrl}?${params.toString()}`;
}

// Generate multiple source URLs for responsive images
function generateResponsiveSources(src: string, width: number, height: number, quality: number = 80) {
  if (!src.includes('unsplash.com')) return [];
  
  const breakpoints = [
    { size: 640, multiplier: 1 },
    { size: 768, multiplier: 1.2 },
    { size: 1024, multiplier: 1.5 },
    { size: 1280, multiplier: 2 },
  ];
  
  return breakpoints.map(bp => ({
    media: `(max-width: ${bp.size}px)`,
    srcSet: optimizeUnsplashUrl(src, width * bp.multiplier, height * bp.multiplier, quality),
    width: Math.ceil(width * bp.multiplier),
    height: Math.ceil(height * bp.multiplier),
  }));
}

export function OptimizedUnsplashImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 80,
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
  style,
  onLoad,
  onError,
}: OptimizedUnsplashImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate optimized URLs
  const optimizedSrc = optimizeUnsplashUrl(src, width, height, quality);
  const responsiveSources = generateResponsiveSources(src, width, height, quality);

  // Generate blur placeholder
  const blurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect width="100%" height="100%" fill="url(#gradient)"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f9fafb;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`
  ).toString('base64')}`;

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ ...style, aspectRatio: `${width}/${height}` }}
    >
      {/* Loading placeholder with skeleton effect */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>
      )}

      {/* Error placeholder */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">فشل تحميل الصورة</p>
          </div>
        </div>
      )}

      {/* Optimized image with responsive sources */}
      {(isInView || priority) && !hasError && (
        <picture>
          {/* WebP sources for different screen sizes */}
          {responsiveSources.map((source, index) => (
            <source
              key={index}
              media={source.media}
              srcSet={source.srcSet}
              type="image/webp"
            />
          ))}
          
          {/* Fallback image */}
          <Image
            src={optimizedSrc}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            quality={quality}
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes={sizes}
            className={`transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
          />
        </picture>
      )}
    </div>
  );
}

export default OptimizedUnsplashImage;
