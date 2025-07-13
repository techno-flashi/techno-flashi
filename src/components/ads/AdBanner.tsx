"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Ad } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { trackAdClick } from '@/lib/gtag';

interface AdBannerProps {
  placement: string;
  className?: string;
}

export default function AdBanner({ placement, className }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/ads?type=banner&placement=${placement}&is_active=true&limit=1`);
        if (response.ok) {
          const data = await response.json();
          if (data.ads && data.ads.length > 0) {
            setAd(data.ads[0]);
          } else {
            setAd(null);
          }
        } else {
          console.warn(`Failed to fetch ad for placement ${placement}:`, response.status);
          setAd(null);
        }
      } catch (error) {
        console.warn(`Error fetching ad for placement ${placement}:`, error);
        setAd(null);
      }
      setLoading(false);
    };

    fetchAd();
  }, [placement]);

  const handleAdClick = async () => {
    if (!ad) return;
    try {
      // تسجيل النقرة في قاعدة البيانات
      await fetch(`/api/ads/${ad.id}/click`, { method: 'POST' });

      // تسجيل النقرة في Google Analytics
      trackAdClick(ad.title, placement);
    } catch (error) {
      console.error('Failed to track ad click:', error);
    }
  };

  if (loading) {
    return <div className={`w-full h-24 bg-dark-card animate-pulse rounded-lg my-8 ${className || ''}`}></div>;
  }

  // **الحل هنا:** نتأكد من وجود الإعلان ورابط الصورة قبل عرضها
  if (!ad || !ad.image_url) {
    return null;
  }

  return (
    <div className={`my-8 ${className || ''}`}>
      <Link href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer" onClick={handleAdClick}>
        <div className="relative w-full h-auto aspect-[8/1] bg-dark-card rounded-lg overflow-hidden">
          <Image
            src={ad.image_url} // الآن هذه القيمة مضمونة ولن تكون فارغة
            alt={ad.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </Link>
    </div>
  );
}
