'use client';

import { useEffect, useState, ReactNode } from 'react';

// مكون Skeleton للتحميل
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave';
}

export function Skeleton({
  className = '',
  width = '100%',
  height = '1rem',
  variant = 'text',
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-700 rounded';
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse' // يمكن تحسينها لاحقاً
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// مكون تحميل البطاقات
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-dark-card rounded-xl p-6 border border-gray-800">
          <Skeleton variant="rectangular" height="12rem" className="mb-4" />
          <Skeleton height="1.5rem" className="mb-2" />
          <Skeleton height="1rem" width="80%" className="mb-2" />
          <Skeleton height="1rem" width="60%" className="mb-4" />
          <div className="flex justify-between items-center">
            <Skeleton height="1rem" width="30%" />
            <Skeleton variant="rectangular" width="5rem" height="2rem" />
          </div>
        </div>
      ))}
    </div>
  );
}

// مكون تحميل المقالات
export function ArticleSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-dark-card rounded-xl overflow-hidden border border-gray-800">
          <Skeleton variant="rectangular" height="12rem" />
          <div className="p-6">
            <Skeleton height="1.5rem" className="mb-3" />
            <Skeleton height="1rem" className="mb-2" />
            <Skeleton height="1rem" width="90%" className="mb-2" />
            <Skeleton height="1rem" width="70%" className="mb-4" />
            <div className="flex justify-between items-center">
              <Skeleton height="0.875rem" width="40%" />
              <Skeleton height="0.875rem" width="25%" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// مكون تحميل الهيدر
export function HeaderSkeleton() {
  return (
    <header className="bg-dark-background/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Skeleton variant="rectangular" width="2.5rem" height="2.5rem" />
            <div>
              <Skeleton height="1.5rem" width="8rem" className="mb-1" />
              <Skeleton height="0.75rem" width="6rem" />
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} height="1rem" width="4rem" />
            ))}
          </div>
          
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Skeleton variant="rectangular" width="6rem" height="2.5rem" />
            <Skeleton variant="rectangular" width="6rem" height="2.5rem" />
          </div>
          
          <Skeleton variant="rectangular" width="2.5rem" height="2.5rem" className="md:hidden" />
        </div>
      </div>
    </header>
  );
}

// مكون Lazy Loading محسن
interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyLoad({
  children,
  fallback = <Skeleton height="10rem" />,
  threshold = 0.1,
  rootMargin = '50px',
  className = ''
}: LazyLoadProps) {
  const [isInView, setIsInView] = useState(false);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, threshold, rootMargin]);

  return (
    <div ref={setElement} className={className}>
      {isInView ? children : fallback}
    </div>
  );
}

// مكون تحسين الصور مع Progressive Loading
interface ProgressiveImageProps {
  src: string;
  alt: string;
  lowQualitySrc?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ProgressiveImage({
  src,
  alt,
  lowQualitySrc,
  className = '',
  width,
  height
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLowQualityLoaded, setIsLowQualityLoaded] = useState(false);

  useEffect(() => {
    // Preload low quality image
    if (lowQualitySrc) {
      const img = new Image();
      img.onload = () => setIsLowQualityLoaded(true);
      img.src = lowQualitySrc;
    }

    // Preload high quality image
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = src;
  }, [src, lowQualitySrc]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Low quality placeholder */}
      {lowQualitySrc && isLowQualityLoaded && !isLoaded && (
        <img
          src={lowQualitySrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300"
        />
      )}
      
      {/* High quality image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !isLowQualityLoaded && (
        <div className="absolute inset-0">
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </div>
      )}
    </div>
  );
}

// Hook لتحسين الأداء
export function usePerformanceOptimization() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);

  useEffect(() => {
    // Check connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                                connection.effectiveType === '2g' ||
                                connection.saveData;
        setIsSlowConnection(isSlowConnection);
      }
    }

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceAnimations(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceAnimations(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    isSlowConnection,
    shouldReduceAnimations,
    shouldOptimizeForPerformance: isSlowConnection || shouldReduceAnimations
  };
}

// مكون تحسين الخطوط
export function FontOptimizer() {
  useEffect(() => {
    // Preload critical fonts
    const fontUrls = [
      'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
    ];

    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      document.head.appendChild(link);
    });
  }, []);

  return null;
}
