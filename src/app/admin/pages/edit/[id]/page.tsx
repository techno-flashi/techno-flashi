'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PageData {
  id: string;
  page_key: string;
  title_ar: string;
  content_ar: string;
  meta_description?: string;
  meta_keywords?: string;
  is_active: boolean;
  display_order: number;
}

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPagePage({ params }: EditPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pageId, setPageId] = useState<string>('');

  const [formData, setFormData] = useState<PageData>({
    id: '',
    page_key: '',
    title_ar: '',
    content_ar: '',
    meta_description: '',
    meta_keywords: '',
    is_active: true,
    display_order: 0
  });

  // جلب معرف الصفحة
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setPageId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // جلب بيانات الصفحة
  const fetchPageData = async () => {
    if (!pageId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/pages/${pageId}`);
      const result = await response.json();

      if (result.success) {
        setFormData(result.data);
      } else {
        setError(result.message || 'فشل في جلب بيانات الصفحة');
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات الصفحة:', error);
      setError('حدث خطأ أثناء جلب بيانات الصفحة');
    } finally {
      setLoading(false);
    }
  };

  // معالجة تغيير الحقول
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // معالجة تغيير المحتوى
  const handleContentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content_ar: value
    }));
  };

  // حفظ التغييرات
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title_ar.trim() || !formData.content_ar.trim()) {
      setError('العنوان والمحتوى مطلوبان');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title_ar: formData.title_ar,
          content_ar: formData.content_ar,
          meta_description: formData.meta_description,
          meta_keywords: formData.meta_keywords,
          is_active: formData.is_active,
          display_order: formData.display_order
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('تم حفظ التغييرات بنجاح');
        setTimeout(() => {
          router.push('/admin/pages');
        }, 2000);
      } else {
        setError(result.message || 'فشل في حفظ التغييرات');
      }
    } catch (error) {
      console.error('خطأ في حفظ الصفحة:', error);
      setError('حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (pageId) {
      fetchPageData();
    }
  }, [pageId]);

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
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">تحرير الصفحة</h1>
            <p className="text-dark-text-secondary">
              تحرير محتوى صفحة: {formData.title_ar}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link
              href={`/page/${formData.page_key}`}
              target="_blank"
              className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              معاينة الصفحة
            </Link>
            
            <Link
              href="/admin/pages"
              className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              العودة للقائمة
            </Link>
          </div>
        </div>

        {/* رسائل النجاح والخطأ */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* نموذج التحرير */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* معلومات أساسية */}
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6">المعلومات الأساسية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  عنوان الصفحة *
                </label>
                <input
                  type="text"
                  name="title_ar"
                  value={formData.title_ar}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  مفتاح الصفحة
                </label>
                <input
                  type="text"
                  value={formData.page_key}
                  disabled
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-dark-text-secondary mt-1">
                  لا يمكن تعديل مفتاح الصفحة بعد الإنشاء
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary bg-dark-background border-gray-600 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="mr-2 text-white">صفحة نشطة</span>
                </label>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6">تحسين محركات البحث (SEO)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  وصف الصفحة (Meta Description)
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="وصف مختصر للصفحة (160 حرف كحد أقصى)"
                />
                <p className="text-xs text-dark-text-secondary mt-1">
                  {(formData.meta_description || '').length}/160 حرف
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  الكلمات المفتاحية (Meta Keywords)
                </label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={formData.meta_keywords || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="كلمة1, كلمة2, كلمة3"
                />
              </div>
            </div>
          </div>

          {/* محرر المحتوى */}
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-6">محتوى الصفحة *</h2>
            
            <div className="space-y-4">
              <textarea
                name="content_ar"
                value={formData.content_ar}
                onChange={handleInputChange}
                rows={20}
                required
                className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                placeholder="أدخل محتوى الصفحة بصيغة HTML..."
              />
              
              <div className="text-xs text-dark-text-secondary">
                <p className="mb-2">يمكنك استخدام HTML لتنسيق المحتوى. أمثلة:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>&lt;h2&gt;عنوان فرعي&lt;/h2&gt;</li>
                  <li>&lt;p&gt;فقرة نصية&lt;/p&gt;</li>
                  <li>&lt;strong&gt;نص عريض&lt;/strong&gt;</li>
                  <li>&lt;a href="رابط"&gt;نص الرابط&lt;/a&gt;</li>
                </ul>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex justify-between items-center">
            <Link
              href="/admin/pages"
              className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              إلغاء
            </Link>
            
            <button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-blue-600 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 disabled:cursor-not-allowed"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
