'use client';

import { useState, useEffect } from 'react';
import { AITool } from '@/types';

interface AIToolsFilterProps {
  tools: AITool[];
  onFilterChange: (filteredTools: AITool[]) => void;
}

export function AIToolsFilter({ tools, onFilterChange }: AIToolsFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // استخراج الفئات الفريدة
  const categories = Array.from(new Set(tools.map(tool => tool.category)));

  // تطبيق الفلاتر
  useEffect(() => {
    let filteredTools = [...tools];

    // فلتر البحث
    if (searchTerm) {
      filteredTools = filteredTools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tool.tags && tool.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // فلتر الفئة
    if (selectedCategory !== 'all') {
      filteredTools = filteredTools.filter(tool => tool.category === selectedCategory);
    }

    // فلتر التسعير
    if (selectedPricing !== 'all') {
      filteredTools = filteredTools.filter(tool => tool.pricing === selectedPricing);
    }

    // ترتيب النتائج
    switch (sortBy) {
      case 'name':
        filteredTools.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        break;
      case 'rating':
        filteredTools.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'popular':
        filteredTools.sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
        break;
      case 'latest':
      default:
        filteredTools.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    onFilterChange(filteredTools);
  }, [searchTerm, selectedCategory, selectedPricing, sortBy, tools, onFilterChange]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPricing('all');
    setSortBy('latest');
  };

  return (
    <div className="bg-dark-card rounded-xl p-6 mb-12 border border-gray-800">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* شريط البحث */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن أداة معينة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-background border border-gray-700 text-white px-4 py-3 pr-12 pl-10 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              aria-label="البحث في أدوات الذكاء الاصطناعي"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="مسح البحث"
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* فلاتر */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* فلتر الفئة */}
          <div className="flex flex-col">
            <label htmlFor="category-filter" className="text-sm text-gray-300 mb-2 sr-only">
              فلترة حسب الفئة
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-dark-background border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-w-[150px]"
              aria-label="فلترة حسب الفئة"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* فلتر التسعير */}
          <div className="flex flex-col">
            <label htmlFor="pricing-filter" className="text-sm text-gray-300 mb-2 sr-only">
              فلترة حسب التسعير
            </label>
            <select
              id="pricing-filter"
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value)}
              className="bg-dark-background border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-w-[150px]"
              aria-label="فلترة حسب التسعير"
            >
              <option value="all">جميع الأسعار</option>
              <option value="free">مجاني</option>
              <option value="freemium">مجاني جزئياً</option>
              <option value="paid">مدفوع</option>
            </select>
          </div>

          {/* ترتيب */}
          <div className="flex flex-col">
            <label htmlFor="sort-filter" className="text-sm text-gray-300 mb-2 sr-only">
              ترتيب النتائج
            </label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark-background border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-w-[150px]"
              aria-label="ترتيب النتائج"
            >
              <option value="latest">الأحدث</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="name">الاسم</option>
              <option value="popular">الأكثر شعبية</option>
            </select>
          </div>

          {/* زر إعادة التعيين */}
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-3 rounded-lg transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-500/20 transform hover:scale-105 active:scale-95 min-h-[44px]"
            aria-label="إعادة تعيين جميع الفلاتر"
            type="button"
          >
            إعادة تعيين
          </button>
        </div>
      </div>

      {/* عرض النتائج */}
      {(searchTerm || selectedCategory !== 'all' || selectedPricing !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-text-secondary">
              {searchTerm && (
                <span>البحث عن: <span className="text-primary">"{searchTerm}"</span></span>
              )}
              {selectedCategory !== 'all' && (
                <span className="mr-4">الفئة: <span className="text-primary">{selectedCategory}</span></span>
              )}
              {selectedPricing !== 'all' && (
                <span className="mr-4">التسعير: <span className="text-primary">{selectedPricing}</span></span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
