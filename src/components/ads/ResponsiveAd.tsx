'use client';

import { useState, useEffect } from 'react';
import { ClientOnlyContent } from '@/components/HydrationSafeWrapper';
import AdItem from './AdItem';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'html' | 'banner' | 'adsense';
  position: string;
  is_active: boolean;
  target_url?: string;
  image_url?: string;
  video_url?: string;
  custom_css?: string;
  custom_js?: string;
  view_count?: number;
  click_count?: number;
}

interface ResponsiveAdProps {
  ad: Advertisement;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

/**
 * مكون إعلان متجاوب يتكيف مع أحجام الشاشات المختلفة
 */
export default function ResponsiveAd({
  ad,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = ''
}: ResponsiveAdProps) {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    // فحص حجم الشاشة عند التحميل
    checkScreenSize();

    // إضافة مستمع لتغيير حجم الشاشة
    window.addEventListener('resize', checkScreenSize);

    // Intersection Observer لتحميل الإعلان عند الحاجة
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px' // تحميل الإعلان قبل 100px من ظهوره
      }
    );

    const adElement = document.getElementById(`responsive-ad-${ad.id}`);
    if (adElement) {
      observer.observe(adElement);
    }

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      observer.disconnect();
    };
  }, [ad.id]);

  // تحديد الكلاسات حسب حجم الشاشة
  const getResponsiveClassName = () => {
    const baseClass = className;
    
    switch (screenSize) {
      case 'mobile':
        return `${baseClass} ${mobileClassName} responsive-ad-mobile`;
      case 'tablet':
        return `${baseClass} ${tabletClassName} responsive-ad-tablet`;
      case 'desktop':
        return `${baseClass} ${desktopClassName} responsive-ad-desktop`;
      default:
        return baseClass;
    }
  };

  // تحديد ما إذا كان يجب إخفاء الإعلان على الموبايل
  const shouldHideOnMobile = () => {
    return screenSize === 'mobile' && ad.type === 'video' && !ad.image_url;
  };

  // تحديد حجم الإعلان حسب النوع والشاشة
  const getAdSize = () => {
    if (screenSize === 'mobile') {
      switch (ad.type) {
        case 'banner':
          return { width: '100%', minHeight: '80px', maxHeight: '120px' };
        case 'video':
          return { width: '100%', minHeight: '200px', maxHeight: '250px' };
        case 'image':
          return { width: '100%', minHeight: '150px', maxHeight: '200px' };
        default:
          return { width: '100%', minHeight: '100px' };
      }
    } else if (screenSize === 'tablet') {
      switch (ad.type) {
        case 'banner':
          return { width: '100%', minHeight: '100px', maxHeight: '150px' };
        case 'video':
          return { width: '100%', minHeight: '250px', maxHeight: '300px' };
        case 'image':
          return { width: '100%', minHeight: '200px', maxHeight: '250px' };
        default:
          return { width: '100%', minHeight: '120px' };
      }
    } else {
      // Desktop
      switch (ad.type) {
        case 'banner':
          return { width: '100%', minHeight: '120px', maxHeight: '200px' };
        case 'video':
          return { width: '100%', minHeight: '300px', maxHeight: '400px' };
        case 'image':
          return { width: '100%', minHeight: '250px', maxHeight: '350px' };
        default:
          return { width: '100%', minHeight: '150px' };
      }
    }
  };

  if (shouldHideOnMobile()) {
    return null;
  }

  return (
    <ClientOnlyContent>
      <div
        id={`responsive-ad-${ad.id}`}
        className={`responsive-ad-container ${getResponsiveClassName()}`}
        style={{
          ...getAdSize(),
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
      >
        {isVisible ? (
          <AdItem
            ad={ad}
            className="w-full h-full"
          />
        ) : (
          <div 
            className="w-full h-full bg-gray-800 rounded-lg animate-pulse flex items-center justify-center"
            style={getAdSize()}
          >
            <div className="text-center text-gray-400 text-sm">
              <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div>جاري تحميل الإعلان...</div>
            </div>
          </div>
        )}

        {/* مؤشر نوع الجهاز (للتطوير فقط) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {screenSize}
          </div>
        )}
      </div>
    </ClientOnlyContent>
  );
}

/**
 * مكونات إعلانات متجاوبة جاهزة للاستخدام
 */

// إعلان هيدر متجاوب
export function ResponsiveHeaderAd({ ad }: { ad: Advertisement }) {
  return (
    <ResponsiveAd
      ad={ad}
      className="mb-4"
      mobileClassName="mx-2"
      tabletClassName="mx-4"
      desktopClassName="mx-auto max-w-4xl"
    />
  );
}

// إعلان شريط جانبي متجاوب
export function ResponsiveSidebarAd({ ad }: { ad: Advertisement }) {
  return (
    <ResponsiveAd
      ad={ad}
      className="mb-6"
      mobileClassName="hidden" // إخفاء على الموبايل
      tabletClassName="w-full"
      desktopClassName="w-full max-w-sm"
    />
  );
}

// إعلان داخل المحتوى متجاوب
export function ResponsiveInContentAd({ ad }: { ad: Advertisement }) {
  return (
    <ResponsiveAd
      ad={ad}
      className="my-6"
      mobileClassName="mx-2 text-sm"
      tabletClassName="mx-4"
      desktopClassName="mx-auto max-w-2xl"
    />
  );
}

// إعلان فوتر متجاوب
export function ResponsiveFooterAd({ ad }: { ad: Advertisement }) {
  return (
    <ResponsiveAd
      ad={ad}
      className="mt-8"
      mobileClassName="mx-2"
      tabletClassName="mx-4"
      desktopClassName="mx-auto max-w-4xl"
    />
  );
}

// إعلان بانر متجاوب للموبايل
export function MobileBannerAd({ ad }: { ad: Advertisement }) {
  return (
    <div className="block md:hidden">
      <ResponsiveAd
        ad={ad}
        className="sticky bottom-0 z-50 bg-dark-background border-t border-gray-700"
        mobileClassName="p-2"
      />
    </div>
  );
}

// إعلان بانر للديسكتوب فقط
export function DesktopBannerAd({ ad }: { ad: Advertisement }) {
  return (
    <div className="hidden md:block">
      <ResponsiveAd
        ad={ad}
        className="w-full"
        desktopClassName="max-w-6xl mx-auto"
      />
    </div>
  );
}
