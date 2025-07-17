'use client';

import { useEffect } from 'react';

/**
 * مكون لتحسين Time To First Byte (TTFB)
 */
export default function TTFBOptimizer() {
  useEffect(() => {
    // تحسين طلبات الشبكة
    const optimizeNetworkRequests = () => {
      // إضافة DNS prefetch للمواقع الخارجية المهمة
      const externalDomains = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'www.google-analytics.com',
        'www.googletagmanager.com',
        'zgktrwpladrkhhemhnni.supabase.co',
        'cdn.jsdelivr.net'
      ];

      externalDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = `//${domain}`;
        document.head.appendChild(link);
      });

      // إضافة preconnect للمواقع الحرجة
      const criticalDomains = [
        'https://fonts.googleapis.com',
        'https://zgktrwpladrkhhemhnni.supabase.co'
      ];

      criticalDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // تحسين تحميل الموارد الحرجة
    const preloadCriticalResources = () => {
      // قائمة بالموارد الحرجة للتحميل المسبق
      const criticalResources = [
        {
          href: '/favicon.ico',
          as: 'image',
          type: 'image/x-icon'
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap',
          as: 'style',
          crossOrigin: 'anonymous'
        }
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        
        if (resource.type) {
          link.type = resource.type;
        }
        
        if (resource.crossOrigin) {
          link.crossOrigin = resource.crossOrigin;
        }
        
        document.head.appendChild(link);
      });
    };

    // تحسين استعلامات قاعدة البيانات (محاكاة)
    const optimizeDatabaseQueries = () => {
      // تطبيق تخزين مؤقت للبيانات المتكررة
      const cacheKey = 'technoflash_cache';
      const cacheExpiry = 5 * 60 * 1000; // 5 دقائق
      
      // فحص البيانات المخزنة مؤقتاً
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
      
      if (cachedData && cacheTimestamp) {
        const isExpired = Date.now() - parseInt(cacheTimestamp) > cacheExpiry;
        
        if (isExpired) {
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(`${cacheKey}_timestamp`);
        }
      }
    };

    // تحسين ضغط الاستجابات
    const optimizeResponseCompression = () => {
      // فحص دعم ضغط Brotli
      const supportsBrotli = 'CompressionStream' in window && 
                           'DecompressionStream' in window;
      
      if (supportsBrotli) {
        // إضافة header لطلب ضغط Brotli
        const originalFetch = window.fetch;
        window.fetch = function(input, init = {}) {
          const headers = new Headers(init.headers);
          
          if (!headers.has('Accept-Encoding')) {
            headers.set('Accept-Encoding', 'br, gzip, deflate');
          }
          
          return originalFetch(input, {
            ...init,
            headers
          });
        };
      }
    };

    // تحسين HTTP/2 Server Push (محاكاة)
    const optimizeServerPush = () => {
      // إضافة hints للخادم حول الموارد المطلوبة
      const criticalPaths = [
        '/_next/static/css/',
        '/_next/static/js/',
        '/api/articles',
        '/api/ai-tools'
      ];

      criticalPaths.forEach(path => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        document.head.appendChild(link);
      });
    };

    // تطبيق جميع التحسينات
    optimizeNetworkRequests();
    preloadCriticalResources();
    optimizeDatabaseQueries();
    optimizeResponseCompression();
    optimizeServerPush();

  }, []);

  return null;
}

/**
 * مكون لمراقبة أداء TTFB
 */
export function TTFBMonitor() {
  useEffect(() => {
    // قياس TTFB
    const measureTTFB = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        
        if (navigationEntries.length > 0) {
          const entry = navigationEntries[0];
          const ttfb = entry.responseStart - entry.requestStart;
          
          console.log(`TTFB: ${Math.round(ttfb)}ms`);
          
          // تحذير إذا كان TTFB بطيء
          if (ttfb > 600) {
            console.warn(`Slow TTFB detected: ${Math.round(ttfb)}ms. Consider server optimization.`);
          }
          
          // إرسال البيانات للتحليل (اختياري)
          if (typeof (window as any).gtag !== 'undefined') {
            (window as any).gtag('event', 'timing_complete', {
              name: 'TTFB',
              value: Math.round(ttfb)
            });
          }
        }
      }
    };

    // قياس TTFB بعد تحميل الصفحة
    if (document.readyState === 'complete') {
      measureTTFB();
    } else {
      window.addEventListener('load', measureTTFB);
    }

    return () => {
      window.removeEventListener('load', measureTTFB);
    };
  }, []);

  return null;
}

/**
 * مكون لتحسين استجابة الخادم
 */
export function ServerResponseOptimizer() {
  useEffect(() => {
    // تحسين طلبات API
    const optimizeAPIRequests = () => {
      // إضافة timeout للطلبات
      const originalFetch = window.fetch;
      
      window.fetch = function(input, init = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 ثوان timeout
        
        return originalFetch(input, {
          ...init,
          signal: controller.signal
        }).finally(() => {
          clearTimeout(timeoutId);
        });
      };
    };

    // تحسين تحميل البيانات
    const optimizeDataLoading = () => {
      // تطبيق lazy loading للبيانات غير الحرجة
      const lazyLoadData = (callback: () => void, delay = 1000) => {
        const timeoutId = setTimeout(callback, delay);
        
        // إلغاء التحميل إذا غادر المستخدم الصفحة
        const handleVisibilityChange = () => {
          if (document.hidden) {
            clearTimeout(timeoutId);
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
          clearTimeout(timeoutId);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      };

      // تحميل البيانات غير الحرجة بعد تأخير
      lazyLoadData(() => {
        console.log('Loading non-critical data...');
      }, 2000);
    };

    // تطبيق التحسينات
    optimizeAPIRequests();
    optimizeDataLoading();
  }, []);

  return null;
}

/**
 * مكون شامل لتحسين TTFB
 */
export function TTFBOptimizationSuite() {
  return (
    <>
      <TTFBOptimizer />
      <TTFBMonitor />
      <ServerResponseOptimizer />
    </>
  );
}
