'use client';

import { useEffect, useRef, useState } from 'react';
import { ClientOnlyContent } from '@/components/HydrationSafeWrapper';

interface SimpleAdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
  publisherId?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
    adSenseLoaded?: boolean;
  }
}

/**
 * مكون AdSense بسيط وآمن - بدون page level ads
 */
export default function SimpleAdSense({
  adSlot,
  adFormat = 'auto',
  className = '',
  style = {},
  publisherId = 'ca-pub-YOUR_PUBLISHER_ID'
}: SimpleAdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const attemptCountRef = useRef(0);

  useEffect(() => {
    const loadAd = () => {
      // تجنب المحاولات المفرطة
      if (attemptCountRef.current > 5) {
        setHasError(true);
        return;
      }

      attemptCountRef.current++;

      try {
        // التأكد من وجود window
        if (typeof window === 'undefined') return;

        // تهيئة adsbygoogle
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }

        // التأكد من وجود العنصر
        if (!adRef.current) {
          setTimeout(loadAd, 200);
          return;
        }

        const insElement = adRef.current.querySelector('ins.adsbygoogle');
        if (!insElement) {
          setTimeout(loadAd, 200);
          return;
        }

        // التحقق من عدم التحميل المسبق
        if (insElement.getAttribute('data-adsbygoogle-status')) {
          setIsLoaded(true);
          return;
        }

        // تحميل الإعلان فقط (بدون page level ads)
        window.adsbygoogle.push({});
        setIsLoaded(true);

      } catch (error) {
        console.warn('AdSense ad loading error:', error);
        
        // إعادة المحاولة
        if (attemptCountRef.current <= 5) {
          setTimeout(loadAd, 1000);
        } else {
          setHasError(true);
        }
      }
    };

    // تأخير التحميل
    const timer = setTimeout(loadAd, 300);

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

  if (hasError) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`} style={style}>
        <div className="text-center text-gray-400 text-sm">
          <div className="mb-2">📢</div>
          <div>الإعلان غير متاح حالياً</div>
        </div>
      </div>
    );
  }

  return (
    <ClientOnlyContent fallback={
      <div className={`bg-gray-800 rounded-lg animate-pulse ${className}`} style={{ minHeight: '100px', ...style }}>
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          <div className="text-center">
            <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div>جاري تحميل الإعلان...</div>
          </div>
        </div>
      </div>
    }>
      <div 
        ref={adRef}
        className={`simple-adsense-container ${className}`}
        style={{ 
          overflow: 'hidden',
          borderRadius: '8px',
          position: 'relative',
          ...style 
        }}
      >
        <ins
          className="adsbygoogle"
          style={adStyles}
          data-ad-client={publisherId}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      </div>
    </ClientOnlyContent>
  );
}

/**
 * مكونات AdSense بسيطة جاهزة
 */

// بانر بسيط
export function SimpleBanner({ 
  adSlot, 
  className = 'my-4',
  publisherId 
}: { 
  adSlot: string; 
  className?: string;
  publisherId?: string;
}) {
  return (
    <SimpleAdSense
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

// شريط جانبي بسيط
export function SimpleSidebar({ 
  adSlot, 
  className = 'mb-6',
  publisherId 
}: { 
  adSlot: string; 
  className?: string;
  publisherId?: string;
}) {
  return (
    <SimpleAdSense
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

// مربع متوسط
export function SimpleRectangle({ 
  adSlot, 
  className = 'my-6',
  publisherId 
}: { 
  adSlot: string; 
  className?: string;
  publisherId?: string;
}) {
  return (
    <SimpleAdSense
      adSlot={adSlot}
      adFormat="rectangle"
      className={className}
      publisherId={publisherId}
      style={{ 
        minHeight: '250px',
        width: '300px',
        margin: '0 auto'
      }}
    />
  );
}

// للموبايل
export function SimpleMobile({ 
  adSlot, 
  className = 'block md:hidden my-4',
  publisherId 
}: { 
  adSlot: string; 
  className?: string;
  publisherId?: string;
}) {
  return (
    <SimpleAdSense
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

// للديسكتوب
export function SimpleDesktop({ 
  adSlot, 
  className = 'hidden md:block my-4',
  publisherId 
}: { 
  adSlot: string; 
  className?: string;
  publisherId?: string;
}) {
  return (
    <SimpleAdSense
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
