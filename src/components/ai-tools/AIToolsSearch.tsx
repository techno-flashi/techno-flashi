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
            className="bg-dark-card border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full bg-dark-card border border-gray-700 text-white px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* نتائج البحث */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
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
              className="text-primary hover:text-blue-400 transition-colors"
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
            className="bg-dark-card rounded-xl overflow-hidden border border-gray-800 hover:border-primary/50 transition-all duration-300 group"
          >
            {/* شعار الأداة */}
            <div className="relative h-48 bg-gradient-to-br from-primary/10 to-blue-600/10">
              {tool.logo_url ? (
                <SVGIcon
                  src={tool.logo_url}
                  alt={tool.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-4 group-hover:scale-105 transition-transform duration-300"
                  fallbackIcon="🤖"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      🤖
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
          <div className="text-gray-400 mb-4">🔍 لا توجد أدوات تطابق معايير البحث</div>
          <p className="text-gray-500 mb-4">
            {searchQuery ? `لم نجد أدوات تحتوي على "${searchQuery}"` : 'لا توجد أدوات في هذه الفئة'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            عرض جميع الأدوات
          </button>
        </div>
      )}

      {/* مؤشر التحميل */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل الأدوات...</p>
        </div>
      )}
    </div>
  );
}
