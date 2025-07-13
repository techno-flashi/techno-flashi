'use client';

import { useEffect } from 'react';

/**
 * مكون لإصلاح مشاكل الـ hydration المتعلقة بـ browser extensions
 * يقوم بإزالة attributes التي تضيفها extensions مثل Sapling
 */
export default function HydrationFix() {
  useEffect(() => {
    // إزالة attributes التي تضيفها browser extensions
    const removeExtensionAttributes = () => {
      // قائمة بالـ attributes التي تضيفها extensions شائعة
      const extensionAttributes = [
        'sapling-installed',
        'grammarly-extension-installed',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'cz-shortcut-listen',
        'data-lt-installed'
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

    // تشغيل الإزالة فور التحميل
    removeExtensionAttributes();

    // مراقبة التغييرات وإزالة attributes جديدة
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          const attributeName = mutation.attributeName;
          
          if (attributeName && (
            attributeName.includes('sapling') ||
            attributeName.includes('grammarly') ||
            attributeName.includes('gr-ext') ||
            attributeName.includes('cz-shortcut') ||
            attributeName.includes('lt-installed')
          )) {
            target.removeAttribute(attributeName);
          }
        }
      });
    });

    // مراقبة body و html
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['sapling-installed', 'grammarly-extension-installed', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed', 'cz-shortcut-listen', 'data-lt-installed']
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['sapling-installed', 'grammarly-extension-installed', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed', 'cz-shortcut-listen', 'data-lt-installed']
    });

    // تنظيف المراقب عند إلغاء التحميل
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // هذا المكون لا يعرض أي شيء
}

/**
 * مكون لقمع تحذيرات الـ hydration في development
 */
export function SuppressHydrationWarning({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // قمع تحذيرات hydration في development فقط
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      console.error = (...args) => {
        const message = args[0];
        if (
          typeof message === 'string' && 
          (
            message.includes('hydration') ||
            message.includes('server rendered HTML') ||
            message.includes('sapling-installed') ||
            message.includes('browser extension')
          )
        ) {
          // تجاهل تحذيرات hydration المتعلقة بـ extensions
          return;
        }
        originalError.apply(console, args);
      };

      return () => {
        console.error = originalError;
      };
    }
  }, []);

  return <>{children}</>;
}
