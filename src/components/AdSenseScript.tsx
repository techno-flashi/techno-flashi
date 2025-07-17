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
  strategy = 'lazyOnload' // Changed default to lazyOnload for better performance
}: AdSenseScriptProps) {
  useEffect(() => {
    // التأكد من عدم تحميل AdSense أكثر من مرة
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      window.adsbygoogle = [];
    }
  }, []);

  return (
    <>
      {/* Google AdSense Script - Performance optimized */}
      <Script
        id="google-adsense"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
        strategy={strategy}
        async
        crossOrigin="anonymous"
        onLoad={() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('AdSense script loaded successfully');
          }
          // تهيئة فورية بعد التحميل
          if (typeof window !== 'undefined') {
            window.adsbygoogle = window.adsbygoogle || [];
          }
        }}
        onError={(error) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('AdSense script failed to load:', error);
          }
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
    // فحص شامل لمنع التهيئة المكررة
    if (typeof window === 'undefined') return;

    // فحص جميع العلامات الممكنة للتهيئة
    const isAlreadyInitialized =
      window.adsenseInitialized ||
      document.querySelector('[data-adsense-initialized]') ||
      document.querySelector('script[data-ad-client]') ||
      document.body.hasAttribute('data-adsense-initialized');

    if (isAlreadyInitialized) {
      console.log('⚠️ AdSense already initialized, skipping duplicate initialization');
      return;
    }

    // تهيئة AdSense مرة واحدة فقط
    const initAds = () => {
      if (window.adsbygoogle && !window.adsenseInitialized) {
        try {
          // فحص أخير قبل التهيئة
          if (!document.querySelector('[data-adsense-initialized]')) {
            window.adsbygoogle.push({
              google_ad_client: publisherId,
              enable_page_level_ads: true,
              overlays: { bottom: true }
            });

            // تعيين علامات متعددة لمنع التهيئة المكررة
            window.adsenseInitialized = true;
            document.body.setAttribute('data-adsense-initialized', 'true');

            // إضافة علامة إضافية في head
            const meta = document.createElement('meta');
            meta.name = 'adsense-initialized';
            meta.content = 'true';
            document.head.appendChild(meta);

            console.log('✅ AdSense initialized successfully');
          }
        } catch (error) {
          console.warn('❌ AdSense initialization error:', error);
        }
      } else if (!window.adsbygoogle) {
        // إعادة المحاولة مرة واحدة فقط
        setTimeout(initAds, 500);
      }
    };

    // بدء التهيئة بعد تأخير قصير
    setTimeout(initAds, 100);
  }, [publisherId]);

  return null;
}
