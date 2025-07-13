'use client';

import { SmartAIToolAd } from './SmartAdManager';

interface AutoAIToolAdsProps {
  position: 'article-body-start' | 'article-body-mid' | 'article-body-end';
  toolName: string;
  toolSlug: string;
  toolCategory: string;
  className?: string;
}

/**
 * مكون الإعلانات التلقائية لصفحات أدوات الذكاء الاصطناعي
 * يستخدم SmartAdManager للبحث عن الإعلانات المناسبة
 */
export default function AutoAIToolAds({
  position,
  toolName,
  toolSlug,
  toolCategory,
  className = ''
}: AutoAIToolAdsProps) {
  // استخدم SmartAIToolAd مباشرة - سيتولى البحث عن الإعلانات المناسبة
  return (
    <SmartAIToolAd
      position={position}
      className={className}
      keywords={[toolName, toolCategory, 'ذكاء اصطناعي', 'أدوات']}
      toolSlug={toolSlug}
    />
  );
}

// مكونات جاهزة للاستخدام في مواضع مختلفة

// إعلان بداية صفحة الأداة
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

// إعلان وسط صفحة الأداة
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

// إعلان نهاية صفحة الأداة
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
