'use client';

import { useEffect, useRef } from 'react';
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

interface SEOFriendlyAdProps {
  ad: Advertisement;
  className?: string;
  lazy?: boolean;
  priority?: 'high' | 'normal' | 'low';
}

/**
 * مكون إعلان محسن لـ SEO ومتوافق مع معايير الويب
 */
export default function SEOFriendlyAd({
  ad,
  className = '',
  lazy = true,
  priority = 'normal'
}: SEOFriendlyAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const adElement = adRef.current;

    // إضافة البيانات المنظمة للإعلان
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Advertisement",
      "name": ad.title,
      "description": ad.content,
      "url": ad.target_url,
      "image": ad.image_url,
      "advertiser": {
        "@type": "Organization",
        "name": "TechnoFlash"
      }
    };

    // إضافة script للبيانات المنظمة
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    script.id = `ad-structured-data-${ad.id}`;
    
    // التحقق من عدم وجود script مكرر
    const existingScript = document.getElementById(`ad-structured-data-${ad.id}`);
    if (!existingScript) {
      document.head.appendChild(script);
    }

    // إضافة خصائص SEO للعنصر
    adElement.setAttribute('data-ad-id', ad.id);
    adElement.setAttribute('data-ad-type', ad.type);
    adElement.setAttribute('role', 'complementary');
    adElement.setAttribute('aria-label', `إعلان: ${ad.title}`);

    // إضافة rel="sponsored" للروابط
    const links = adElement.querySelectorAll('a');
    links.forEach(link => {
      if (!link.getAttribute('rel')) {
        link.setAttribute('rel', 'sponsored noopener noreferrer');
      }
      link.setAttribute('target', '_blank');
    });

    // تحسين الأداء - lazy loading
    if (lazy && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('ad-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );

      observer.observe(adElement);

      return () => {
        observer.disconnect();
        // إزالة البيانات المنظمة عند إلغاء التحميل
        const scriptToRemove = document.getElementById(`ad-structured-data-${ad.id}`);
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }

    return () => {
      // تنظيف البيانات المنظمة
      const scriptToRemove = document.getElementById(`ad-structured-data-${ad.id}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [ad, lazy]);

  // تحديد أولوية التحميل
  const getPriorityClass = () => {
    switch (priority) {
      case 'high':
        return 'ad-priority-high';
      case 'low':
        return 'ad-priority-low';
      default:
        return 'ad-priority-normal';
    }
  };

  return (
    <div
      ref={adRef}
      className={`seo-friendly-ad ${getPriorityClass()} ${className}`}
      style={{
        // تحسين Core Web Vitals
        containIntrinsicSize: '300px 250px',
        contentVisibility: lazy ? 'auto' : 'visible'
      }}
    >
      {/* عنوان الإعلان للـ SEO */}
      <div className="sr-only">
        <h3>إعلان: {ad.title}</h3>
        <p>محتوى إعلاني مدفوع</p>
      </div>

      {/* الإعلان الفعلي */}
      <AdItem ad={ad} className="w-full" />

      {/* علامة الإعلان المرئية */}
      <div className="ad-label text-xs text-gray-500 text-center mt-2">
        <span className="bg-gray-800 px-2 py-1 rounded border border-gray-600">
          إعلان مدفوع
        </span>
      </div>

      {/* CSS محسن للأداء */}
      <style jsx>{`
        .seo-friendly-ad {
          position: relative;
          isolation: isolate;
          transition: opacity 0.3s ease;
        }

        .seo-friendly-ad:not(.ad-visible) {
          opacity: 0.7;
        }

        .seo-friendly-ad.ad-visible {
          opacity: 1;
        }

        .ad-priority-high {
          will-change: transform;
        }

        .ad-priority-low {
          will-change: auto;
        }

        .ad-label {
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* تحسين الأداء للموبايل */
        @media (max-width: 768px) {
          .seo-friendly-ad {
            contain: layout style paint;
          }
        }

        /* تحسين الطباعة */
        @media print {
          .seo-friendly-ad {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * مكونات SEO محسنة للمواضع المختلفة
 */

// إعلان هيدر محسن لـ SEO
export function SEOHeaderAd({ ad }: { ad: Advertisement }) {
  return (
    <SEOFriendlyAd
      ad={ad}
      className="mb-6"
      lazy={false} // تحميل فوري للهيدر
      priority="high"
    />
  );
}

// إعلان محتوى محسن لـ SEO
export function SEOContentAd({ ad }: { ad: Advertisement }) {
  return (
    <SEOFriendlyAd
      ad={ad}
      className="my-8"
      lazy={true}
      priority="normal"
    />
  );
}

// إعلان شريط جانبي محسن لـ SEO
export function SEOSidebarAd({ ad }: { ad: Advertisement }) {
  return (
    <SEOFriendlyAd
      ad={ad}
      className="mb-6"
      lazy={true}
      priority="low"
    />
  );
}

// إعلان فوتر محسن لـ SEO
export function SEOFooterAd({ ad }: { ad: Advertisement }) {
  return (
    <SEOFriendlyAd
      ad={ad}
      className="mt-8"
      lazy={true}
      priority="low"
    />
  );
}

/**
 * مكون حاوية الإعلانات مع تحسينات SEO
 */
export function SEOAdContainer({ 
  children, 
  title = "إعلانات",
  className = ""
}: { 
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <section 
      className={`ad-container ${className}`}
      role="complementary"
      aria-label={title}
    >
      <div className="sr-only">
        <h2>{title}</h2>
        <p>هذا القسم يحتوي على إعلانات مدفوعة</p>
      </div>
      
      {children}

      {/* البيانات المنظمة للحاوية */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPageElement",
            "name": title,
            "description": "قسم الإعلانات المدفوعة",
            "isPartOf": {
              "@type": "WebPage",
              "url": typeof window !== 'undefined' ? window.location.href : ''
            }
          })
        }}
      />
    </section>
  );
}
