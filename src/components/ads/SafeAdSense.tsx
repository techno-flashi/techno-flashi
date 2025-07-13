'use client';

import { useEffect, useRef, useState } from 'react';
import { ClientOnlyContent } from '@/components/HydrationSafeWrapper';

interface SafeAdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  adLayoutKey?: string;
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
  fullWidthResponsive?: boolean;
  publisherId?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
    adSenseInitialized?: boolean;
    adSenseScriptLoaded?: boolean;
  }
}

/**
 * مكون AdSense آمن ومحسن لتجنب الأخطاء
 */
export default function SafeAdSense({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  className = '',
  style = {},
  responsive = true,
  fullWidthResponsive = true,
  publisherId = 'ca-pub-YOUR_PUBLISHER_ID'
}: SafeAdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const loadAttemptRef = useRef(0);

  useEffect(() => {
    const loadAdSense = async () => {
      // تجنب المحاولات المتكررة
      if (loadAttemptRef.current > 3) {
        setHasError(true);
        return;
      }

      loadAttemptRef.current++;

      try {
        // التأكد من وجود window
        if (typeof window === 'undefined') return;

        // تهيئة adsbygoogle إذا لم تكن موجودة
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }

        // التأكد من وجود العنصر في DOM
        if (!adRef.current) {
          setTimeout(loadAdSense, 100);
          return;
        }

        const insElement = adRef.current.querySelector('ins.adsbygoogle');
        if (!insElement) {
          setTimeout(loadAdSense, 100);
          return;
        }

        // التحقق من أن الإعلان لم يتم تحميله مسبقاً
        if (insElement.getAttribute('data-adsbygoogle-status')) {
          setIsLoaded(true);
          return;
        }

        // تحميل الإعلان
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsLoaded(true);

      } catch (error) {
        console.warn('AdSense loading error:', error);
        
        // إعادة المحاولة بعد تأخير
        if (loadAttemptRef.current <= 3) {
          setTimeout(loadAdSense, 1000 * loadAttemptRef.current);
        } else {
          setHasError(true);
        }
      }
    };

    // تأخير التحميل للتأكد من جاهزية DOM
    const timer = setTimeout(loadAdSense, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const adStyles: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    minHeight: '50px',
    backgroundColor: 'transparent',
    ...style
  };

  // عرض رسالة خطأ إذا فشل التحميل
  if (hasError) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="text-center text-gray-400 text-sm">
          <div className="mb-2">⚠️</div>
          <div>فشل في تحميل الإعلان</div>
          <div className="text-xs mt-1">يرجى التحقق من إعدادات AdSense</div>
        </div>
      </div>
    );
  }

  return (
    <ClientOnlyContent fallback={
      <div className={`bg-gray-800 rounded-lg animate-pulse ${className}`} style={{ minHeight: '100px' }}>
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          <div className="text-center">
            <div className="mb-2">📢</div>
            <div>جاري تحميل الإعلان...</div>
          </div>
        </div>
      </div>
    }>
      <div 
        ref={adRef}
        className={`adsense-container ${className}`}
        style={{ 
          overflow: 'hidden',
          borderRadius: '8px',
          ...style 
        }}
      >
        <ins
          className="adsbygoogle"
          style={adStyles}
          data-ad-client={publisherId}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-ad-layout={adLayout}
          data-ad-layout-key={adLayoutKey}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        />
        
        {/* مؤشر التحميل */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg">
            <div className="text-white text-sm">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
              تحميل الإعلان...
            </div>
          </div>
        )}
      </div>
    </ClientOnlyContent>
  );
}

/**
 * مكونات AdSense جاهزة للاستخدام
 */

// إعلان البانر
export function SafeBannerAd({ 
  adSlot, 
  className = 'my-4',
  publisherId 
}: { 
  adSlot: string; 
  className?: string;
  publisherId?: string;
}) {
  return (
    <SafeAdSense
      adSlot={adSlot}
      adFormat="auto"
      className={className}
      publisherId={publisherId}
      style={{ 
        minHeight: '90px',
        width: '100%'
      }}
    />
  );
}

// إعلان الشريط الجانبي
export function SafeSidebarAd({ 
  adSlot, 
  className = 'mb-6',
  publisherId 
}: { 
  adSlot: string; 
  className?: string;
  publisherId?: string;
}) {
  return (
    <SafeAdSense
      adSlot={adSlot}
      adFormat="auto"
      className={className}
      publisherId={publisherId}
      style={{ 
        minHeight: '250px',
        maxWidth: '300px',
        margin: '0 auto'
      }}
    />
  );
}

// إعلان داخل المقال
export function SafeInArticleAd({ 
  adSlot, 
  className = 'my-8',
  publisherId 
}: { 
  adSlot: string; 
  className?: string;
  publisherId?: string;
}) {
  return (
    <SafeAdSense
      adSlot={adSlot}
      adFormat="auto"
      adLayout="in-article"
      className={className}
      publisherId={publisherId}
      style={{ minHeight: '200px' }}
    />
  );
}

// إعلان للموبايل
export function SafeMobileAd({ 
  adSlot, 
  className = 'block md:hidden my-4',
  publisherId 
}: { 
  adSlot: string; 
  className?: string;
  publisherId?: string;
}) {
  return (
    <SafeAdSense
      adSlot={adSlot}
      adFormat="auto"
      className={className}
      publisherId={publisherId}
      style={{ 
        minHeight: '100px',
        width: '100%'
      }}
    />
  );
}

// إعلان للديسكتوب
export function SafeDesktopAd({ 
  adSlot, 
  className = 'hidden md:block my-4',
  publisherId 
}: { 
  adSlot: string; 
  className?: string;
  publisherId?: string;
}) {
  return (
    <SafeAdSense
      adSlot={adSlot}
      adFormat="auto"
      className={className}
      publisherId={publisherId}
      style={{ 
        minHeight: '250px',
        width: '100%'
      }}
    />
  );
}
