'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Ad } from '@/types';

interface SidebarAdProps {
  placement?: string;
  className?: string;
  maxAds?: number;
}

export default function SidebarAd({ 
  placement = "sidebar", 
  className = "",
  maxAds = 3
}: SidebarAdProps) {
  const [sidebarAds, setSidebarAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSidebarAds();
  }, [placement, maxAds]);

  const fetchSidebarAds = async () => {
    try {
      const response = await fetch(`/api/ads?type=sidebar&placement=${placement}&status=active&is_active=true&limit=${maxAds}`);
      if (response.ok) {
        const data = await response.json();
        setSidebarAds(data.ads || []);
      } else {
        console.error('Failed to fetch sidebar ads:', response.status);
      }
    } catch (error) {
      console.error('Error fetching sidebar ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (ad: Ad) => {
    // تسجيل النقرة
    try {
      await fetch(`/api/ads/${ad.id}/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to record click:', error);
    }

    // فتح الرابط
    if (ad.link_url) {
      if (ad.target_blank) {
        window.open(ad.link_url, '_blank');
      } else {
        window.location.href = ad.link_url;
      }
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center text-sm text-gray-500 mb-4">الإعلانات</div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (sidebarAds.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center text-sm text-gray-500 mb-4 font-medium">
        الإعلانات
      </div>

      {sidebarAds
        .sort((a, b) => a.priority - b.priority)
        .map((ad, index) => (
        <div
          key={ad.id}
          className="group cursor-pointer"
          onClick={() => handleAdClick(ad)}
          title={ad.description || ad.title}
        >
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary/30">
            {/* إعلان بالصورة */}
            {ad.image_url ? (
              <div className="relative">
                <Image
                  src={ad.image_url}
                  alt={ad.title}
                  width={ad.width || 300}
                  height={ad.height || 200}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ) : null}

            {/* محتوى الإعلان */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                {ad.title}
              </h4>
              
              {ad.description && (
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {ad.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                {ad.sponsor_name && (
                  <span className="text-xs text-gray-500">
                    {ad.sponsor_name}
                  </span>
                )}
                
                <div className="flex items-center text-primary text-xs font-medium">
                  <span>المزيد</span>
                  <svg className="w-3 h-3 mr-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* كود HTML/JavaScript مخصص */}
            {ad.ad_code && (
              <div className="p-4 border-t border-gray-100">
                <div
                  dangerouslySetInnerHTML={{ __html: ad.ad_code }}
                />
              </div>
            )}
          </div>

          {/* تسمية الإعلان */}
          <div className="text-center mt-1">
            <span className="text-xs text-gray-400">
              إعلان
            </span>
          </div>
        </div>
      ))}

      {/* إعلان نصي إضافي */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
        <div className="text-center">
          <div className="text-primary text-sm font-semibold mb-2">
            📢 هل تريد الإعلان هنا؟
          </div>
          <p className="text-gray-600 text-xs mb-3">
            احصل على مساحة إعلانية مميزة لعرض منتجاتك وخدماتك
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white text-xs px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            تواصل معنا
          </a>
        </div>
      </div>
    </div>
  );
}
