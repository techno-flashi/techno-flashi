'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NewPageData {
  page_key: string;
  title_ar: string;
  content_ar: string;
  meta_description: string;
  meta_keywords: string;
  display_order: number;
}

export default function NewPagePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<NewPageData>({
    page_key: '',
    title_ar: '',
    content_ar: '',
    meta_description: '',
    meta_keywords: '',
    display_order: 0
  });

  // معالجة تغيير الحقول
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // إنشاء page_key تلقائي من العنوان
    if (name === 'title_ar') {
      const pageKey = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        page_key: pageKey
      }));
    }
  };

  // حفظ الصفحة الجديدة
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title_ar.trim() || !formData.content_ar.trim() || !formData.page_key.trim()) {
      setError('العنوان ومفتاح الصفحة والمحتوى مطلوبة');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin/pages');
      } else {
        setError(result.message || 'فشل في إنشاء الصفحة');
      }
    } catch (error) {
      console.error('خطأ في إنشاء الصفحة:', error);
      setError('حدث خطأ أثناء إنشاء الصفحة');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-background p-6">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">إضافة صفحة جديدة</h1>
            <p className="text-dark-text-secondary">
              إنشاء صفحة جديدة في الموقع
            </p>
          </div>
          
          <Link
            href="/admin/pages"
            className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            العودة للقائمة
          </Link>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* نموذج الإنشاء */}
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
                  placeholder="مثال: من نحن"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  مفتاح الصفحة *
                </label>
                <input
                  type="text"
                  name="page_key"
                  value={formData.page_key}
                  onChange={handleInputChange}
                  required
                  pattern="[a-z0-9-]+"
                  className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="مثال: about-us"
                />
                <p className="text-xs text-dark-text-secondary mt-1">
                  يتم إنشاؤه تلقائياً من العنوان، يمكنك تعديله
                </p>
              </div>

              <div className="md:col-span-2">
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
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2 bg-dark-background border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="وصف مختصر للصفحة (160 حرف كحد أقصى)"
                />
                <p className="text-xs text-dark-text-secondary mt-1">
                  {formData.meta_description.length}/160 حرف
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  الكلمات المفتاحية (Meta Keywords)
                </label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={formData.meta_keywords}
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
                  <li>&lt;ul&gt;&lt;li&gt;عنصر قائمة&lt;/li&gt;&lt;/ul&gt;</li>
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
              {saving ? 'جاري الإنشاء...' : 'إنشاء الصفحة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
