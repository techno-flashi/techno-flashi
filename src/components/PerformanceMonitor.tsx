'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  showDebugInfo?: boolean;
}

export function PerformanceMonitor({ 
  onMetricsUpdate, 
  showDebugInfo = false 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });

  useEffect(() => {
    // Only run in development or when explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !showDebugInfo) {
      return;
    }

    let clsValue = 0;
    let clsEntries: LayoutShift[] = [];

    // Measure LCP (Largest Contentful Paint)
    const measureLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
          const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
          
          setMetrics(prev => ({ ...prev, lcp }));
          onMetricsUpdate?.({ ...metrics, lcp });
        });
        
        try {
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP measurement not supported');
        }
      }
    };

    // Measure FID (First Input Delay)
    const measureFID = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            const fid = entry.processingStart - entry.startTime;
            setMetrics(prev => ({ ...prev, fid }));
            onMetricsUpdate?.({ ...metrics, fid });
          });
        });
        
        try {
          observer.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID measurement not supported');
        }
      }
    };

    // Measure CLS (Cumulative Layout Shift)
    const measureCLS = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries() as LayoutShift[];
          
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsEntries.push(entry);
              clsValue += entry.value;
            }
          });
          
          setMetrics(prev => ({ ...prev, cls: clsValue }));
          onMetricsUpdate?.({ ...metrics, cls: clsValue });
        });
        
        try {
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS measurement not supported');
        }
      }
    };

    // Measure FCP (First Contentful Paint)
    const measureFCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              const fcp = entry.startTime;
              setMetrics(prev => ({ ...prev, fcp }));
              onMetricsUpdate?.({ ...metrics, fcp });
            }
          });
        });
        
        try {
          observer.observe({ entryTypes: ['paint'] });
        } catch (e) {
          console.warn('FCP measurement not supported');
        }
      }
    };

    // Measure TTFB (Time to First Byte)
    const measureTTFB = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const ttfb = navigationEntries[0].responseStart - navigationEntries[0].requestStart;
          setMetrics(prev => ({ ...prev, ttfb }));
          onMetricsUpdate?.({ ...metrics, ttfb });
        }
      }
    };

    // Initialize measurements
    measureLCP();
    measureFID();
    measureCLS();
    measureFCP();
    measureTTFB();

    // Cleanup function
    return () => {
      // Performance observers are automatically cleaned up
    };
  }, [onMetricsUpdate, showDebugInfo]);

  const getScoreColor = (metric: string, value: number | null) => {
    if (value === null) return 'text-gray-400';
    
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'text-green-400' : value <= 4000 ? 'text-yellow-400' : 'text-red-400';
      case 'fid':
        return value <= 100 ? 'text-green-400' : value <= 300 ? 'text-yellow-400' : 'text-red-400';
      case 'cls':
        return value <= 0.1 ? 'text-green-400' : value <= 0.25 ? 'text-yellow-400' : 'text-red-400';
      case 'fcp':
        return value <= 1800 ? 'text-green-400' : value <= 3000 ? 'text-yellow-400' : 'text-red-400';
      case 'ttfb':
        return value <= 800 ? 'text-green-400' : value <= 1800 ? 'text-yellow-400' : 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatValue = (metric: string, value: number | null) => {
    if (value === null) return 'قياس...';
    
    switch (metric) {
      case 'cls':
        return value.toFixed(3);
      case 'lcp':
      case 'fid':
      case 'fcp':
      case 'ttfb':
        return `${Math.round(value)}ms`;
      default:
        return value.toString();
    }
  };

  if (!showDebugInfo && process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-dark-card border border-gray-700 rounded-lg p-4 shadow-xl max-w-xs">
      <h3 className="text-white font-bold mb-3 text-sm">مقاييس الأداء</h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-300">LCP:</span>
          <span className={getScoreColor('lcp', metrics.lcp)}>
            {formatValue('lcp', metrics.lcp)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">FID:</span>
          <span className={getScoreColor('fid', metrics.fid)}>
            {formatValue('fid', metrics.fid)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">CLS:</span>
          <span className={getScoreColor('cls', metrics.cls)}>
            {formatValue('cls', metrics.cls)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">FCP:</span>
          <span className={getScoreColor('fcp', metrics.fcp)}>
            {formatValue('fcp', metrics.fcp)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">TTFB:</span>
          <span className={getScoreColor('ttfb', metrics.ttfb)}>
            {formatValue('ttfb', metrics.ttfb)}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <div>🟢 ممتاز | 🟡 يحتاج تحسين | 🔴 ضعيف</div>
        </div>
      </div>
    </div>
  );
}

// Hook لاستخدام مقاييس الأداء
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });

  const updateMetrics = (newMetrics: PerformanceMetrics) => {
    setMetrics(newMetrics);
  };

  return { metrics, updateMetrics };
}
