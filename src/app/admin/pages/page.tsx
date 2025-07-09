'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PageData {
  id: string;
  page_key: string;
  title_ar: string;
  content_ar: string;
  meta_description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب الصفحات
  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pages?include_inactive=true');
      const result = await response.json();

      if (result.success) {
        setPages(result.data);
      } else {
        setError(result.message || 'فشل في جلب الصفحات');
      }
    } catch (error) {
      console.error('خطأ في جلب الصفحات:', error);
      setError('حدث خطأ أثناء جلب الصفحات');
    } finally {
      setLoading(false);
    }
  };

  // تبديل حالة الصفحة (نشط/غير نشط)
  const togglePageStatus = async (pageId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !currentStatus,
          title_ar: pages.find(p => p.id === pageId)?.title_ar,
          content_ar: pages.find(p => p.id === pageId)?.content_ar,
        }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchPages(); // إعادة جلب البيانات
      } else {
        alert('فشل في تحديث حالة الصفحة: ' + result.message);
      }
    } catch (error) {
      console.error('خطأ في تحديث الصفحة:', error);
      alert('حدث خطأ أثناء تحديث الصفحة');
    }
  };

  // حذف صفحة
  const deletePage = async (pageId: string, pageTitle: string) => {
    if (!confirm(`هل أنت متأكد من حذف صفحة "${pageTitle}"؟`)) {
      return;
    }

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchPages(); // إعادة جلب البيانات
      } else {
        alert('فشل في حذف الصفحة: ' + result.message);
      }
    } catch (error) {
      console.error('خطأ في حذف الصفحة:', error);
      alert('حدث خطأ أثناء حذف الصفحة');
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background p-6">
      <div className="container mx-auto">
        {/* العنوان والأزرار */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">إدارة الصفحات</h1>
            <p className="text-dark-text-secondary">
              إدارة محتوى الصفحات الثابتة في الموقع
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link
              href="/admin/pages/new"
              className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              إضافة صفحة جديدة
            </Link>
            
            <Link
              href="/admin"
              className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              العودة للوحة التحكم
            </Link>
          </div>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* جدول الصفحات */}
        <div className="bg-dark-card rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-background">
                <tr>
                  <th className="text-right p-4 text-white font-medium">العنوان</th>
                  <th className="text-right p-4 text-white font-medium">مفتاح الصفحة</th>
                  <th className="text-center p-4 text-white font-medium">الحالة</th>
                  <th className="text-center p-4 text-white font-medium">الترتيب</th>
                  <th className="text-center p-4 text-white font-medium">آخر تحديث</th>
                  <th className="text-center p-4 text-white font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="border-t border-gray-800 hover:bg-dark-background/50">
                    <td className="p-4">
                      <div>
                        <h3 className="text-white font-medium">{page.title_ar}</h3>
                        {page.meta_description && (
                          <p className="text-dark-text-secondary text-sm mt-1 line-clamp-2">
                            {page.meta_description}
                          </p>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <code className="bg-dark-background px-2 py-1 rounded text-primary text-sm">
                        {page.page_key}
                      </code>
                    </td>
                    
                    <td className="p-4 text-center">
                      <button
                        onClick={() => togglePageStatus(page.id, page.is_active)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                          page.is_active
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {page.is_active ? 'نشط' : 'غير نشط'}
                      </button>
                    </td>
                    
                    <td className="p-4 text-center">
                      <span className="text-dark-text-secondary">{page.display_order}</span>
                    </td>
                    
                    <td className="p-4 text-center">
                      <span className="text-dark-text-secondary text-sm">
                        {new Date(page.updated_at).toLocaleDateString('ar-SA')}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/page/${page.page_key}`}
                          target="_blank"
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded transition-colors duration-300"
                          title="عرض الصفحة"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        
                        <Link
                          href={`/admin/pages/edit/${page.id}`}
                          className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 p-2 rounded transition-colors duration-300"
                          title="تعديل الصفحة"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        
                        <button
                          onClick={() => deletePage(page.id, page.title_ar)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded transition-colors duration-300"
                          title="حذف الصفحة"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* رسالة عدم وجود صفحات */}
        {pages.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">لا توجد صفحات</h3>
            <p className="text-dark-text-secondary mb-6">لم يتم إنشاء أي صفحات بعد</p>
            <Link
              href="/admin/pages/new"
              className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 inline-block"
            >
              إنشاء أول صفحة
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
