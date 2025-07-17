'use client';

import { useEffect } from 'react';

/**
 * مكون لتحسين تحميل الموارد وتقليل Render-Blocking
 */
export default function ResourceOptimizer() {
  useEffect(() => {
    // تحسين تحميل الصور
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('data-src');
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // تحسين تحميل الفيديوهات
    const optimizeVideos = () => {
      const videos = document.querySelectorAll('video[data-src]');
      
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement;
            const src = video.getAttribute('data-src');
            
            if (src) {
              video.src = src;
              video.removeAttribute('data-src');
              video.load();
              videoObserver.unobserve(video);
            }
          }
        });
      }, {
        rootMargin: '100px 0px',
        threshold: 0.01
      });

      videos.forEach(video => videoObserver.observe(video));
    };

    // تحسين تحميل iframe
    const optimizeIframes = () => {
      const iframes = document.querySelectorAll('iframe[data-src]');
      
      const iframeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const iframe = entry.target as HTMLIFrameElement;
            const src = iframe.getAttribute('data-src');
            
            if (src) {
              iframe.src = src;
              iframe.removeAttribute('data-src');
              iframeObserver.unobserve(iframe);
            }
          }
        });
      }, {
        rootMargin: '200px 0px',
        threshold: 0.01
      });

      iframes.forEach(iframe => iframeObserver.observe(iframe));
    };

    // تطبيق التحسينات
    optimizeImages();
    optimizeVideos();
    optimizeIframes();

    // مراقبة إضافة عناصر جديدة
    const observer = new MutationObserver(() => {
      optimizeImages();
      optimizeVideos();
      optimizeIframes();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}

/**
 * مكون لتحسين Cache Policy
 */
export function CacheOptimizer() {
  useEffect(() => {
    // تحسين التخزين المؤقت للموارد
    const optimizeCache = () => {
      // إضافة headers للتخزين المؤقت
      const addCacheHeaders = (url: string, maxAge: number) => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(registration => {
            registration.active?.postMessage({
              type: 'CACHE_RESOURCE',
              url,
              maxAge
            });
          });
        }
      };

      // تخزين الموارد الثابتة
      const staticResources = [
        { url: '/favicon.ico', maxAge: 31536000 }, // سنة واحدة
        { url: '/logo.png', maxAge: 31536000 },
        { url: '/manifest.json', maxAge: 86400 }, // يوم واحد
      ];

      staticResources.forEach(resource => {
        addCacheHeaders(resource.url, resource.maxAge);
      });
    };

    optimizeCache();
  }, []);

  return null;
}

/**
 * مكون لتحسين تحميل الخطوط
 */
export function FontOptimizer() {
  useEffect(() => {
    // تحميل الخطوط بشكل مُحسن
    const optimizeFonts = () => {
      // إضافة font-display: swap للخطوط الموجودة
      const styleSheets = document.styleSheets;
      
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const styleSheet = styleSheets[i];
          const rules = styleSheet.cssRules || styleSheet.rules;
          
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j] as CSSFontFaceRule;
            
            if (rule.type === CSSRule.FONT_FACE_RULE) {
              const style = rule.style as any;
              if (!style.fontDisplay) {
                style.fontDisplay = 'swap';
              }
            }
          }
        } catch (e) {
          // تجاهل الأخطاء للخطوط من مصادر خارجية
          console.warn('Cannot modify external font stylesheet:', e);
        }
      }
    };

    // تطبيق التحسينات بعد تحميل الصفحة
    if (document.readyState === 'complete') {
      optimizeFonts();
    } else {
      window.addEventListener('load', optimizeFonts);
    }

    return () => {
      window.removeEventListener('load', optimizeFonts);
    };
  }, []);

  return null;
}

/**
 * مكون لتحسين JavaScript
 */
export function JavaScriptOptimizer() {
  useEffect(() => {
    // تأجيل تحميل JavaScript غير الأساسي
    const deferNonCriticalJS = () => {
      const scripts = document.querySelectorAll('script[data-defer]');
      
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        const src = script.getAttribute('data-src') || script.getAttribute('src');
        
        if (src) {
          newScript.src = src;
          newScript.async = true;
          newScript.defer = true;
          
          // نسخ الخصائص الأخرى
          Array.from(script.attributes).forEach(attr => {
            if (attr.name !== 'data-defer' && attr.name !== 'data-src') {
              newScript.setAttribute(attr.name, attr.value);
            }
          });
          
          document.body.appendChild(newScript);
          script.remove();
        }
      });
    };

    // تطبيق التحسينات بعد تفاعل المستخدم
    const handleFirstInteraction = () => {
      deferNonCriticalJS();
      
      // إزالة مستمعي الأحداث
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    // إضافة مستمعي الأحداث
    document.addEventListener('scroll', handleFirstInteraction, { passive: true });
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  return null;
}

/**
 * مكون شامل لتحسين الموارد
 */
export function ResourceOptimizationSuite() {
  return (
    <>
      <ResourceOptimizer />
      <CacheOptimizer />
      <FontOptimizer />
      <JavaScriptOptimizer />
    </>
  );
}
