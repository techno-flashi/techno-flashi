// مكون عرض الإعلانات
'use client';

import { Ad } from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AdBannerProps {
  placement: Ad['placement'];
  className?: string;
}

export function AdBanner({ placement, className = "" }: AdBannerProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, [placement]);

  const fetchAds = async () => {
    try {
      console.log(`Fetching ads for placement: ${placement}`);
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('placement', placement)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Error fetching ads for ${placement}:`, error);
        return;
      }

      console.log(`Ads found for ${placement}:`, data?.length || 0, data);
      setAds(data || []);
    } catch (error) {
      console.error(`Exception fetching ads for ${placement}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (ad: Ad) => {
    // تسجيل النقرة
    try {
      await supabase
        .from('ads')
        .update({ click_count: ad.click_count + 1 })
        .eq('id', ad.id);

      // فتح الرابط
      if (ad.link_url) {
        window.open(ad.link_url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  };

  const trackImpression = async (ad: Ad) => {
    try {
      await supabase
        .from('ads')
        .update({ impression_count: ad.impression_count + 1 })
        .eq('id', ad.id);
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  useEffect(() => {
    if (ads.length > 0) {
      const currentAd = ads[currentAdIndex];
      trackImpression(currentAd);

      // تدوير الإعلانات كل 10 ثوان
      if (ads.length > 1) {
        const interval = setInterval(() => {
          setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        }, 10000);

        return () => clearInterval(interval);
      }
    }
  }, [ads, currentAdIndex]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`}>
        <div className="h-20 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (ads.length === 0) {
    // عرض إعلان تجريبي إذا لم توجد إعلانات
    return (
      <div className={`bg-gradient-to-r from-primary/20 to-blue-600/20 border border-primary/30 rounded-lg p-4 text-center ${className}`}>
        <p className="text-primary text-sm">
          مساحة إعلانية متاحة - {placement}
        </p>
      </div>
    );
  }

  const currentAd = ads[currentAdIndex];

  // إذا كان الإعلان يحتوي على كود HTML مخصص
  if (currentAd.ad_code) {
    return (
      <div 
        className={`ad-banner ${className}`}
        dangerouslySetInnerHTML={{ __html: currentAd.ad_code }}
      />
    );
  }

  // إعلان عادي بصورة ونص
  return (
    <div className={`ad-banner ${className}`}>
      <div 
        className="bg-dark-card rounded-lg border border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
        onClick={() => handleAdClick(currentAd)}
      >
        {currentAd.image_url && (
          <div className="relative w-full h-32">
            <Image
              src={currentAd.image_url}
              alt={currentAd.title}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
            {currentAd.title}
          </h3>
          
          {currentAd.description && (
            <p className="text-xs text-dark-text-secondary line-clamp-3 mb-3">
              {currentAd.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary font-medium">
              إعلان مدفوع
            </span>
            
            {ads.length > 1 && (
              <div className="flex space-x-1 space-x-reverse">
                {ads.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentAdIndex ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* معلومات الإحصائيات للمطورين فقط */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          النقرات: {currentAd.click_count} | المشاهدات: {currentAd.impression_count}
        </div>
      )}
    </div>
  );
}
