'use client';

import { useEffect } from 'react';

/**
 * مكون لتحسين تحميل CSS وتطبيق Critical CSS
 */
export default function CriticalCSS() {
  useEffect(() => {
    // تحميل CSS غير الأساسي بعد تحميل الصفحة
    const loadNonCriticalCSS = () => {
      // قائمة ملفات CSS غير الأساسية
      const nonCriticalCSS = [
        '/styles/components.css',
        '/styles/animations.css',
        '/styles/responsive-enhancements.css'
      ];

      nonCriticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = function() {
          this.media = 'all';
        };
        document.head.appendChild(link);
      });

      // إظهار المحتوى غير الأساسي
      setTimeout(() => {
        const nonCriticalElements = document.querySelectorAll('.non-critical');
        nonCriticalElements.forEach(element => {
          element.classList.add('loaded');
        });
      }, 100);
    };

    // تحميل CSS غير الأساسي بعد تحميل الصفحة
    if (document.readyState === 'complete') {
      loadNonCriticalCSS();
    } else {
      window.addEventListener('load', loadNonCriticalCSS);
    }

    return () => {
      window.removeEventListener('load', loadNonCriticalCSS);
    };
  }, []);

  return null;
}

/**
 * مكون لتحسين تحميل الخطوط
 */
export function FontOptimizer() {
  useEffect(() => {
    // تحميل الخطوط بشكل مُحسن
    const preloadFonts = () => {
      const fonts = [
        {
          href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap',
          crossOrigin: 'anonymous'
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;600;700&display=swap',
          crossOrigin: 'anonymous'
        }
      ];

      fonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = font.href;
        link.crossOrigin = font.crossOrigin;
        link.onload = function() {
          this.rel = 'stylesheet';
        };
        document.head.appendChild(link);
      });
    };

    preloadFonts();
  }, []);

  return null;
}

/**
 * مكون لتحسين تحميل JavaScript
 */
export function JavaScriptOptimizer() {
  useEffect(() => {
    // تأجيل تحميل JavaScript غير الأساسي
    const loadNonCriticalJS = () => {
      // قائمة بالسكريبتات غير الأساسية
      const nonCriticalScripts = [
        // يمكن إضافة سكريبتات غير أساسية هنا
      ];

      nonCriticalScripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      });
    };

    // تحميل JavaScript غير الأساسي بعد تفاعل المستخدم
    const handleFirstInteraction = () => {
      loadNonCriticalJS();
      
      // إزالة مستمعي الأحداث بعد أول تفاعل
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    // إضافة مستمعي الأحداث للتفاعل الأول
    document.addEventListener('scroll', handleFirstInteraction, { passive: true });
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    // تنظيف
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
 * مكون شامل لتحسين الأداء
 */
export function PerformanceOptimizer() {
  return (
    <>
      <CriticalCSS />
      <FontOptimizer />
      <JavaScriptOptimizer />
    </>
  );
}
