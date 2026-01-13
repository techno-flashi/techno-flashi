'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import SVGIcon from '@/components/SVGIcon';
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
  rating?: string;
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



  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-orange-400 mb-4">❌ {error}</div>
        <button
          onClick={() => {
            setError(null);
            loadMoreTools();
          }}
          className="bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
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
            className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group"
          >
            {/* شعار الأداة */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
              <div className="relative w-20 h-20">
                <SVGIcon
                  src={tool.logo_url || "https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/robot.svg"}
                  alt={`شعار ${tool.name}`}
                  width={80}
                  height={80}
                  className="transition-transform duration-300 group-hover:scale-110 object-contain"
                  fallbackIcon="🤖"
                />
              </div>
            </div>

            {/* محتوى البطاقة */}
            <div className="p-6">
              {/* اسم الأداة */}
              <h3 className="text-xl font-bold text-black mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                {tool.name}
              </h3>

              {/* وصف الأداة */}
              <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                {tool.description}
              </p>

              {/* زر عرض التفاصيل */}
              <Link
                href={`/ai-tools/${tool.slug}`}
                className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium block"
              >
                عرض التفاصيل
              </Link>
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
            className="bg-primary text-black px-8 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-medium"
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
