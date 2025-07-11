'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Ad } from '@/types';

interface AdBannerTopProps {
  placement?: string;
  className?: string;
}

export default function AdBannerTop({ 
  placement = "homepage-top", 
  className = "" 
}: AdBannerTopProps) {
  const [bannerAd, setBannerAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannerAd();
  }, [placement]);

  const fetchBannerAd = async () => {
    try {
      const response = await fetch(`/api/ads?type=banner&placement=${placement}&status=active&is_active=true&limit=1`);
      if (response.ok) {
        const data = await response.json();
        if (data.ads && data.ads.length > 0) {
          setBannerAd(data.ads[0]);
        }
      } else {
        console.error('Failed to fetch banner ad:', response.status);
      }
    } catch (error) {
      console.error('Error fetching banner ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async () => {
    if (!bannerAd) return;

    // تسجيل النقرة
    try {
      await fetch(`/api/ads/${bannerAd.id}/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to record click:', error);
    }

    // فتح الرابط
    if (bannerAd.link_url) {
      if (bannerAd.target_blank) {
        window.open(bannerAd.link_url, '_blank');
      } else {
        window.location.href = bannerAd.link_url;
      }
    }
  };

  if (loading) {
    return (
      <div className={`w-full bg-gray-100 animate-pulse ${className}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="h-24 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!bannerAd) {
    return null;
  }

  return (
    <div className={`w-full bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20 ${className}`}>
      <div className="container mx-auto px-4 py-6">
        <div 
          className="relative group cursor-pointer"
          onClick={handleAdClick}
          title={bannerAd.description || bannerAd.title}
        >
          {/* إعلان بالصورة */}
          {bannerAd.image_url ? (
            <div className="flex items-center justify-center">
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Image
                  src={bannerAd.image_url}
                  alt={bannerAd.title}
                  width={bannerAd.width || 728}
                  height={bannerAd.height || 90}
                  className="object-contain max-w-full h-auto"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                  }}
                />
                
                {/* تأثير hover */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </div>
            </div>
          ) : (
            /* إعلان نصي */
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-2 border-primary/20">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {bannerAd.title}
              </h3>
              {bannerAd.description && (
                <p className="text-gray-600 mb-4">
                  {bannerAd.description}
                </p>
              )}
              <div className="inline-flex items-center text-primary font-semibold">
                <span>اضغط للمزيد</span>
                <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* كود HTML/JavaScript مخصص */}
          {bannerAd.ad_code && (
            <div className="w-full">
              <div
                dangerouslySetInnerHTML={{ __html: bannerAd.ad_code }}
                onError={(e) => {
                  console.warn('Banner ad code execution error:', e);
                }}
              />
            </div>
          )}

          {/* معلومات الإعلان (مخفية) */}
          <div className="sr-only">
            <span>إعلان: {bannerAd.title}</span>
            {bannerAd.sponsor_name && (
              <span> - برعاية {bannerAd.sponsor_name}</span>
            )}
          </div>
        </div>

        {/* تسمية الإعلان */}
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            إعلان
          </span>
        </div>
      </div>
    </div>
  );
}
