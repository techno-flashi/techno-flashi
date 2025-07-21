'use client';

import { useState } from 'react';
import { previewCleaningChanges } from '@/lib/articleCleaner';
import ArticleCleanerButton from '@/components/ArticleCleanerButton';

export default function TestCleanerPage() {
  const [content, setContent] = useState(`<h1>العنوان الرئيسي الأول</h1>
<p>هذه فقرة عادية.</p>

<h1>عنوان رئيسي ثاني يجب تحويله إلى H2</h1>
<p>فقرة أخرى مع <span style="color: red;">نص ملون</span> و <div class="test">عنصر div</div>.</p>

<script>alert('كود خطير!');</script>
<iframe src="http://example.com"></iframe>

<h1>عنوان رئيسي ثالث</h1>
<p>فقرة مع <a href="http://example.com" style="color: blue;" class="link">رابط خارجي</a>.</p>

<img src="image.jpg" style="width: 100px;" class="image" />

<p></p>
<div></div>
<span></span>

<blockquote>اقتباس مهم</blockquote>`);

  const [result, setResult] = useState<any>(null);

  const testCleaning = () => {
    try {
      const cleaningResult = previewCleaningChanges(content);
      setResult(cleaningResult);
      console.log('نتيجة التنظيف:', cleaningResult);
    } catch (error) {
      console.error('خطأ في التنظيف:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">🧹 اختبار ميزة تنظيف المقالات</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* المحتوى الأصلي */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">📝 المحتوى الأصلي</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="أدخل محتوى HTML للاختبار..."
          />
          
          <button
            onClick={testCleaning}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔍 اختبار التنظيف
          </button>
        </div>

        {/* النتائج */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">📊 النتائج</h2>
          
          {result ? (
            <div className="space-y-4">
              {/* الإحصائيات */}
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">📈 الإحصائيات</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>الطول الأصلي: <span className="font-mono">{result.stats.originalLength}</span></div>
                  <div>الطول المنظف: <span className="font-mono">{result.stats.cleanedLength}</span></div>
                  <div>التقليل: <span className="font-mono">{result.stats.reduction}</span></div>
                  <div>النسبة: <span className="font-mono">{result.stats.reductionPercentage}%</span></div>
                  <div>H1 محولة: <span className="font-mono">{result.stats.h1Converted}</span></div>
                  <div>عناصر محذوفة: <span className="font-mono">{result.stats.removedElements.total}</span></div>
                </div>
              </div>

              {/* المحتوى المنظف */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">✨ المحتوى المنظف</h3>
                <textarea
                  value={result.cleanedContent}
                  readOnly
                  className="w-full h-64 p-4 border border-green-300 rounded-lg font-mono text-sm bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* التحذيرات والمشاكل */}
              {(result.validation.issues.length > 0 || result.validation.warnings.length > 0) && (
                <div className="space-y-2">
                  {result.validation.issues.length > 0 && (
                    <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 p-3 rounded-lg">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ مشاكل:</h4>
                      <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm space-y-1">
                        {result.validation.issues.map((issue: string, index: number) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.validation.warnings.length > 0 && (
                    <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 p-3 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ تحذيرات:</h4>
                      <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                        {result.validation.warnings.map((warning: string, index: number) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* حالة التحقق */}
              <div className={`p-3 rounded-lg ${result.validation.isValid ? 'bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800'}`}>
                <div className={`font-semibold ${result.validation.isValid ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                  {result.validation.isValid ? '✅ المحتوى صالح للنشر' : '❌ المحتوى يحتاج إلى مراجعة'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              اضغط على "اختبار التنظيف" لرؤية النتائج
            </div>
          )}
        </div>
      </div>

      {/* اختبار المكون الكامل */}
      <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">🎛️ اختبار المكون الكامل</h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <ArticleCleanerButton
            content={content}
            onContentChange={setContent}
            className="mb-4"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            هذا هو نفس المكون المستخدم في لوحة التحكم. جرب الضغط على الزر لرؤية النافذة المنبثقة.
          </p>
        </div>
      </div>

      {/* أمثلة للاختبار */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">📋 أمثلة للاختبار</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setContent(`<h1>مقال بسيط</h1><p>محتوى نظيف بالفعل.</p>`)}
            className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-left hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div className="font-semibold">مقال نظيف</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">محتوى لا يحتاج تنظيف</div>
          </button>
          
          <button
            onClick={() => setContent(`<h1>العنوان الأول</h1><h1>عنوان ثاني</h1><h1>عنوان ثالث</h1><p>محتوى مع عناوين متعددة.</p>`)}
            className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-left hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors"
          >
            <div className="font-semibold">عناوين متعددة</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">عدة عناوين H1</div>
          </button>
          
          <button
            onClick={() => setContent(`<h1>مقال خطير</h1><script>alert('hack');</script><iframe src="evil.com"></iframe><p>محتوى مع عناصر خطيرة.</p>`)}
            className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg text-left hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
          >
            <div className="font-semibold">محتوى خطير</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">يحتوي على scripts وiframes</div>
          </button>
          
          <button
            onClick={() => setContent(`<h1>مقال فوضوي</h1><p style="color:red" class="test" id="para">فقرة</p><div><span></span></div><p></p><a href="http://example.com" style="color:blue" class="link">رابط</a>`)}
            className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-left hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
          >
            <div className="font-semibold">محتوى فوضوي</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">عناصر فارغة وخصائص زائدة</div>
          </button>
        </div>
      </div>
    </div>
  );
}
