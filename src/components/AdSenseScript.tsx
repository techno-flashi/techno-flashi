'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    adsbygoogle: any[];
    adsenseInitialized?: boolean;
  }
}

interface AdSenseScriptProps {
  publisherId: string;
  strategy?: 'afterInteractive' | 'beforeInteractive' | 'lazyOnload';
}

/**
 * مكون تحميل Google AdSense بطريقة آمنة ومحسنة
 */
export default function AdSenseScript({ 
  publisherId, 
  strategy = 'afterInteractive' 
}: AdSenseScriptProps) {
  useEffect(() => {
    // التأكد من عدم تحميل AdSense أكثر من مرة
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      window.adsbygoogle = [];
    }
  }, []);

  return (
    <>
      {/* Google AdSense Script - محسن */}
      <Script
        id="google-adsense"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        strategy={strategy}
        async
        crossOrigin="anonymous"
        onLoad={() => {
          console.log('AdSense script loaded successfully');
          // تهيئة فورية بعد التحميل
          if (typeof window !== 'undefined') {
            window.adsbygoogle = window.adsbygoogle || [];
          }
        }}
        onError={(error) => {
          console.warn('AdSense script failed to load:', error);
        }}
      />
    </>
  );
}

/**
 * مكون تهيئة AdSense مرة واحدة فقط
 */
export function InitializeAdSense({ publisherId }: { publisherId: string }) {
  useEffect(() => {
    // تهيئة AdSense مرة واحدة فقط
    if (typeof window !== 'undefined' && !window.adsenseInitialized) {
      // انتظار تحميل AdSense script
      const initAds = () => {
        if (window.adsbygoogle && !window.adsenseInitialized) {
          try {
            window.adsbygoogle.push({
              google_ad_client: publisherId,
              enable_page_level_ads: true,
              overlays: { bottom: true }
            });
            // تعيين علامة لمنع التهيئة المكررة
            window.adsenseInitialized = true;
            console.log('✅ AdSense initialized successfully');
          } catch (error) {
            console.warn('❌ AdSense initialization error:', error);
          }
        } else if (!window.adsbygoogle) {
          // إعادة المحاولة بعد 500ms
          setTimeout(initAds, 500);
        } else if (window.adsenseInitialized) {
          console.log('⚠️ AdSense already initialized, skipping...');
        }
      };

      // تأخير قصير للتأكد من تحميل script
      setTimeout(initAds, 100);
    }
  }, [publisherId]);

  return null;
}
