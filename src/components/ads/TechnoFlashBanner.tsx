'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ClientOnlyContent } from '@/components/HydrationSafeWrapper';

interface TechnoFlashBannerProps {
  position: 'header' | 'footer' | 'content';
  className?: string;
}

/**
 * مكون الإعلان المتحرك الحصري من تكنوفلاش
 * يظهر في جميع أنحاء الموقع مع تأثيرات متحركة
 */
export default function TechnoFlashBanner({ position, className = '' }: TechnoFlashBannerProps) {
  const [bannerData, setBannerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanner();
  }, [position]);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      
      // تحديد الموضع المناسب
      let dbPosition = '';
      switch (position) {
        case 'header':
          dbPosition = 'header';
          break;
        case 'footer':
          dbPosition = 'footer';
          break;
        case 'content':
          dbPosition = 'article-body-mid';
          break;
        default:
          dbPosition = 'header';
      }

      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('position', dbPosition)
        .eq('is_active', true)
        .eq('is_paused', false)
        .order('priority', { ascending: true })
        .limit(1);

      if (error) {
        // تجاهل الأخطاء في بيئة التطوير لتجنب console spam
        if (process.env.NODE_ENV === 'development') {
          console.warn('TechnoFlash banner fetch failed (development mode)');
        }
        setBannerData(null);
        return;
      }

      // التحقق من وجود بيانات
      if (data && data.length > 0) {
        setBannerData(data[0]);
      } else {
        console.log('No TechnoFlash banner found for position:', dbPosition);
        // لا نعرض إعلان افتراضي - نترك الإعلان فارغ
        setBannerData(null);
        return;
      }

      // تسجيل مشاهدة
      if (data && data.length > 0) {
        try {
          await supabase
            .from('advertisements')
            .update({
              view_count: (data[0].view_count || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', data[0].id);
        } catch (viewError) {
          console.error('Error updating view count:', viewError);
          // لا نوقف العملية بسبب خطأ في تحديث العداد
        }
      }

    } catch (error) {
      // تجاهل الأخطاء في بيئة التطوير
      if (process.env.NODE_ENV === 'development') {
        console.warn('TechnoFlash banner error (development mode)');
      }
      setBannerData(null);
    } finally {
      setLoading(false);
    }
  };

  // تم حذف الإعلانات الافتراضية نهائياً
  const getDefaultBannerData = (position: string) => {
    return null; // لا نعرض أي إعلانات افتراضية
  };

  const handleClick = async () => {
    if (!bannerData) return;

    try {
      // تسجيل نقرة فقط للإعلانات الحقيقية (ليس الافتراضية)
      if (!bannerData.id.startsWith('default-')) {
        await supabase
          .from('advertisements')
          .update({
            click_count: (bannerData.click_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', bannerData.id);
      }

      // يمكن إضافة رابط هنا
      console.log('TechnoFlash banner clicked!', bannerData.id);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  // عرض فارغ أثناء التحميل
  if (loading || !bannerData) {
    return null;
  }

  return (
    <ClientOnlyContent>
      <div className={`techno-flash-banner-container ${className}`}>
        {/* CSS مخصص */}
        <style jsx>{`
          @keyframes slide-left {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }

          @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
            50% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6); }
          }

          .techno-flash-banner {
            width: 100%;
            background: linear-gradient(45deg, #111, #222, #111);
            background-size: 200% 200%;
            animation: gradientShift 3s ease infinite;
            color: #fff;
            padding: 12px 0;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .techno-flash-banner:hover {
            background: linear-gradient(45deg, #222, #333, #222);
            transform: scale(1.02);
          }

          .techno-flash-banner.header {
            border-bottom: 3px solid #FFD700;
            box-shadow: 0 3px 15px rgba(255, 215, 0, 0.4);
          }

          .techno-flash-banner.footer {
            border-top: 3px solid #FFD700;
            box-shadow: 0 -3px 15px rgba(255, 215, 0, 0.4);
          }

          .techno-flash-banner.content {
            border: 3px solid #FFD700;
            border-radius: 15px;
            margin: 20px 0;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          }

          .sliding-text {
            display: inline-block;
            white-space: nowrap;
            animation: slide-left 15s linear infinite, glow 2s ease-in-out infinite;
            font-size: 20px;
            font-weight: bold;
            color: #FFD700;
            font-family: 'Arial', sans-serif;
          }

          .techno-flash-banner:hover .sliding-text {
            animation-play-state: paused;
            color: #FFF700;
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* تجاوب مع الشاشات الصغيرة */
          @media (max-width: 768px) {
            .sliding-text {
              font-size: 18px;
              animation-duration: 12s;
            }
            
            .techno-flash-banner {
              padding: 10px 0;
            }
          }

          @media (max-width: 480px) {
            .sliding-text {
              font-size: 16px;
              animation-duration: 10s;
            }
            
            .techno-flash-banner {
              padding: 8px 0;
            }
          }

          /* تأثيرات إضافية */
          .techno-flash-banner::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: shine 3s infinite;
          }

          @keyframes shine {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}</style>

        {/* الإعلان المتحرك */}
        <div 
          className={`techno-flash-banner ${position}`}
          onClick={handleClick}
          dangerouslySetInnerHTML={{ __html: bannerData.content }}
        />

        {/* JavaScript مخصص */}
        {bannerData.custom_js && (
          <script
            dangerouslySetInnerHTML={{ __html: bannerData.custom_js }}
          />
        )}
      </div>
    </ClientOnlyContent>
  );
}

/**
 * مكونات جاهزة للاستخدام في مواضع مختلفة
 */

// إعلان الهيدر
export function TechnoFlashHeaderBanner({ className = '' }: { className?: string }) {
  return (
    <TechnoFlashBanner 
      position="header" 
      className={`header-banner ${className}`}
    />
  );
}

// إعلان الفوتر
export function TechnoFlashFooterBanner({ className = '' }: { className?: string }) {
  return (
    <TechnoFlashBanner
      position="footer"
      className={`footer-banner ${className}`}
    />
  );
}

// إعلان المحتوى
export function TechnoFlashContentBanner({ className = '' }: { className?: string }) {
  return (
    <TechnoFlashBanner
      position="content"
      className={`content-banner ${className}`}
    />
  );
}

// تم حذف مكون الإعلان الثابت نهائياً - لن تظهر أي إعلانات ثابتة
