// Performance optimization utilities

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading utility for components
export function createLazyComponent<T = any>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFunc);
  
  return function LazyWrapper(props: T) {
    return (
      <React.Suspense fallback={fallback ? React.createElement(fallback) : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  };
}

// Image preloader for critical images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Preload multiple images
export async function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

// Resource hints for performance
export function addResourceHint(
  href: string,
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch',
  as?: string,
  crossorigin?: boolean
) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  
  if (as) link.setAttribute('as', as);
  if (crossorigin) link.setAttribute('crossorigin', '');
  
  document.head.appendChild(link);
}

// Optimize bundle loading
export function preloadRoute(route: string) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }
}

// Core Web Vitals measurement
export interface WebVitals {
  name: string;
  value: number;
  id: string;
  delta: number;
}

export function reportWebVitals(metric: WebVitals) {
  // Send to analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`${metric.name}: ${metric.value}`);
  }
}

// Intersection Observer utility for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  startTiming(label: string): void {
    this.metrics.set(`${label}_start`, performance.now());
  }
  
  endTiming(label: string): number {
    const startTime = this.metrics.get(`${label}_start`);
    if (startTime === undefined) {
      console.warn(`No start time found for ${label}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.metrics.set(label, duration);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${label}: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
  
  getMetric(label: string): number | undefined {
    return this.metrics.get(label);
  }
  
  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

// Memory usage monitoring
export function getMemoryUsage(): MemoryInfo | null {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    return (performance as any).memory;
  }
  return null;
}

// Network information
export function getNetworkInfo(): any {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    return (navigator as any).connection;
  }
  return null;
}

// Device capabilities detection
export function getDeviceCapabilities() {
  if (typeof navigator === 'undefined') return null;
  
  return {
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
    deviceMemory: (navigator as any).deviceMemory || null,
    connection: getNetworkInfo(),
    memory: getMemoryUsage(),
  };
}

// Adaptive loading based on device capabilities
export function shouldUseReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function shouldUseLowQuality(): boolean {
  const connection = getNetworkInfo();
  const memory = getMemoryUsage();
  
  // Use low quality on slow connections or low memory devices
  if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
    return true;
  }
  
  if (memory && memory.usedJSHeapSize > memory.totalJSHeapSize * 0.8) {
    return true;
  }
  
  return false;
}

// React import for lazy component creation
import React from 'react';

export default {
  debounce,
  throttle,
  createLazyComponent,
  preloadImage,
  preloadImages,
  addResourceHint,
  preloadRoute,
  reportWebVitals,
  createIntersectionObserver,
  PerformanceMonitor,
  getMemoryUsage,
  getNetworkInfo,
  getDeviceCapabilities,
  shouldUseReducedMotion,
  shouldUseLowQuality,
};
