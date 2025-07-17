'use client';

import { Suspense, lazy, useEffect, useState } from 'react';

// Lazy load non-critical components
const LazyFeaturedArticlesSection = lazy(() => 
  import('./FeaturedArticlesSection').then(module => ({ default: module.FeaturedArticlesSection }))
);

const LazyServicesSection = lazy(() => 
  import('./ServicesSection').then(module => ({ default: module.ServicesSection }))
);

const LazyAdBannerTop = lazy(() => 
  import('./AdBannerTop').then(module => ({ default: module.default }))
);

// Loading skeleton components
const ArticlesSkeleton = () => (
  <div className="py-16 px-4">
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ServicesSkeleton = () => (
  <div className="py-16 px-4 bg-gray-50">
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-80 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdSkeleton = () => (
  <div className="ad-banner bg-background-secondary border border-light-border rounded-lg">
    <div className="h-20 flex items-center justify-center">
      <div className="text-text-description text-sm">إعلان</div>
    </div>
  </div>
);

// Performance-optimized component wrapper
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}

const LazyComponent = ({ 
  children, 
  fallback, 
  rootMargin = '100px', 
  threshold = 0.1 
}: LazyComponentProps) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    rootMargin,
    threshold,
  });

  return (
    <div ref={ref}>
      {isIntersecting ? children : fallback}
    </div>
  );
};

// Main performance optimizer component
interface PerformanceOptimizerProps {
  latestArticles: any[];
  latestServices: any[];
}

export function PerformanceOptimizer({ latestArticles, latestServices }: PerformanceOptimizerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <>
        <AdSkeleton />
        <ArticlesSkeleton />
        <ServicesSkeleton />
      </>
    );
  }

  return (
    <>
      {/* Lazy load ad banner */}
      <LazyComponent fallback={<AdSkeleton />}>
        <Suspense fallback={<AdSkeleton />}>
          <LazyAdBannerTop />
        </Suspense>
      </LazyComponent>

      {/* Lazy load articles section */}
      <LazyComponent fallback={<ArticlesSkeleton />}>
        <Suspense fallback={<ArticlesSkeleton />}>
          <LazyFeaturedArticlesSection articles={latestArticles} />
        </Suspense>
      </LazyComponent>

      {/* Lazy load services section */}
      <LazyComponent fallback={<ServicesSkeleton />}>
        <Suspense fallback={<ServicesSkeleton />}>
          <LazyServicesSection services={latestServices} />
        </Suspense>
      </LazyComponent>
    </>
  );
}

// Hook for intersection observer
function useIntersectionObserver({
  rootMargin = '0px',
  threshold = 0.1,
}: {
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return [setRef, isIntersecting] as const;
}

export default PerformanceOptimizer;
