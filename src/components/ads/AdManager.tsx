'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdSenseAd, { InArticleAd, SidebarAd, BannerAd, MobileAd, DesktopAd } from './AdSenseAd';
import CustomAd from './CustomAd';
import AdItem from './AdItem';
import { ClientOnlyContent } from '@/components/HydrationSafeWrapper';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'html' | 'banner' | 'adsense';
  position: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  click_count?: number;
  view_count?: number;
  target_url?: string;
  image_url?: string;
  video_url?: string;
  custom_css?: string;
  custom_js?: string;
  priority?: number;
  max_views?: number;
  max_clicks?: number;
  created_at: string;
  updated_at: string;
}

interface AdManagerProps {
  placement: string;
  className?: string;
  maxAds?: number;
  fallbackAdSenseSlot?: string;
  showFallback?: boolean;
}

/**
 * مدير الإعلانات الذكي - يعرض الإعلانات حسب الموضع والأولوية
 */
export default function AdManager({
  placement,
  className = '',
  maxAds = 1,
  fallbackAdSenseSlot,
  showFallback = true
}: AdManagerProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // تحديد نوع الجهاز
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // تحميل الإعلانات
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('position', placement)
          .eq('is_active', true)
          .eq('is_paused', false)
          .order('priority', { ascending: false })
          .limit(maxAds);

        if (error) {
          console.error('Error fetching ads:', error);
          return;
        }

        // تصفية الإعلانات حسب التاريخ والجهاز
        const filteredAds = (data || []).filter(ad => {
          const now = new Date();
          
          // فحص التاريخ
          if (ad.start_date && new Date(ad.start_date) > now) return false;
          if (ad.end_date && new Date(ad.end_date) < now) return false;
          
          // فحص عدد المشاهدات
          if (ad.max_views && ad.view_count &&
              ad.view_count >= ad.max_views) return false;

          // فحص عدد النقرات
          if (ad.max_clicks && ad.click_count &&
              ad.click_count >= ad.max_clicks) return false;
          
          return true;
        });

        setAds(filteredAds);
      } catch (error) {
        console.error('Error in fetchAds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [placement, maxAds, isMobile]);



  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`} style={{ minHeight: '100px' }}>
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          جاري تحميل الإعلانات...
        </div>
      </div>
    );
  }

  // عرض الإعلانات المحملة
  if (ads.length > 0) {
    return (
      <div className={`ad-container ${className}`}>
        {ads.map((ad) => (
          <AdItem
            key={ad.id}
            ad={ad}
            className="mb-4"
          />
        ))}
      </div>
    );
  }

  // لا نعرض إعلانات احتياطية - نترك المساحة فارغة (لا AdSense افتراضي)
  return null;
}

/**
 * مكونات إعلانات جاهزة لمواضع مختلفة
 */

// إعلان الهيدر
export function HeaderAd({ className = 'mb-4' }: { className?: string }) {
  return (
    <AdManager
      placement="header"
      className={className}
      fallbackAdSenseSlot="1234567890"
      showFallback={true}
    />
  );
}

// إعلان الفوتر
export function FooterAd({ className = 'mt-4' }: { className?: string }) {
  return (
    <AdManager
      placement="footer"
      className={className}
      fallbackAdSenseSlot="1234567891"
      showFallback={true}
    />
  );
}

// إعلان الشريط الجانبي
export function SidebarAdManager({ className = 'mb-6' }: { className?: string }) {
  return (
    <AdManager
      placement="sidebar-right"
      className={className}
      maxAds={3}
      fallbackAdSenseSlot="1234567892"
      showFallback={true}
    />
  );
}

// إعلان بداية المقال
export function ArticleStartAd({ className = 'my-6' }: { className?: string }) {
  return (
    <AdManager
      placement="article-body-start"
      className={className}
      fallbackAdSenseSlot="1234567893"
      showFallback={true}
    />
  );
}

// إعلان وسط المقال
export function ArticleMiddleAd({ className = 'my-8' }: { className?: string }) {
  return (
    <AdManager
      placement="article-body-mid"
      className={className}
      fallbackAdSenseSlot="1234567894"
      showFallback={true}
    />
  );
}

// إعلان نهاية المقال
export function ArticleEndAd({ className = 'my-6' }: { className?: string }) {
  return (
    <AdManager
      placement="article-body-end"
      className={className}
      fallbackAdSenseSlot="1234567895"
      showFallback={true}
    />
  );
}

// إعلان داخل المحتوى
export function InContentAd({ className = 'my-6' }: { className?: string }) {
  return (
    <AdManager
      placement="in-content"
      className={className}
      fallbackAdSenseSlot="1234567896"
      showFallback={true}
    />
  );
}
