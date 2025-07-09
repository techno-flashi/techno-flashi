'use client';

// صفحة إدارة المقالات
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getArticles, deleteArticle } from '@/lib/database';
import { Article } from '@/types';

function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // جلب المقالات عند تحميل الصفحة
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف المقال "${title}"؟`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await deleteArticle(id);
      setArticles(articles.filter(article => article.id !== id));
    } catch (err: any) {
      alert(`خطأ في حذف المقال: ${err.message}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          منشور
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        مسودة
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#38BDF8] mb-4"></div>
          <p className="text-gray-400">جاري تحميل المقالات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] p-6">
      <div className="max-w-7xl mx-auto">
        {/* هيدر الصفحة */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">إدارة المقالات</h1>
            <p className="text-gray-400 mt-2">إدارة جميع مقالات الموقع</p>
          </div>
          <Link
            href="/admin/articles/new"
            className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center"
          >
            <span className="ml-2">+</span>
            مقال جديد
          </Link>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* جدول المقالات */}
        <div className="bg-[#161B22] rounded-lg border border-gray-700 overflow-hidden">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-white mb-2">لا توجد مقالات</h3>
              <p className="text-gray-400 mb-6">ابدأ بإنشاء أول مقال لك</p>
              <Link
                href="/admin/articles/new"
                className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                إنشاء مقال جديد
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#0D1117]">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      العنوان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      تاريخ الإنشاء
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#161B22] divide-y divide-gray-700">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-[#1C2128] transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {article.title}
                          </div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {article.excerpt}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(article.created_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <Link
                            href={`/admin/articles/edit/${article.id}`}
                            className="text-[#38BDF8] hover:text-[#0EA5E9] transition-colors duration-200"
                          >
                            تعديل
                          </Link>
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="text-green-400 hover:text-green-300 transition-colors duration-200"
                          >
                            عرض
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id, article.title)}
                            disabled={deleteLoading === article.id}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50"
                          >
                            {deleteLoading === article.id ? 'جاري الحذف...' : 'حذف'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* إحصائيات سريعة */}
        {articles.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">إجمالي المقالات</h3>
              <p className="text-3xl font-bold text-[#38BDF8]">{articles.length}</p>
            </div>
            
            <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">المقالات المنشورة</h3>
              <p className="text-3xl font-bold text-green-500">
                {articles.filter(a => a.status === 'published').length}
              </p>
            </div>
            
            <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">المسودات</h3>
              <p className="text-3xl font-bold text-yellow-500">
                {articles.filter(a => a.status === 'draft').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <ProtectedRoute>
      <ArticlesManagement />
    </ProtectedRoute>
  );
}
