'use client';

import { useState, useCallback } from 'react';
import { AITool } from '@/types';
import { AIToolSelector } from './AIToolSelector';
import { IndividualToolComparison } from './IndividualToolComparison';
import Link from 'next/link';

interface AIToolComparisonContainerProps {
  currentTool: AITool;
  availableTools: AITool[];
  className?: string;
}

export function AIToolComparisonContainer({
  currentTool,
  availableTools,
  className = ''
}: AIToolComparisonContainerProps) {
  const [selectedTools, setSelectedTools] = useState<AITool[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // إضافة أداة للمقارنة
  const handleToolSelect = useCallback((tool: AITool) => {
    setSelectedTools(prev => {
      // التحقق من عدم وجود الأداة مسبقاً
      if (prev.some(t => t.id === tool.id)) {
        return prev;
      }
      // إضافة الأداة الجديدة
      const newTools = [...prev, tool];
      // إظهار المقارنة تلقائياً عند إضافة أول أداة
      if (newTools.length === 1) {
        setShowComparison(true);
      }
      return newTools;
    });
  }, []);

  // إزالة أداة من المقارنة
  const handleToolRemove = useCallback((toolId: string) => {
    setSelectedTools(prev => {
      const newTools = prev.filter(tool => tool.id !== toolId);
      // إخفاء المقارنة إذا لم تعد هناك أدوات محددة
      if (newTools.length === 0) {
        setShowComparison(false);
      }
      return newTools;
    });
  }, []);

  // مسح جميع الأدوات المحددة
  const handleClearAll = useCallback(() => {
    setSelectedTools([]);
    setShowComparison(false);
  }, []);

  // تبديل عرض المقارنة
  const toggleComparison = useCallback(() => {
    setShowComparison(prev => !prev);
  }, []);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* رأس القسم */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          قارن {currentTool.name} مع أدوات أخرى
        </h2>
        <p className="text-dark-text-secondary max-w-2xl mx-auto">
          اختر أدوات أخرى لمقارنتها مع {currentTool.name} واتخذ قراراً مدروساً بناءً على المميزات والتسعير والتقييمات
        </p>
      </div>

      {/* محدد الأدوات */}
      <AIToolSelector
        availableTools={availableTools}
        currentTool={currentTool}
        selectedTools={selectedTools}
        onToolSelect={handleToolSelect}
        onToolRemove={handleToolRemove}
        maxSelections={3}
      />

      {/* أزرار التحكم في المقارنة */}
      {selectedTools.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={toggleComparison}
            className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
          >
            <span className="ml-2">
              {showComparison ? '🔼' : '🔽'}
            </span>
            {showComparison ? 'إخفاء المقارنة' : 'عرض المقارنة'}
          </button>
          
          <button
            onClick={handleClearAll}
            className="border border-gray-600 hover:border-red-500 text-gray-300 hover:text-red-400 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            مسح جميع الأدوات
          </button>
        </div>
      )}

      {/* عرض المقارنة */}
      {showComparison && selectedTools.length > 0 && (
        <div className="animate-fadeIn">
          <IndividualToolComparison
            currentTool={currentTool}
            comparisonTools={selectedTools}
          />
        </div>
      )}

      {/* روابط إضافية */}
      <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          استكشف المزيد من خيارات المقارنة
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* مقارنة شاملة */}
          <Link
            href="/ai-tools/compare"
            className="bg-primary/10 border border-primary/20 rounded-lg p-4 hover:bg-primary/20 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <h4 className="font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                مقارنة شاملة
              </h4>
              <p className="text-sm text-dark-text-secondary">
                قارن بين أفضل الأدوات في صفحة مخصصة
              </p>
            </div>
          </Link>

          {/* تصفح الفئات */}
          <Link
            href="/ai-tools/categories"
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 hover:bg-green-500/20 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">📂</div>
              <h4 className="font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                تصفح الفئات
              </h4>
              <p className="text-sm text-dark-text-secondary">
                استكشف الأدوات حسب التخصص
              </p>
            </div>
          </Link>

          {/* جميع الأدوات */}
          <Link
            href="/ai-tools"
            className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 hover:bg-purple-500/20 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <h4 className="font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                جميع الأدوات
              </h4>
              <p className="text-sm text-dark-text-secondary">
                تصفح المجموعة الكاملة من الأدوات
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* نصائح للمستخدمين الجدد */}
      {selectedTools.length === 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <span className="ml-2">💡</span>
            كيفية استخدام المقارنة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-dark-text-secondary">
            <div>
              <h4 className="font-medium text-white mb-2">الخطوات:</h4>
              <ol className="space-y-1 list-decimal list-inside">
                <li>انقر على "إضافة أدوات" لفتح قائمة الأدوات</li>
                <li>ابحث أو تصفح الأدوات المتاحة</li>
                <li>اختر حتى 3 أدوات للمقارنة</li>
                <li>انقر "عرض المقارنة" لرؤية النتائج</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">نصائح:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>قارن أدوات من نفس الفئة للحصول على أفضل النتائج</li>
                <li>انتبه للتسعير والمميزات المختلفة</li>
                <li>اقرأ التقييمات قبل اتخاذ القرار</li>
                <li>جرب النسخ المجانية قبل الشراء</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
