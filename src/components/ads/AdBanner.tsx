"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Ad } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

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
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('placement', placement)
        .eq('status', 'active')
        .limit(1)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // لا تطبع الخطأ إذا كان السبب هو عدم العثور على إعلان
            console.error(`Error fetching ad for placement ${placement}:`, error.message);
        }
        setAd(null);
      } else {
        setAd(data);
      }
      setLoading(false);
    };

    fetchAd();
  }, [placement]);

  const handleAdClick = async () => {
    if (!ad) return;
    try {
      await fetch(`/api/ads/${ad.id}/click`, { method: 'POST' });
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
