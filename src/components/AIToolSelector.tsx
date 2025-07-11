'use client';

import { useState, useEffect, useMemo } from 'react';
import { AITool } from '@/types';
import Image from 'next/image';

interface AIToolSelectorProps {
  availableTools: AITool[];
  currentTool: AITool;
  selectedTools: AITool[];
  onToolSelect: (tool: AITool) => void;
  onToolRemove: (toolId: string) => void;
  maxSelections?: number;
  className?: string;
}

export function AIToolSelector({
  availableTools,
  currentTool,
  selectedTools,
  onToolSelect,
  onToolRemove,
  maxSelections = 3,
  className = ''
}: AIToolSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  // تصفية الأدوات المتاحة (استبعاد الأداة الحالية)
  const filteredAvailableTools = availableTools.filter(tool => tool.id !== currentTool.id);

  // استخراج الفئات الفريدة
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(filteredAvailableTools.map(tool => tool.category)));
    return uniqueCategories;
  }, [filteredAvailableTools]);

  // تطبيق الفلاتر
  const filteredTools = useMemo(() => {
    return filteredAvailableTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [filteredAvailableTools, searchTerm, selectedCategory]);

  // التحقق من إمكانية إضافة المزيد من الأدوات
  const canAddMore = selectedTools.length < maxSelections;

  // التحقق من كون الأداة محددة
  const isToolSelected = (toolId: string) => {
    return selectedTools.some(tool => tool.id === toolId);
  };

  return (
    <div className={`bg-dark-card rounded-xl border border-gray-800 ${className}`}>
      {/* رأس المحدد */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">اختر أدوات للمقارنة</h3>
          <span className="text-sm text-dark-text-secondary">
            {selectedTools.length}/{maxSelections} محدد
          </span>
        </div>

        {/* الأدوات المحددة */}
        {selectedTools.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-dark-text-secondary mb-2">الأدوات المحددة:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center bg-primary/20 border border-primary/30 rounded-lg px-3 py-1"
                >
                  <span className="text-sm text-white mr-2">{tool.name}</span>
                  <button
                    onClick={() => onToolRemove(tool.id)}
                    className="text-primary hover:text-red-400 transition-colors"
                    aria-label={`إزالة ${tool.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* أزرار التحكم */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex-1 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
            disabled={!canAddMore}
          >
            {isOpen ? 'إخفاء الأدوات' : canAddMore ? 'إضافة أدوات' : 'تم الوصول للحد الأقصى'}
          </button>
          {selectedTools.length > 0 && (
            <button
              onClick={() => selectedTools.forEach(tool => onToolRemove(tool.id))}
              className="border border-gray-600 hover:border-red-500 text-gray-300 hover:text-red-400 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
            >
              مسح الكل
            </button>
          )}
        </div>
      </div>

      {/* قائمة الأدوات */}
      {isOpen && (
        <div className="p-6">
          {/* شريط البحث والفلاتر */}
          <div className="mb-6 space-y-4">
            {/* البحث */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن أداة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-background border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* فلتر الفئات */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-dark-background border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary focus:outline-none"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* قائمة الأدوات */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => {
                const isSelected = isToolSelected(tool.id);
                return (
                  <div
                    key={tool.id}
                    className={`flex items-center p-4 rounded-lg border transition-all duration-300 ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {/* صورة الأداة */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                      {tool.logo_url ? (
                        <Image
                          src={tool.logo_url}
                          alt={tool.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {tool.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* معلومات الأداة */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">{tool.name}</h4>
                      <p className="text-sm text-dark-text-secondary truncate">{tool.category}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-sm text-dark-text-secondary mr-1">{tool.rating}</span>
                        <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                          tool.pricing === 'free' 
                            ? 'bg-green-500/20 text-green-400' 
                            : tool.pricing === 'paid'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {tool.pricing === 'free' ? 'مجاني' : tool.pricing === 'paid' ? 'مدفوع' : 'مختلط'}
                        </span>
                      </div>
                    </div>

                    {/* زر الإضافة/الإزالة */}
                    <button
                      onClick={() => isSelected ? onToolRemove(tool.id) : onToolSelect(tool)}
                      disabled={!isSelected && !canAddMore}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                        isSelected
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : canAddMore
                          ? 'bg-primary hover:bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isSelected ? 'إزالة' : 'إضافة'}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-dark-text-secondary">لا توجد أدوات تطابق البحث</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
