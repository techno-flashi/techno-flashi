'use client';

import { useState } from 'react';
import { cleanArticleContent, previewCleaningChanges } from '@/lib/articleCleaner';
import toast from 'react-hot-toast';

interface ArticleCleanerButtonProps {
  content: string;
  onContentChange: (newContent: string) => void;
  className?: string;
}

interface CleaningResult {
  originalContent: string;
  cleanedContent: string;
  stats: {
    originalLength: number;
    cleanedLength: number;
    reduction: number;
    reductionPercentage: number;
    h1Converted: number;
    removedElements: {
      scripts: number;
      iframes: number;
      objects: number;
      embeds: number;
      total: number;
    };
  };
  validation: {
    isValid: boolean;
    issues: string[];
    warnings: string[];
  };
  hasChanges: boolean;
}

export default function ArticleCleanerButton({ 
  content, 
  onContentChange, 
  className = '' 
}: ArticleCleanerButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [cleaningResult, setCleaningResult] = useState<CleaningResult | null>(null);
  const [backupContent, setBackupContent] = useState<string>('');

  const handleCleanContent = async () => {
    if (!content || content.trim().length === 0) {
      toast.error('لا يوجد محتوى للتنظيف');
      return;
    }

    setIsProcessing(true);
    
    try {
      // إنشاء نسخة احتياطية
      setBackupContent(content);
      
      // معاينة التغييرات
      const result = previewCleaningChanges(content);
      setCleaningResult(result);
      
      if (!result.hasChanges) {
        toast.success('المحتوى نظيف بالفعل ولا يحتاج إلى تنظيف');
        return;
      }
      
      // عرض معاينة التغييرات
      setShowPreview(true);
      
    } catch (error) {
      console.error('خطأ في تنظيف المحتوى:', error);
      toast.error('حدث خطأ أثناء تنظيف المحتوى');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyCleanedContent = () => {
    if (cleaningResult && cleaningResult.validation.isValid) {
      onContentChange(cleaningResult.cleanedContent);
      setShowPreview(false);
      
      // عرض رسالة نجاح مع الإحصائيات
      const stats = cleaningResult.stats;
      let message = '✅ تم تنظيف المقال وتنسيقه بنجاح. المقال جاهز للنشر.';
      
      if (stats.reduction > 0) {
        message += `\n📊 تم تقليل حجم المحتوى بنسبة ${stats.reductionPercentage}%`;
      }
      
      if (stats.h1Converted > 0) {
        message += `\n🔄 تم تحويل ${stats.h1Converted} عنوان H1 إلى H2`;
      }
      
      if (stats.removedElements.total > 0) {
        message += `\n🗑️ تم إزالة ${stats.removedElements.total} عنصر غير آمن`;
      }
      
      toast.success(message, { duration: 5000 });
    } else {
      toast.error('لا يمكن تطبيق التنظيف بسبب وجود مشاكل في المحتوى');
    }
  };

  const handleUndo = () => {
    if (backupContent) {
      onContentChange(backupContent);
      setBackupContent('');
      toast.success('تم التراجع عن التنظيف بنجاح');
    }
  };

  const cancelPreview = () => {
    setShowPreview(false);
    setCleaningResult(null);
  };

  return (
    <>
      <div className={`flex items-center space-x-3 space-x-reverse ${className}`}>
        <button
          type="button"
          onClick={handleCleanContent}
          disabled={isProcessing || !content}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التنظيف...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              تنظيف وتنسيق المقال تلقائياً
            </>
          )}
        </button>

        {backupContent && (
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            تراجع
          </button>
        )}
      </div>

      {/* نافذة معاينة التغييرات */}
      {showPreview && cleaningResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                معاينة تنظيف المقال
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                راجع التغييرات قبل التطبيق
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* الإحصائيات */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 dark:text-blue-400">تقليل الحجم</div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {cleaningResult.stats.reductionPercentage}%
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    {cleaningResult.stats.reduction} حرف
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-sm text-green-600 dark:text-green-400">عناوين H1 محولة</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {cleaningResult.stats.h1Converted}
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="text-sm text-red-600 dark:text-red-400">عناصر محذوفة</div>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {cleaningResult.stats.removedElements.total}
                  </div>
                </div>
              </div>

              {/* التحذيرات والمشاكل */}
              {(cleaningResult.validation.issues.length > 0 || cleaningResult.validation.warnings.length > 0) && (
                <div className="mb-6">
                  {cleaningResult.validation.issues.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                      <h4 className="text-red-800 dark:text-red-200 font-medium mb-2">مشاكل يجب حلها:</h4>
                      <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm">
                        {cleaningResult.validation.issues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cleaningResult.validation.warnings.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <h4 className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">تحذيرات:</h4>
                      <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 text-sm">
                        {cleaningResult.validation.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* معاينة المحتوى */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">المحتوى الأصلي</h4>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-60 overflow-y-auto">
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {cleaningResult.originalContent.substring(0, 1000)}
                      {cleaningResult.originalContent.length > 1000 && '...'}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">المحتوى المنظف</h4>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg max-h-60 overflow-y-auto">
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {cleaningResult.cleanedContent.substring(0, 1000)}
                      {cleaningResult.cleanedContent.length > 1000 && '...'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 space-x-reverse">
              <button
                onClick={cancelPreview}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={applyCleanedContent}
                disabled={!cleaningResult.validation.isValid}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                تطبيق التنظيف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
