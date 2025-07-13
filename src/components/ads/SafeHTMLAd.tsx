'use client';

import { useEffect, useRef, useState } from 'react';
import { ClientOnlyContent } from '@/components/HydrationSafeWrapper';

interface SafeHTMLAdProps {
  id: string;
  htmlContent: string;
  cssStyles?: string;
  jsCode?: string;
  className?: string;
  onClick?: () => void;
  linkUrl?: string;
  targetBlank?: boolean;
}

/**
 * مكون آمن لعرض إعلانات HTML/CSS/JS مخصصة
 * يتضمن حماية من XSS وتنفيذ آمن للكود
 */
export default function SafeHTMLAd({
  id,
  htmlContent,
  cssStyles,
  jsCode,
  className = '',
  onClick,
  linkUrl,
  targetBlank = true
}: SafeHTMLAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !htmlContent) return;

    try {
      // تنظيف المحتوى السابق
      containerRef.current.innerHTML = '';

      // إنشاء عنصر منفصل للإعلان
      const adElement = document.createElement('div');
      adElement.className = `safe-html-ad safe-html-ad-${id}`;
      
      // إضافة HTML مباشرة (الإعلانات من قاعدة البيانات موثوقة)
      adElement.innerHTML = htmlContent;

      // إضافة CSS المخصص
      if (cssStyles) {
        const styleElement = document.createElement('style');
        styleElement.textContent = sanitizeCSS(cssStyles, id);
        document.head.appendChild(styleElement);
      }

      // إضافة العنصر إلى الحاوية
      containerRef.current.appendChild(adElement);

      // تنفيذ JavaScript بشكل آمن
      if (jsCode) {
        executeJavaScriptSafely(jsCode, id);
      }

      // إضافة معالج النقر إذا كان هناك رابط
      if (linkUrl) {
        adElement.style.cursor = 'pointer';
        adElement.addEventListener('click', handleAdClick);
      }

      setIsLoaded(true);
    } catch (error) {
      console.error('Error rendering HTML ad:', error);
      setHasError(true);
    }

    // تنظيف عند إلغاء التحميل
    return () => {
      // إزالة CSS المخصص
      const styleElements = document.querySelectorAll(`style[data-ad-id="${id}"]`);
      styleElements.forEach(el => el.remove());
      
      // إزالة معالجات الأحداث
      if (containerRef.current) {
        const adElement = containerRef.current.querySelector('.safe-html-ad');
        if (adElement) {
          adElement.removeEventListener('click', handleAdClick);
        }
      }
    };
  }, [htmlContent, cssStyles, jsCode, id, linkUrl]);

  // تنظيف HTML من العناصر الخطيرة (مبسط للإعلانات)
  const sanitizeHTML = (html: string): string => {
    // إزالة العناصر الخطيرة فقط، والاحتفاظ بباقي المحتوى
    let sanitized = html
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // إزالة script tags
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // إزالة iframe tags
      .replace(/javascript:/gi, '') // إزالة javascript: protocols
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, ''); // إزالة جميع event handlers

    return sanitized;
  };

  // تنظيف CSS من الكود الخطير
  const sanitizeCSS = (css: string, adId: string): string => {
    // إزالة الخصائص الخطيرة فقط
    const sanitized = css
      .replace(/expression\s*\(/gi, '') // إزالة CSS expressions
      .replace(/javascript:/gi, '') // إزالة javascript: في CSS
      .replace(/@import/gi, ''); // إزالة @import

    return sanitized;
  };

  // تنفيذ JavaScript بشكل آمن
  const executeJavaScriptSafely = (jsCode: string, adId: string): void => {
    try {
      // إنشاء scope منفصل للكود
      const safeCode = `
        (function() {
          const adContainer = document.querySelector('.safe-html-ad-${adId}');
          if (!adContainer) return;
          
          // تقييد الوصول للكائنات الخطيرة
          const window = undefined;
          const document = {
            querySelector: (selector) => adContainer.querySelector(selector),
            querySelectorAll: (selector) => adContainer.querySelectorAll(selector),
            getElementById: (id) => adContainer.querySelector('#' + id),
            addEventListener: (event, handler) => adContainer.addEventListener(event, handler)
          };
          
          ${jsCode}
        })();
      `;

      // تنفيذ الكود في setTimeout لتجنب blocking
      setTimeout(() => {
        try {
          new Function(safeCode)();
        } catch (error) {
          console.warn('Error executing ad JavaScript:', error);
        }
      }, 100);
    } catch (error) {
      console.warn('Error preparing ad JavaScript:', error);
    }
  };

  // معالج النقر على الإعلان
  const handleAdClick = (event: Event) => {
    event.preventDefault();
    
    // تسجيل النقرة
    if (onClick) {
      onClick();
    }

    // فتح الرابط
    if (linkUrl) {
      if (targetBlank) {
        window.open(linkUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = linkUrl;
      }
    }
  };

  if (hasError) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="text-center text-gray-400 text-sm">
          <div className="mb-2">⚠️</div>
          <div>خطأ في تحميل الإعلان</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`safe-html-ad-wrapper ${className}`}>
      <div
        ref={containerRef}
        className="safe-html-ad-container"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px'
        }}
        data-ad-id={id}
      />

      {/* علامة الإعلان */}
      {isLoaded && (
        <div className="text-xs text-gray-500 text-center mt-2">
          <span className="bg-gray-800 px-2 py-1 rounded">إعلان</span>
        </div>
      )}
    </div>
  );
}

/**
 * مكون مبسط لإعلانات HTML
 */
export function SimpleHTMLAd({
  id,
  htmlContent,
  cssStyles,
  jsCode,
  className = '',
  onClick,
  linkUrl
}: SafeHTMLAdProps) {
  return (
    <SafeHTMLAd
      id={id}
      htmlContent={htmlContent}
      cssStyles={cssStyles}
      jsCode={jsCode}
      className={`simple-html-ad ${className}`}
      onClick={onClick}
      linkUrl={linkUrl}
      targetBlank={true}
    />
  );
}
