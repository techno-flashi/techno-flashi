"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Ad } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

// 1. تعريف الخصائص التي سيستقبلها المكون
interface AdBannerProps {
  placement: string; // اسم المكان الذي سيعرض فيه الإعلان
}

export default function AdBanner({ placement }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      // 2. جلب إعلان نشط ومناسب لهذا المكان المحدد
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('placement', placement)
        .eq('status', 'active')
        .limit(1)
        .single();

      if (error) {
        console.error(`Error fetching ad for placement ${placement}:`, error.message);
        setAd(null);
      } else {
        setAd(data);
      }
      setLoading(false);
    };

    fetchAd();
  }, [placement]);

  // دالة لتتبع النقرات
  const handleAdClick = async () => {
    if (!ad) return;
    try {
      // نفترض أن لديك API route لتتبع النقرات
      await fetch(`/api/ads/${ad.id}/click`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to track ad click:', error);
    }
  };

  if (loading) {
    // عرض شكل مؤقت أثناء التحميل
    return <div className="w-full h-24 bg-dark-card animate-pulse rounded-lg my-8"></div>;
  }

  if (!ad) {
    return null; // لا تعرض شيئًا إذا لم يتم العثور على إعلان
  }

  return (
    <div className="my-8">
      <Link href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer" onClick={handleAdClick}>
        <div className="relative w-full h-auto aspect-[8/1] bg-dark-card rounded-lg overflow-hidden">
          <Image
            src={ad.image_url}
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
