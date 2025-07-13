'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import AdSenseAd from './AdSenseAd';
import CustomAd from './CustomAd';
import SafeHTMLAd from './SafeHTMLAd';

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

interface AdItemProps {
  ad: Advertisement;
  className?: string;
}

/**
 * مكون عرض إعلان واحد مع تتبع المشاهدات والنقرات
 */
export default function AdItem({ ad, className = '' }: AdItemProps) {
  // تسجيل المشاهدة عند تحميل الإعلان
  useEffect(() => {
    const recordImpression = async () => {
      try {
        // استخدام SQL مباشر لزيادة العدد
        const { error } = await supabase
          .from('advertisements')
          .update({
            view_count: (ad.view_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', ad.id);

        if (error) {
          console.error('Error recording impression:', error);
        }
      } catch (error) {
        console.error('Error recording impression:', error);
      }
    };

    recordImpression();
  }, [ad.id, ad.view_count]);

  // تسجيل النقرة
  const handleClick = async () => {
    try {
      // استخدام SQL مباشر لزيادة العدد
      const { error } = await supabase
        .from('advertisements')
        .update({
          click_count: (ad.click_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', ad.id);

      if (error) {
        console.error('Error recording click:', error);
      }

      // فتح الرابط إذا كان موجوداً
      if (ad.target_url) {
        window.open(ad.target_url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error recording click:', error);
    }
  };

  // إعلان AdSense
  if (ad.type === 'adsense' && ad.content) {
    return (
      <AdSenseAd
        adSlot={ad.content}
        className={className}
        responsive={true}
      />
    );
  }

  // إعلان HTML مخصص
  if (ad.type === 'html' && ad.content) {
    return (
      <SafeHTMLAd
        id={ad.id}
        htmlContent={ad.content}
        cssStyles={ad.custom_css}
        jsCode={ad.custom_js}
        className={className}
        onClick={handleClick}
        linkUrl={ad.target_url}
        targetBlank={true}
      />
    );
  }

  // إعلان صورة
  if (ad.type === 'image' && ad.image_url) {
    return (
      <CustomAd
        id={ad.id}
        type="card"
        title={ad.title}
        description={ad.content}
        imageUrl={ad.image_url}
        linkUrl={ad.target_url}
        className={className}
        onClick={handleClick}
        targetBlank={true}
        animation="fade"
      />
    );
  }

  // إعلان بانر
  if (ad.type === 'banner') {
    return (
      <CustomAd
        id={ad.id}
        type="banner"
        title={ad.title}
        description={ad.content}
        imageUrl={ad.image_url}
        linkUrl={ad.target_url}
        className={className}
        onClick={handleClick}
        targetBlank={true}
        animation="slide"
      />
    );
  }

  // إعلان نصي
  if (ad.type === 'text') {
    return (
      <div className={`bg-dark-card rounded-xl p-4 border border-gray-700 ${className}`}>
        <div 
          className="cursor-pointer"
          onClick={handleClick}
        >
          <h3 className="font-bold text-white text-lg mb-2">{ad.title}</h3>
          <p className="text-gray-300 text-sm mb-3">{ad.content}</p>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              إعلان
            </span>
            {ad.target_url && (
              <span className="text-primary text-sm font-medium">
                اعرف المزيد ←
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // إعلان فيديو
  if (ad.type === 'video' && ad.video_url) {
    return (
      <div className={`bg-dark-card rounded-xl overflow-hidden border border-gray-700 ${className}`}>
        <div 
          className="cursor-pointer"
          onClick={handleClick}
        >
          <div className="relative">
            <video 
              src={ad.video_url}
              poster={ad.image_url}
              controls
              className="w-full h-48 object-cover"
            />
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-white text-lg mb-2">{ad.title}</h3>
            <p className="text-gray-300 text-sm mb-3">{ad.content}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                إعلان فيديو
              </span>
              {ad.target_url && (
                <span className="text-primary text-sm font-medium">
                  مشاهدة المزيد ←
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // fallback للأنواع غير المدعومة
  return (
    <div className={`bg-gray-800 rounded-xl p-4 border border-gray-700 ${className}`}>
      <div className="text-center text-gray-400">
        <div className="mb-2">⚠️</div>
        <div className="text-sm">نوع إعلان غير مدعوم: {ad.type}</div>
      </div>
    </div>
  );
}
