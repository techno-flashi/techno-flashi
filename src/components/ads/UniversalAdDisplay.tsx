'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Ad {
  id: string;
  name: string;
  title?: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  html_content?: string;
  css_content?: string;
  javascript_content?: string;
  position: string;
  enabled: boolean;
  priority: number;
  ad_type: string;
  ad_format?: string;
}

interface UniversalAdDisplayProps {
  position: 'header' | 'in-content' | 'footer' | 'sidebar';
  className?: string;
  fallbackAd?: {
    title: string;
    description: string;
    image_url?: string;
    link_url: string;
  };
}

export default function UniversalAdDisplay({ 
  position, 
  className = '', 
  fallbackAd 
}: UniversalAdDisplayProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`/api/ads?placement=${position}&isActive=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch ads');
        }
        const data = await response.json();
        setAds(data.ads || []);
      } catch (err) {
        console.error('Error fetching ads:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [position]);

  const handleAdClick = (ad: Ad) => {
    // تسجيل النقرة
    fetch('/api/ads/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adId: ad.id,
        position: position,
        timestamp: new Date().toISOString(),
      }),
    }).catch(console.error);
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-24 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500 dark:text-gray-400 text-sm">جاري تحميل الإعلان...</span>
        </div>
      </div>
    );
  }

  if (error || ads.length === 0) {
    // عرض الإعلان الاحتياطي إذا كان متوفراً
    if (fallbackAd) {
      return (
        <div className={`my-4 ${className}`}>
          <Link
            href={fallbackAd.link_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 text-center hover:opacity-90 transition-opacity">
              <h3 className="text-lg font-bold mb-2">{fallbackAd.title}</h3>
              <p className="text-sm opacity-90">{fallbackAd.description}</p>
            </div>
          </Link>
        </div>
      );
    }
    return null;
  }

  // اختيار إعلان عشوائي من الإعلانات المتاحة (أو حسب الأولوية)
  const selectedAd = ads.sort((a, b) => b.priority - a.priority)[0];

  if (!selectedAd) return null;

  // إذا كان الإعلان يحتوي على HTML مخصص
  if (selectedAd.html_content) {
    return (
      <div className={`my-4 ${className}`}>
        <div 
          className="ad-container"
          dangerouslySetInnerHTML={{ __html: selectedAd.html_content }}
          onClick={() => handleAdClick(selectedAd)}
        />
        {selectedAd.css_content && (
          <style dangerouslySetInnerHTML={{ __html: selectedAd.css_content }} />
        )}
        {selectedAd.javascript_content && (
          <script dangerouslySetInnerHTML={{ __html: selectedAd.javascript_content }} />
        )}
      </div>
    );
  }

  // إعلان صورة عادي
  if (selectedAd.image_url) {
    return (
      <div className={`my-4 ${className}`}>
        <Link
          href={selectedAd.link_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleAdClick(selectedAd)}
        >
          <div className="relative w-full h-auto aspect-[8/1] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
            <Image
              src={selectedAd.image_url}
              alt={selectedAd.title || selectedAd.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        </Link>
      </div>
    );
  }

  // إعلان نصي
  return (
    <div className={`my-4 ${className}`}>
      <Link
        href={selectedAd.link_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleAdClick(selectedAd)}
        className="block"
      >
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 text-center hover:opacity-90 transition-opacity">
          {selectedAd.title && (
            <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
              {selectedAd.title}
            </h3>
          )}
          {selectedAd.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {selectedAd.description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
