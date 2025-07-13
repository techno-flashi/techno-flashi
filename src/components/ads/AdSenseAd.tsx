'use client';

import { useEffect, useRef } from 'react';
import { ClientOnlyContent } from '@/components/HydrationSafeWrapper';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adLayout?: string;
  adLayoutKey?: string;
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
  fullWidthResponsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * مكون Google AdSense متجاوب وآمن
 */
export default function AdSenseAd({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  className = '',
  style = {},
  responsive = true,
  fullWidthResponsive = true
}: AdSenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // تجنب التحميل المتكرر
    if (isLoadedRef.current) return;

    const loadAd = () => {
      try {
        // التأكد من وجود AdSense script
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          // التأكد من وجود العنصر في DOM
          if (adRef.current && adRef.current.querySelector('ins')) {
            // تحميل الإعلان
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            isLoadedRef.current = true;
          }
        } else {
          // إعادة المحاولة إذا لم يتم تحميل AdSense بعد
          setTimeout(loadAd, 500);
        }
      } catch (error) {
        console.warn('AdSense loading error:', error);
      }
    };

    // تأخير قصير للتأكد من تحميل الصفحة
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

  return (
    <ClientOnlyContent fallback={
      <div className={`bg-gray-800 rounded-lg animate-pulse ${className}`} style={{ minHeight: '100px' }}>
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          جاري تحميل الإعلان...
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
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-YOUR_PUBLISHER_ID"}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-ad-layout={adLayout}
          data-ad-layout-key={adLayoutKey}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        />
      </div>
    </ClientOnlyContent>
  );
}

/**
 * مكون AdSense للمقالات (In-Article)
 */
export function InArticleAd({ 
  adSlot, 
  className = 'my-8' 
}: { 
  adSlot: string; 
  className?: string; 
}) {
  return (
    <AdSenseAd
      adSlot={adSlot}
      adFormat="auto"
      adLayout="in-article"
      className={className}
      style={{ minHeight: '200px' }}
    />
  );
}

/**
 * مكون AdSense للشريط الجانبي
 */
export function SidebarAd({ 
  adSlot, 
  className = 'mb-6' 
}: { 
  adSlot: string; 
  className?: string; 
}) {
  return (
    <AdSenseAd
      adSlot={adSlot}
      adFormat="auto"
      className={className}
      style={{ 
        minHeight: '250px',
        maxWidth: '300px',
        margin: '0 auto'
      }}
    />
  );
}

/**
 * مكون AdSense للبانر العلوي/السفلي
 */
export function BannerAd({ 
  adSlot, 
  className = 'my-4',
  position = 'top'
}: { 
  adSlot: string; 
  className?: string;
  position?: 'top' | 'bottom';
}) {
  return (
    <AdSenseAd
      adSlot={adSlot}
      adFormat="auto"
      className={className}
      style={{ 
        minHeight: '90px',
        width: '100%'
      }}
    />
  );
}

/**
 * مكون AdSense متجاوب للموبايل
 */
export function MobileAd({ 
  adSlot, 
  className = 'block md:hidden my-4' 
}: { 
  adSlot: string; 
  className?: string; 
}) {
  return (
    <AdSenseAd
      adSlot={adSlot}
      adFormat="auto"
      className={className}
      style={{ 
        minHeight: '100px',
        width: '100%'
      }}
    />
  );
}

/**
 * مكون AdSense للديسكتوب
 */
export function DesktopAd({ 
  adSlot, 
  className = 'hidden md:block my-4' 
}: { 
  adSlot: string; 
  className?: string; 
}) {
  return (
    <AdSenseAd
      adSlot={adSlot}
      adFormat="auto"
      className={className}
      style={{ 
        minHeight: '250px',
        width: '100%'
      }}
    />
  );
}
