'use client';

import { useState, useEffect } from 'react';

interface ArticleStats {
  needFixing: number;
  total: number;
  articles: Array<{
    id: string;
    title: string;
    featured_image_url?: string;
  }>;
}

interface UpdateResult {
  message: string;
  updated: Array<{
    id: string;
    title: string;
    newImageUrl: string;
  }>;
  total: number;
}

export default function FixImagesClient() {
  const [stats, setStats] = useState<ArticleStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [result, setResult] = useState<UpdateResult | null>(null);

  // جلب الإحصائيات
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/fix-article-images');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // إصلاح الصور
  const fixImages = async () => {
    setUpdating(true);
    try {
      const response = await fetch('/api/fix-article-images', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);

      // تحديث الإحصائيات
      await fetchStats();
    } catch (error) {
      console.error('Error fixing images:', error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-dark-background text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            إصلاح صور المقالات
          </h1>
          <p className="text-gray-400">
            إدارة وإصلاح الصور الافتراضية للمقالات
          </p>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">
              {loading ? '...' : stats?.total || 0}
            </div>
            <div className="text-gray-400 text-sm">إجمالي المقالات</div>
          </div>

          <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-yellow-400">
              {loading ? '...' : stats?.needFixing || 0}
            </div>
            <div className="text-gray-400 text-sm">تحتاج إصلاح</div>
          </div>

          <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-green-400">
              {loading ? '...' : (stats?.total || 0) - (stats?.needFixing || 0)}
            </div>
            <div className="text-gray-400 text-sm">لديها صور</div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="bg-dark-card p-6 rounded-lg border border-gray-700 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'جاري التحديث...' : 'تحديث الإحصائيات'}
            </button>

            <button
              onClick={fixImages}
              disabled={updating || !stats?.needFixing}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {updating ? 'جاري الإصلاح...' : 'إصلاح جميع الصور'}
            </button>
          </div>
        </div>

        {/* نتائج العملية */}
        {result && (
          <div className="bg-green-900/20 border border-green-700 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-green-400 mb-4">
              نتائج العملية
            </h3>
            <p className="text-green-300 mb-4">{result.message}</p>
            {result.updated && result.updated.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-green-400">المقالات المحدثة:</h4>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {result.updated.map((article) => (
                    <div key={article.id} className="text-sm text-green-200 bg-green-900/10 p-2 rounded">
                      {article.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* قائمة المقالات التي تحتاج إصلاح */}
        {stats && stats.articles && stats.articles.length > 0 && (
          <div className="bg-dark-card p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              المقالات التي تحتاج إصلاح ({stats.needFixing})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {stats.articles.map((article) => (
                <div key={article.id} className="border border-gray-600 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-2">{article.title}</h4>
                  <div className="text-sm text-gray-400">
                    الصورة الحالية: {article.featured_image_url || 'لا توجد صورة'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
