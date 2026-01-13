'use client';

import { useEffect, useState } from 'react';

interface HydrationSafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * مكون آمن للـ hydration يتجنب مشاكل التطابق بين الخادم والعميل
 */
export default function HydrationSafeWrapper({ 
  children, 
  fallback = null 
}: HydrationSafeWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // تأكد من أن التطبيق تم تحميله بالكامل
    setIsHydrated(true);
    
    // إزالة attributes التي تضيفها browser extensions
    const cleanupExtensionAttributes = () => {
      const extensionAttributes = [
        'sapling-installed',
        'grammarly-extension-installed',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'cz-shortcut-listen',
        'data-lt-installed',
        'data-gramm',
        'data-gramm_editor',
        'spellcheck'
      ];

      extensionAttributes.forEach(attr => {
        if (document.body.hasAttribute(attr)) {
          document.body.removeAttribute(attr);
        }
        if (document.documentElement.hasAttribute(attr)) {
          document.documentElement.removeAttribute(attr);
        }
      });
    };

    // تنظيف فوري
    cleanupExtensionAttributes();

    // تنظيف دوري كل ثانية
    const interval = setInterval(cleanupExtensionAttributes, 1000);

    // مراقب للتغييرات
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          const attributeName = mutation.attributeName;
          
          if (attributeName && (
            attributeName.includes('sapling') ||
            attributeName.includes('grammarly') ||
            attributeName.includes('gramm') ||
            attributeName.includes('gr-ext') ||
            attributeName.includes('cz-shortcut') ||
            attributeName.includes('lt-installed')
          )) {
            target.removeAttribute(attributeName);
          }
        }
      });
    });

    // مراقبة التغييرات على body و html
    observer.observe(document.body, {
      attributes: true,
      subtree: false
    });

    observer.observe(document.documentElement, {
      attributes: true,
      subtree: false
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // عرض fallback حتى يتم الـ hydration
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * مكون لقمع تحذيرات hydration في development
 */
export function DevHydrationSuppressor() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // حفظ console.error الأصلي
      const originalError = console.error;
      const originalWarn = console.warn;

      // تصفية رسائل hydration
      console.error = (...args) => {
        const message = args[0];
        if (typeof message === 'string') {
          // تجاهل رسائل hydration المتعلقة بـ extensions
          if (
            message.includes('hydrated but some attributes') ||
            message.includes('server rendered HTML') ||
            message.includes('sapling-installed') ||
            message.includes('grammarly-extension') ||
            message.includes('browser extension') ||
            message.includes('data-new-gr-c-s-check-loaded') ||
            message.includes('data-gr-ext-installed')
          ) {
            return;
          }
        }
        originalError.apply(console, args);
      };

      console.warn = (...args) => {
        const message = args[0];
        if (typeof message === 'string') {
          if (
            message.includes('hydration') ||
            message.includes('server rendered HTML') ||
            message.includes('sapling') ||
            message.includes('grammarly')
          ) {
            return;
          }
        }
        originalWarn.apply(console, args);
      };

      return () => {
        console.error = originalError;
        console.warn = originalWarn;
      };
    }
  }, []);

  return null;
}

/**
 * Hook لاستخدام hydration آمن
 */
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * مكون للمحتوى الذي يعتمد على client-side فقط
 */
export function ClientOnlyContent({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-800 rounded h-4 w-32"></div> 
}: HydrationSafeWrapperProps) {
  const isHydrated = useHydrationSafe();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
