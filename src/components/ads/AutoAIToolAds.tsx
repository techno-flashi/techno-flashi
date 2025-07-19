'use client';

import { SmartAIToolAd } from './SmartAdManager';
import { useEffect, useRef, useState } from 'react';

interface AutoAIToolAdsProps {
  position: 'article-body-start' | 'article-body-mid' | 'article-body-end';
  toolName: string;
  toolSlug: string;
  toolCategory: string;
  className?: string;
}

/**
 * مكون الإعلانات التلقائية لصفحات أدوات الذكاء الاصطناعي
 * يستخدم Intersection Observer للتحميل الذكي وتحسين الأداء
 */
export default function AutoAIToolAds({
  position,
  toolName,
  toolSlug,
  toolCategory,
  className = ''
}: AutoAIToolAdsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={adRef} className={className}>
      {isVisible ? (
        <SmartAIToolAd
          position={position}
          className="w-full"
          keywords={[toolName, toolCategory, 'ذكاء اصطناعي', 'أدوات']}
          toolSlug={toolSlug}
        />
      ) : null}
    </div>
  );
}

// مكونات جاهزة للاستخدام في مواضع مختلفة

// إعلان بداية صفحة الأداة - تم إزالة المساحة الفارغة
export function AutoAIToolStartAd({
  toolName,
  toolSlug,
  toolCategory,
  className = ''
}: {
  toolName: string;
  toolSlug: string;
  toolCategory: string;
  className?: string;
}) {
  return (
    <AutoAIToolAds
      position="article-body-start"
      toolName={toolName}
      toolSlug={toolSlug}
      toolCategory={toolCategory}
      className={className}
    />
  );
}

// إعلان وسط صفحة الأداة - تم إزالة المساحة الفارغة
export function AutoAIToolMidAd({
  toolName,
  toolSlug,
  toolCategory,
  className = ''
}: {
  toolName: string;
  toolSlug: string;
  toolCategory: string;
  className?: string;
}) {
  return (
    <AutoAIToolAds
      position="article-body-mid"
      toolName={toolName}
      toolSlug={toolSlug}
      toolCategory={toolCategory}
      className={className}
    />
  );
}

// إعلان نهاية صفحة الأداة - تم إزالة المساحة الفارغة
export function AutoAIToolEndAd({
  toolName,
  toolSlug,
  toolCategory,
  className = ''
}: {
  toolName: string;
  toolSlug: string;
  toolCategory: string;
  className?: string;
}) {
  return (
    <AutoAIToolAds
      position="article-body-end"
      toolName={toolName}
      toolSlug={toolSlug}
      toolCategory={toolCategory}
      className={className}
    />
  );
}
