'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
}

export default function TestEditPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-white text-xl">جاري تحميل المقالات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار صفحة التعديل</h1>
            <p className="text-dark-text-secondary">اختر مقالاً لاختبار صفحة التعديل الجديدة</p>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <div className="text-white">
              المقالات المتاحة: <span className="font-bold text-primary">{articles.length}</span>
            </div>
            <div className="space-x-4 space-x-reverse">
              <Link
                href="/admin/articles/create"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                إنشاء مقال جديد
              </Link>
              <Link
                href="/test-article-creation"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                إنشاء مقال تجريبي
              </Link>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="bg-dark-card rounded-xl p-8 border border-gray-800 text-center">
              <div className="text-gray-400 text-lg mb-4">لا توجد مقالات للتعديل</div>
              <Link
                href="/test-article-creation"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                إنشاء مقال تجريبي أولاً
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {article.title}
                      </h3>
                      
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>ID: <span className="font-mono">{article.id}</span></div>
                        <div>Slug: <span className="font-mono">{article.slug}</span></div>
                        <div>الحالة: 
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            article.status === 'published' 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-yellow-900 text-yellow-300'
                          }`}>
                            {article.status === 'published' ? 'منشور' : 'مسودة'}
                          </span>
                        </div>
                        <div>تاريخ الإنشاء: {new Date(article.created_at).toLocaleDateString('ar-SA')}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2 space-x-reverse ml-4">
                      <Link
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        عرض
                      </Link>
                      <Link
                        href={`/admin/articles/edit/${article.id}`}
                        className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors"
                      >
                        تعديل
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* معلومات إضافية */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">معلومات الاختبار</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>• انقر على "تعديل" لاختبار صفحة التعديل الجديدة</p>
              <p>• صفحة التعديل تدعم نظام الصور المتقدم</p>
              <p>• يمكن تحويل محتوى Editor.js إلى Markdown تلقائياً</p>
              <p>• جميع التغييرات يتم حفظها في قاعدة البيانات</p>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="mt-6 flex justify-center space-x-4 space-x-reverse">
            <Link
              href="/test-dashboard"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              لوحة الاختبار
            </Link>
            <Link
              href="/admin/articles"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              إدارة المقالات
            </Link>
            <Link
              href="/test-articles"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              عرض المقالات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
