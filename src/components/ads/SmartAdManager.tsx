'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdItem from './AdItem';
import { ClientOnlyContent } from '@/components/HydrationSafeWrapper';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: string;
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

interface SmartAdManagerProps {
  contentType: 'article' | 'ai-tool' | 'both';
  position: string;
  className?: string;
  maxAds?: number;
  keywords?: string[];
  fallbackAdSenseSlot?: string;
  showFallback?: boolean;
  toolSlug?: string; // إضافة slug الأداة للإعلانات المخصصة
}

/**
 * مدير إعلانات ذكي يربط بين المقالات وأدوات الذكاء الاصطناعي
 * يعرض إعلانات مشتركة ومتعلقة بالمحتوى
 */
export default function SmartAdManager({
  contentType,
  position,
  className = '',
  maxAds = 1,
  keywords = [],
  fallbackAdSenseSlot,
  showFallback = false,
  toolSlug
}: SmartAdManagerProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSmartAds();
  }, [contentType, position, keywords, toolSlug]);

  const fetchSmartAds = async () => {
    try {
      setLoading(true);
      setError(null);

      let finalAds: Advertisement[] = [];

      // إذا كان contentType هو ai-tool وتم تمرير toolSlug
      if (contentType === 'ai-tool' && toolSlug) {
        // أولاً: البحث عن إعلانات مخصصة لهذه الأداة
        const { data: customAds } = await supabase
          .from('advertisements')
          .select('*')
          .eq('position', position)
          .eq('target_ai_tool_slug', toolSlug)
          .eq('is_active', true)
          .eq('is_paused', false)
          .order('priority', { ascending: true })
          .limit(maxAds);

        if (customAds && customAds.length > 0) {
          finalAds = customAds;
        } else {
          // ثانياً: البحث عن إعلانات عامة لجميع الأدوات
          const { data: allToolsAds } = await supabase
            .from('advertisements')
            .select('*')
            .eq('position', position)
            .eq('target_all_ai_tools', true)
            .eq('is_active', true)
            .eq('is_paused', false)
            .order('priority', { ascending: true })
            .limit(maxAds);

          if (allToolsAds && allToolsAds.length > 0) {
            finalAds = allToolsAds;
          }
        }
      }

      // إذا لم نجد إعلانات مخصصة، ابحث عن إعلانات عامة
      if (finalAds.length === 0) {
        let query = supabase
          .from('advertisements')
          .select('*')
          .eq('position', position)
          .eq('is_active', true)
          .eq('is_paused', false)
          .is('target_ai_tool_slug', null)
          .eq('target_all_ai_tools', false);

        // فلترة حسب الكلمات المفتاحية إذا كانت متوفرة
        if (keywords.length > 0) {
          const keywordFilter = keywords.map(keyword =>
            `title.ilike.%${keyword}%,content.ilike.%${keyword}%`
          ).join(',');
          query = query.or(keywordFilter);
        }

        // ترتيب حسب الأولوية والتاريخ
        query = query.order('priority', { ascending: true })
                     .order('created_at', { ascending: false })
                     .limit(maxAds * 2);

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching general ads:', error);
          setError('فشل في تحميل الإعلانات');
          return;
        }

        finalAds = data || [];
      }

      if (!finalAds || finalAds.length === 0) {
        setError('لا توجد إعلانات متاحة');
        return;
      }

      // فلترة الإعلانات الذكية
      const filteredAds = filterSmartAds(finalAds);
      setAds(filteredAds.slice(0, maxAds));

    } catch (error) {
      console.error('Error in fetchSmartAds:', error);
      setError('حدث خطأ في تحميل الإعلانات');
    } finally {
      setLoading(false);
    }
  };

  const filterSmartAds = (allAds: Advertisement[]): Advertisement[] => {
    // تصفية ذكية للإعلانات حسب نوع المحتوى
    return allAds.filter(ad => {
      // فحص التواريخ (إذا كانت متوفرة)
      const now = new Date();
      if ((ad as any).start_date && new Date((ad as any).start_date) > now) return false;
      if ((ad as any).end_date && new Date((ad as any).end_date) < now) return false;

      // فحص الكلمات المفتاحية
      if (keywords.length > 0) {
        const adText = `${ad.title} ${ad.content}`.toLowerCase();
        const hasKeyword = keywords.some(keyword => 
          adText.includes(keyword.toLowerCase())
        );
        if (hasKeyword) return true;
      }

      // إعلانات مشتركة (تظهر في كلا النوعين)
      const sharedKeywords = ['ذكاء اصطناعي', 'ai', 'تقنية', 'برمجة', 'تطوير'];
      const adText = `${ad.title} ${ad.content}`.toLowerCase();
      const isShared = sharedKeywords.some(keyword => 
        adText.includes(keyword)
      );

      if (isShared) return true;

      // إعلانات خاصة بالمقالات
      if (contentType === 'article') {
        const articleKeywords = ['مقال', 'قراءة', 'تعلم', 'دورة'];
        return articleKeywords.some(keyword => 
          adText.includes(keyword)
        );
      }

      // إعلانات خاصة بأدوات الذكاء الاصطناعي
      if (contentType === 'ai-tool') {
        const toolKeywords = ['أداة', 'tool', 'premium', 'مميز'];
        return toolKeywords.some(keyword => 
          adText.includes(keyword)
        );
      }

      return true;
    });
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className={`smart-ad-loading ${className}`}>
        <div className="bg-gray-800 rounded-lg animate-pulse p-4">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // عرض الخطأ مع fallback
  if (error && showFallback && fallbackAdSenseSlot) {
    return (
      <ClientOnlyContent>
        <div className={`smart-ad-fallback ${className}`}>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-1234567890123456"
            data-ad-slot={fallbackAdSenseSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <script>
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </script>
        </div>
      </ClientOnlyContent>
    );
  }

  // عرض الإعلانات - بدون مساحة إضافية إذا لم توجد إعلانات
  if (ads.length === 0) {
    return null;
  }

  return (
    <ClientOnlyContent>
      <div className={`smart-ad-container ${className} ${ads.length > 0 ? 'mb-6 md:mb-8' : ''}`}>
        {ads.map((ad, index) => (
          <div key={ad.id} className={`smart-ad-item ${index > 0 ? 'mt-4' : ''}`}>
            <AdItem ad={ad} className="w-full" />

            {/* مؤشر الإعلان الذكي */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 text-center mt-1">
                <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded">
                  إعلان ذكي - {contentType}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </ClientOnlyContent>
  );
}

/**
 * مكونات إعلانات ذكية جاهزة للاستخدام
 */

// إعلان ذكي للمقالات
export function SmartArticleAd({ 
  position, 
  className = '', 
  keywords = [] 
}: { 
  position: string; 
  className?: string; 
  keywords?: string[];
}) {
  return (
    <SmartAdManager
      contentType="article"
      position={position}
      className={className}
      keywords={[...keywords, 'مقال', 'قراءة', 'تعلم']}
      fallbackAdSenseSlot="1234567890"
      showFallback={true}
    />
  );
}

// إعلان ذكي لأدوات الذكاء الاصطناعي
export function SmartAIToolAd({
  position,
  className = '',
  keywords = [],
  toolSlug
}: {
  position: string;
  className?: string;
  keywords?: string[];
  toolSlug?: string;
}) {
  return (
    <SmartAdManager
      contentType="ai-tool"
      position={position}
      className={className}
      keywords={[...keywords, 'أداة', 'ذكاء اصطناعي', 'AI']}
      fallbackAdSenseSlot="1234567891"
      showFallback={true}
      toolSlug={toolSlug}
    />
  );
}

// إعلان مشترك (يظهر في كلا النوعين)
export function SmartSharedAd({ 
  position, 
  className = '', 
  keywords = [] 
}: { 
  position: string; 
  className?: string; 
  keywords?: string[];
}) {
  return (
    <SmartAdManager
      contentType="both"
      position={position}
      className={className}
      keywords={[...keywords, 'تقنية', 'برمجة', 'تطوير']}
      fallbackAdSenseSlot="1234567892"
      showFallback={true}
    />
  );
}

// إعلان ذكي للهيدر (مشترك)
export function SmartHeaderAd({ className = 'mb-6' }: { className?: string }) {
  return (
    <SmartSharedAd
      position="header"
      className={className}
      keywords={['دورة', 'تعلم', 'ذكاء اصطناعي']}
    />
  );
}

// إعلان ذكي للمحتوى (متكيف)
export function SmartContentAd({ 
  contentType, 
  className = 'my-8',
  keywords = []
}: { 
  contentType: 'article' | 'ai-tool';
  className?: string;
  keywords?: string[];
}) {
  if (contentType === 'article') {
    return (
      <SmartArticleAd
        position="article-body-mid"
        className={className}
        keywords={keywords}
      />
    );
  } else {
    return (
      <SmartAIToolAd
        position="in-content"
        className={className}
        keywords={keywords}
      />
    );
  }
}

// إعلان ذكي للفوتر (مشترك)
export function SmartFooterAd({ className = 'mt-8' }: { className?: string }) {
  return (
    <SmartSharedAd
      position="footer"
      className={className}
      keywords={['مجتمع', 'انضم', 'تواصل']}
    />
  );
}
