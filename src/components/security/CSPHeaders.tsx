'use client';

import { useEffect } from 'react';

/**
 * مكون لتطبيق Content Security Policy وتحسين الأمان
 */
export default function CSPHeaders() {
  useEffect(() => {
    // تطبيق CSP عبر JavaScript إذا لم يتم تطبيقه من الخادم
    const applyCSP = () => {
      // فحص ما إذا كان CSP مطبق بالفعل
      const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      
      if (!existingCSP) {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval'
            https://www.googletagmanager.com
            https://www.google-analytics.com
            https://pagead2.googlesyndication.com
            https://partner.googleadservices.com
            https://ezojs.com
            https://www.ezojs.com
            https://go.ezojs.com
            https://gatekeeperconsent.com
            https://privacy.gatekeeperconsent.com
            https://cdn.id5-sync.com
            https://cdn.jsdelivr.net
            https://unpkg.com;
          style-src 'self' 'unsafe-inline' 
            https://fonts.googleapis.com
            https://cdn.jsdelivr.net;
          font-src 'self' 
            https://fonts.gstatic.com
            https://cdn.jsdelivr.net;
          img-src 'self' data: blob: 
            https://images.unsplash.com
            https://i.imgur.com
            https://placehold.co
            https://via.placeholder.com
            https://upload.wikimedia.org
            https://i.pinimg.com
            https://zgktrwpladrkhhemhnni.supabase.co
            https://ugrfqcfhoxgpxcwnnbxu.supabase.co
            https://www.google-analytics.com
            https://www.googletagmanager.com
            https://pagead2.googlesyndication.com;
          connect-src 'self'
            https://zgktrwpladrkhhemhnni.supabase.co
            https://ugrfqcfhoxgpxcwnnbxu.supabase.co
            https://www.google-analytics.com
            https://www.googletagmanager.com
            https://region1.google-analytics.com
            https://ezojs.com
            https://www.ezojs.com
            https://go.ezojs.com
            https://g.ezoic.net
            https://privacy.gatekeeperconsent.com
            https://ep1.adtrafficquality.google;
          frame-src 'self'
            https://www.youtube.com
            https://www.google.com
            https://pagead2.googlesyndication.com
            https://googleads.g.doubleclick.net;
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          frame-ancestors 'none';
          upgrade-insecure-requests;
        `.replace(/\s+/g, ' ').trim();
        
        document.head.appendChild(meta);
      }
    };

    applyCSP();
  }, []);

  return null;
}

/**
 * مكون لتحسين أمان الموقع
 */
export function SecurityEnhancer() {
  useEffect(() => {
    // منع النقر بالزر الأيمن في بيئة الإنتاج
    const preventRightClick = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
        return false;
      }
    };

    // منع فتح أدوات المطور في بيئة الإنتاج
    const preventDevTools = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'production') {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    // إضافة مستمعي الأحداث
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', preventRightClick);
      document.addEventListener('keydown', preventDevTools);
    }

    // تنظيف
    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('keydown', preventDevTools);
    };
  }, []);

  return null;
}

/**
 * مكون لمنع XSS وحقن الكود
 */
export function XSSProtection() {
  useEffect(() => {
    // تنظيف المدخلات من المحتوى الضار
    const sanitizeInputs = () => {
      const inputs = document.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        input.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement | HTMLTextAreaElement;
          const value = target.value;
          
          // إزالة العلامات الضارة
          const sanitized = value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '');
          
          if (sanitized !== value) {
            target.value = sanitized;
          }
        });
      });
    };

    // تطبيق التنظيف عند تحميل الصفحة
    sanitizeInputs();

    // مراقبة إضافة عناصر جديدة
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const newInputs = element.querySelectorAll('input, textarea');
            
            newInputs.forEach(input => {
              input.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement | HTMLTextAreaElement;
                const value = target.value;
                
                const sanitized = value
                  .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                  .replace(/javascript:/gi, '')
                  .replace(/on\w+\s*=/gi, '');
                
                if (sanitized !== value) {
                  target.value = sanitized;
                }
              });
            });
          }
        });
      });
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
 * مكون شامل للأمان
 */
export function SecuritySuite() {
  return (
    <>
      <CSPHeaders />
      <SecurityEnhancer />
      <XSSProtection />
    </>
  );
}
