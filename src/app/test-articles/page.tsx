'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  created_at: string;
  author: string;
}

export default function TestArticlesPage() {
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
        .select('id, title, slug, excerpt, status, created_at, author')
        .order('created_at', { ascending: false })
        .limit(20);

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

  const deleteArticle = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting article:', error);
        alert('فشل في حذف المقال');
        return;
      }

      setArticles(prev => prev.filter(article => article.id !== id));
      alert('تم حذف المقال بنجاح');
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('حدث خطأ أثناء الحذف');
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">المقالات المنشورة</h1>
            <p className="text-dark-text-secondary">عرض جميع المقالات الموجودة في قاعدة البيانات</p>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <div className="text-white">
              إجمالي المقالات: <span className="font-bold text-primary">{articles.length}</span>
            </div>
            <div className="space-x-4 space-x-reverse">
              <Link
                href="/admin/articles/create"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                إنشاء مقال جديد
              </Link>
              <button
                onClick={fetchArticles}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                تحديث
              </button>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="bg-dark-card rounded-xl p-8 border border-gray-800 text-center">
              <div className="text-gray-400 text-lg mb-4">لا توجد مقالات منشورة</div>
              <Link
                href="/admin/articles/create"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                إنشاء أول مقال
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={article.id} className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {article.excerpt || 'لا يوجد ملخص'}
                    </p>
                  </div>

                  <div className="mb-4 text-xs text-gray-500 space-y-1">
                    <div>الكاتب: {article.author || 'غير محدد'}</div>
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
                    <div className="break-all">Slug: {article.slug}</div>
                  </div>

                  <div className="flex space-x-2 space-x-reverse">
                    <Link
                      href={`/articles/${article.slug}`}
                      target="_blank"
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors text-center"
                    >
                      عرض
                    </Link>
                    <Link
                      href={`/admin/articles/edit/${article.id}`}
                      className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors text-center"
                    >
                      تحرير
                    </Link>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* معلومات إضافية */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">إحصائيات</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {articles.filter(a => a.status === 'published').length}
                </div>
                <div className="text-gray-400 text-sm">مقالات منشورة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {articles.filter(a => a.status === 'draft').length}
                </div>
                <div className="text-gray-400 text-sm">مسودات</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {articles.length}
                </div>
                <div className="text-gray-400 text-sm">إجمالي المقالات</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {new Set(articles.map(a => a.author)).size}
                </div>
                <div className="text-gray-400 text-sm">كتاب</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
