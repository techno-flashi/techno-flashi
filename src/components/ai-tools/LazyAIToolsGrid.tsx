'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: string;
  logo_url?: string;
  website_url?: string;
  slug: string;
  rating?: number;
  features?: string[];
  created_at: string;
}

interface LazyAIToolsGridProps {
  initialTools?: AITool[];
  pageSize?: number;
  category?: string;
  searchQuery?: string;
}

/**
 * مكون تحميل تدريجي لأدوات الذكاء الاصطناعي
 * يحمل البيانات على دفعات لتحسين الأداء
 */
export default function LazyAIToolsGrid({ 
  initialTools = [], 
  pageSize = 12,
  category = '',
  searchQuery = ''
}: LazyAIToolsGridProps) {
  const [tools, setTools] = useState<AITool[]>(initialTools);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // تحميل المزيد من الأدوات
  const loadMoreTools = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('ai_tools')
        .select('*')
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      // فلترة حسب الفئة
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // فلترة حسب البحث
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading tools:', error);
        setError('خطأ في تحميل الأدوات');
        return;
      }

      if (data && data.length > 0) {
        setTools(prev => page === 0 ? data : [...prev, ...data]);
        setPage(prev => prev + 1);
        
        // إذا كان عدد النتائج أقل من pageSize، فلا توجد صفحات أخرى
        if (data.length < pageSize) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error in loadMoreTools:', error);
      setError('خطأ في تحميل الأدوات');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, category, searchQuery, loading, hasMore]);

  // إعادة تعيين عند تغيير الفلاتر
  useEffect(() => {
    setTools([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, [category, searchQuery]);

  // تحميل الصفحة الأولى عند تغيير الفلاتر
  useEffect(() => {
    if (tools.length === 0 && hasMore) {
      loadMoreTools();
    }
  }, [tools.length, hasMore, loadMoreTools]);

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'border-green-500 text-green-400 bg-green-500/10';
      case 'freemium': return 'border-yellow-500 text-yellow-400 bg-yellow-500/10';
      case 'paid': return 'border-red-500 text-red-400 bg-red-500/10';
      default: return 'border-gray-500 text-gray-400 bg-gray-500/10';
    }
  };

  const getPricingText = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'مجاني';
      case 'freemium': return 'مجاني جزئياً';
      case 'paid': return 'مدفوع';
      default: return 'غير محدد';
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">❌ {error}</div>
        <button
          onClick={() => {
            setError(null);
            loadMoreTools();
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* شبكة الأدوات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-dark-card rounded-xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all duration-300 group"
          >
            {/* شعار الأداة */}
            <div className="relative h-48 bg-gradient-to-br from-primary/10 to-blue-600/10">
              {tool.logo_url ? (
                <Image
                  src={tool.logo_url}
                  alt={tool.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-4 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {tool.name.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* محتوى البطاقة */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 line-clamp-1">
                  {tool.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPricingColor(tool.pricing)}`}>
                  {getPricingText(tool.pricing)}
                </span>
              </div>

              <p className="text-dark-text-secondary mb-4 line-clamp-2">
                {tool.description}
              </p>

              {/* الفئة والتقييم */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">
                  {tool.category}
                </span>
                {tool.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-sm text-gray-300">{tool.rating}</span>
                  </div>
                )}
              </div>

              {/* المميزات */}
              {tool.features && tool.features.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {tool.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {tool.features.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{tool.features.length - 3} المزيد
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* أزرار الإجراءات */}
              <div className="flex space-x-2 space-x-reverse">
                <Link
                  href={`/ai-tools/${tool.slug}`}
                  className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-300 text-sm font-medium"
                >
                  عرض التفاصيل
                </Link>
                {tool.website_url && (
                  <a
                    href={tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 text-white py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 text-sm"
                  >
                    🔗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* زر تحميل المزيد */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={loadMoreTools}
            disabled={loading}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-medium"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                جاري التحميل...
              </div>
            ) : (
              'تحميل المزيد'
            )}
          </button>
        </div>
      )}

      {/* رسالة عدم وجود نتائج */}
      {!loading && tools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">🔍 لا توجد أدوات متاحة</div>
          <p className="text-gray-500">جرب تغيير معايير البحث أو الفلترة</p>
        </div>
      )}

      {/* مؤشر التحميل الأولي */}
      {loading && tools.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: pageSize }).map((_, index) => (
            <div
              key={index}
              className="bg-dark-card rounded-xl overflow-hidden border border-gray-800 animate-pulse"
            >
              <div className="h-48 bg-gray-700"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-700 rounded mb-3"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
