'use client';

import React, { useState } from 'react';
import { PlacementPosition, PlacementRules, PLACEMENT_OPTIONS } from '@/types';

interface PlacementSelectorProps {
  value: PlacementRules;
  onChange: (rules: PlacementRules) => void;
  className?: string;
}

export function PlacementSelector({ value, onChange, className = '' }: PlacementSelectorProps) {
  const [activeTab, setActiveTab] = useState<'position' | 'pages' | 'rules'>('position');

  const handlePositionChange = (position: PlacementPosition) => {
    onChange({
      ...value,
      position
    });
  };

  const handlePagesChange = (pages: string[]) => {
    onChange({
      ...value,
      pages
    });
  };

  const handleUrlPatternsChange = (patterns: string[]) => {
    onChange({
      ...value,
      url_patterns: patterns
    });
  };

  const handleExcludePagesChange = (excludePages: string[]) => {
    onChange({
      ...value,
      exclude_pages: excludePages
    });
  };

  const handleAutoInsertChange = (autoInsert: boolean) => {
    onChange({
      ...value,
      auto_insert: autoInsert
    });
  };

  return (
    <div className={`bg-dark-card rounded-xl border border-gray-700 ${className}`}>
      {/* تبويبات */}
      <div className="flex border-b border-gray-700">
        {[
          { key: 'position', label: 'الموضع', icon: '📍' },
          { key: 'pages', label: 'الصفحات', icon: '📄' },
          { key: 'rules', label: 'القواعد', icon: '⚙️' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-dark-text-secondary hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* تبويب الموضع */}
        {activeTab === 'position' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">اختر موضع الإعلان</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLACEMENT_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      value.position === option.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                    }`}
                    onClick={() => handlePositionChange(option.value as PlacementPosition)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                        value.position === option.value
                          ? 'border-primary bg-primary'
                          : 'border-gray-500'
                      }`}>
                        {value.position === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{option.label}</h4>
                        <p className="text-sm text-dark-text-secondary">{option.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* معاينة الموضع */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3">معاينة الموضع</h4>
              <div className="relative bg-gray-900 rounded border border-gray-600 p-4 text-xs">
                <PlacementPreview position={value.position} />
              </div>
            </div>
          </div>
        )}

        {/* تبويب الصفحات */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">تحديد الصفحات</h3>
              
              {/* الصفحات المحددة */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  الصفحات المحددة (اتركها فارغة لعرض الإعلان في جميع الصفحات)
                </label>
                <PageSelector
                  selectedPages={value.pages || []}
                  onChange={handlePagesChange}
                />
              </div>

              {/* أنماط URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  أنماط URL (استخدم * للبدل)
                </label>
                <UrlPatternInput
                  patterns={value.url_patterns || []}
                  onChange={handleUrlPatternsChange}
                />
              </div>

              {/* الصفحات المستبعدة */}
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  الصفحات المستبعدة
                </label>
                <PageSelector
                  selectedPages={value.exclude_pages || []}
                  onChange={handleExcludePagesChange}
                  placeholder="اختر الصفحات المراد استبعادها"
                />
              </div>
            </div>
          </div>
        )}

        {/* تبويب القواعد */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">قواعد العرض</h3>
              
              {/* الإدراج التلقائي */}
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-white">الإدراج التلقائي</h4>
                  <p className="text-sm text-dark-text-secondary">
                    إدراج الإعلان تلقائياً في الموضع المحدد
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value.auto_insert || false}
                    onChange={(e) => handleAutoInsertChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// مكون معاينة الموضع
function PlacementPreview({ position }: { position: PlacementPosition }) {
  const getPreviewLayout = () => {
    const adBox = <div className="bg-red-500/30 border border-red-500 p-2 text-red-300 text-center">إعلان</div>;
    
    switch (position) {
      case 'header_top':
        return (
          <>
            {adBox}
            <div className="bg-blue-500/20 border border-blue-500 p-2 text-blue-300 mt-2">الهيدر</div>
            <div className="bg-gray-600 p-2 text-gray-300 mt-2">المحتوى</div>
          </>
        );
      case 'header_bottom':
        return (
          <>
            <div className="bg-blue-500/20 border border-blue-500 p-2 text-blue-300">الهيدر</div>
            {adBox}
            <div className="bg-gray-600 p-2 text-gray-300 mt-2">المحتوى</div>
          </>
        );
      case 'content_top':
        return (
          <>
            <div className="bg-blue-500/20 border border-blue-500 p-2 text-blue-300">الهيدر</div>
            <div className="mt-2">{adBox}</div>
            <div className="bg-gray-600 p-2 text-gray-300 mt-2">المحتوى</div>
          </>
        );
      case 'content_middle':
        return (
          <>
            <div className="bg-blue-500/20 border border-blue-500 p-2 text-blue-300">الهيدر</div>
            <div className="bg-gray-600 p-2 text-gray-300 mt-2">المحتوى الأول</div>
            <div className="mt-2">{adBox}</div>
            <div className="bg-gray-600 p-2 text-gray-300 mt-2">المحتوى الثاني</div>
          </>
        );
      case 'sidebar_top':
        return (
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="bg-blue-500/20 border border-blue-500 p-2 text-blue-300">الهيدر</div>
              <div className="bg-gray-600 p-2 text-gray-300 mt-2">المحتوى</div>
            </div>
            <div className="w-1/3">
              {adBox}
              <div className="bg-gray-600 p-2 text-gray-300 mt-2 text-xs">الشريط الجانبي</div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="bg-blue-500/20 border border-blue-500 p-2 text-blue-300">الهيدر</div>
            <div className="bg-gray-600 p-2 text-gray-300 mt-2">المحتوى</div>
            <div className="mt-2">{adBox}</div>
          </>
        );
    }
  };

  return <div className="space-y-1">{getPreviewLayout()}</div>;
}

// مكون اختيار الصفحات
interface PageSelectorProps {
  selectedPages: string[];
  onChange: (pages: string[]) => void;
  placeholder?: string;
}

function PageSelector({ selectedPages, onChange, placeholder = "اختر الصفحات" }: PageSelectorProps) {
  const [inputValue, setInputValue] = useState('');

  const commonPages = [
    { value: '/', label: 'الصفحة الرئيسية' },
    { value: '/ai-tools', label: 'أدوات الذكاء الاصطناعي' },
    { value: '/articles', label: 'المقالات' },
    { value: '/services', label: 'الخدمات' },
    { value: '/ai-tools/*', label: 'جميع صفحات الأدوات' },
    { value: '/articles/*', label: 'جميع صفحات المقالات' },
    { value: '/services/*', label: 'جميع صفحات الخدمات' }
  ];

  const addPage = (page: string) => {
    if (page && !selectedPages.includes(page)) {
      onChange([...selectedPages, page]);
    }
  };

  const removePage = (page: string) => {
    onChange(selectedPages.filter(p => p !== page));
  };

  const addCustomPage = () => {
    if (inputValue.trim()) {
      addPage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-3">
      {/* الصفحات الشائعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {commonPages.map((page) => (
          <label key={page.value} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700/30 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPages.includes(page.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  addPage(page.value);
                } else {
                  removePage(page.value);
                }
              }}
              className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
            />
            <span className="text-sm text-dark-text">{page.label}</span>
          </label>
        ))}
      </div>

      {/* إضافة صفحة مخصصة */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCustomPage()}
          placeholder="أدخل مسار صفحة مخصص (مثل: /custom-page)"
          className="flex-1 bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={addCustomPage}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          إضافة
        </button>
      </div>

      {/* الصفحات المحددة */}
      {selectedPages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPages.map((page) => (
            <span
              key={page}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
            >
              {page}
              <button
                onClick={() => removePage(page)}
                className="ml-1 text-primary hover:text-red-400 transition-colors duration-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// مكون إدخال أنماط URL
interface UrlPatternInputProps {
  patterns: string[];
  onChange: (patterns: string[]) => void;
}

function UrlPatternInput({ patterns, onChange }: UrlPatternInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addPattern = () => {
    if (inputValue.trim() && !patterns.includes(inputValue.trim())) {
      onChange([...patterns, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removePattern = (pattern: string) => {
    onChange(patterns.filter(p => p !== pattern));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addPattern()}
          placeholder="مثل: /articles/*, /ai-tools/category/*"
          className="flex-1 bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={addPattern}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          إضافة
        </button>
      </div>

      {patterns.length > 0 && (
        <div className="space-y-2">
          {patterns.map((pattern, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-600"
            >
              <code className="text-sm text-green-400">{pattern}</code>
              <button
                onClick={() => removePattern(pattern)}
                className="text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-dark-text-secondary">
        <p>استخدم * كبديل للمطابقة. مثال:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li><code>/articles/*</code> - جميع صفحات المقالات</li>
          <li><code>/ai-tools/category/*</code> - جميع صفحات فئات الأدوات</li>
          <li><code>*/mobile</code> - جميع الصفحات التي تنتهي بـ mobile</li>
        </ul>
      </div>
    </div>
  );
}
