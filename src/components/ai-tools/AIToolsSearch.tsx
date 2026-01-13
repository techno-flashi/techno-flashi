'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import SVGIcon from '../SVGIcon';
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

interface AIToolsSearchProps {
  initialTools?: AITool[];
  categories: string[];
}

export default function AIToolsSearch({ initialTools = [], categories }: AIToolsSearchProps) {
  const [tools, setTools] = useState<AITool[]>(initialTools);
  const [filteredTools, setFilteredTools] = useState<AITool[]>(initialTools);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 12;

  // تحميل جميع الأدوات
  const loadAllTools = useCallback(async () => {
    if (tools.length > initialTools.length) return; // تجنب التحميل المتكرر

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_tools')
        .select('*')
        .in('status', ['published', 'active'])
        .order('rating', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tools:', error);
        return;
      }

      if (data) {
        setTools(data);
        setFilteredTools(data);
      }
    } catch (error) {
      console.error('Error in loadAllTools:', error);
    } finally {
      setLoading(false);
    }
  }, [tools.length, initialTools.length]);

  // تحميل الأدوات عند التحميل الأول
  useEffect(() => {
    loadAllTools();
  }, [loadAllTools]);

  // فلترة الأدوات بناءً على البحث والفئة
  useEffect(() => {
    let filtered = tools;

    // فلترة حسب الفئة
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // فلترة حسب البحث
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
      );
    }

    setFilteredTools(filtered);
    setPage(0); // إعادة تعيين الصفحة
  }, [searchQuery, selectedCategory, tools]);



  // الأدوات المعروضة حالياً (مع التصفح)
  const displayedTools = filteredTools.slice(0, (page + 1) * pageSize);
  const hasMoreToShow = displayedTools.length < filteredTools.length;

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div>
      {/* أدوات البحث والفلترة */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* فلترة الفئات */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع الفئات ({tools.length})</option>
            {categories.map(category => {
              const count = tools.filter(tool => tool.category === category).length;
              return (
                <option key={category} value={category}>
                  {category} ({count})
                </option>
              );
            })}
          </select>

          {/* مربع البحث */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في الأدوات... (اسم الأداة، الوصف، الفئة)"
              className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-500 px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              🔍
            </div>
          </div>
        </div>

        {/* نتائج البحث */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            عرض {displayedTools.length} من {filteredTools.length} أداة
            {searchQuery && ` • البحث عن: "${searchQuery}"`}
            {selectedCategory !== 'all' && ` • الفئة: ${selectedCategory}`}
          </span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              مسح الفلاتر ✕
            </button>
          )}
        </div>
      </div>

      {/* شبكة الأدوات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedTools.map((tool) => (
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
      {hasMoreToShow && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium"
          >
            عرض المزيد ({filteredTools.length - displayedTools.length} أداة متبقية)
          </button>
        </div>
      )}

      {/* رسالة عدم وجود نتائج */}
      {!loading && filteredTools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">🔍 لا توجد أدوات تطابق معايير البحث</div>
          <p className="text-gray-600 mb-4">
            {searchQuery ? `لم نجد أدوات تحتوي على "${searchQuery}"` : 'لا توجد أدوات في هذه الفئة'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            عرض جميع الأدوات
          </button>
        </div>
      )}

      {/* مؤشر التحميل */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-description">جاري تحميل الأدوات...</p>
        </div>
      )}
    </div>
  );
}
