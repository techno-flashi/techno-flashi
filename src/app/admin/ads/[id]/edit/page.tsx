'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Ad } from '@/types';

interface EditAdPageProps {
  params: { id: string };
}

export default function EditAdPage({ params }: EditAdPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ad, setAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    ad_code: '',
    placement: '',
    type: '',
    status: '',
    priority: 0,
    is_active: true,
    start_date: '',
    end_date: '',
    target_blank: true,
    width: 120,
    height: 60,
    animation_delay: 0,
    sponsor_name: ''
  });

  useEffect(() => {
    fetchAd();
  }, [params.id]);

  const fetchAd = async () => {
    try {
      const response = await fetch(`/api/ads/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAd(data.ad);
        
        // تحويل التواريخ للتنسيق المطلوب
        const formatDate = (dateString: string) => {
          if (!dateString) return '';
          return new Date(dateString).toISOString().slice(0, 16);
        };

        setFormData({
          title: data.ad.title || '',
          description: data.ad.description || '',
          image_url: data.ad.image_url || '',
          link_url: data.ad.link_url || '',
          ad_code: data.ad.ad_code || '',
          placement: data.ad.placement || '',
          type: data.ad.type || '',
          status: data.ad.status || '',
          priority: data.ad.priority || 0,
          is_active: data.ad.is_active !== false,
          start_date: formatDate(data.ad.start_date),
          end_date: formatDate(data.ad.end_date),
          target_blank: data.ad.target_blank !== false,
          width: data.ad.width || 120,
          height: data.ad.height || 60,
          animation_delay: data.ad.animation_delay || 0,
          sponsor_name: data.ad.sponsor_name || ''
        });
      } else {
        alert('فشل في جلب بيانات الإعلان');
        router.push('/admin/ads');
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
      alert('حدث خطأ أثناء جلب بيانات الإعلان');
      router.push('/admin/ads');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/ads/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('تم تحديث الإعلان بنجاح');
        router.push('/admin/ads');
      } else {
        const error = await response.json();
        alert(`فشل في تحديث الإعلان: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating ad:', error);
      alert('حدث خطأ أثناء تحديث الإعلان');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="bg-white rounded-lg p-8">
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">الإعلان غير موجود</h1>
          <Link
            href="/admin/ads"
            className="text-primary hover:underline"
          >
            العودة إلى إدارة الإعلانات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/ads"
            className="text-gray-600 hover:text-gray-900"
          >
            ← العودة إلى إدارة الإعلانات
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">تعديل الإعلان</h1>
            <div className="text-sm text-gray-500">
              <div>النقرات: {ad.click_count}</div>
              <div>المشاهدات: {ad.impression_count}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الإعلان *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الراعي
                </label>
                <input
                  type="text"
                  name="sponsor_name"
                  value={formData.sponsor_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الإعلان
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الصورة
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
                      alt="معاينة"
                      className="max-w-32 max-h-16 object-contain border rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الإعلان
                </label>
                <input
                  type="url"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الإعلان
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="banner">بانر</option>
                  <option value="sponsor">راعي</option>
                  <option value="popup">نافذة منبثقة</option>
                  <option value="sidebar">شريط جانبي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مكان العرض
                </label>
                <select
                  name="placement"
                  value={formData.placement}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="homepage-top">أعلى الصفحة الرئيسية</option>
                  <option value="sponsors-section">قسم الرعاة</option>
                  <option value="sidebar">الشريط الجانبي</option>
                  <option value="article-top">أعلى المقال</option>
                  <option value="article-bottom">أسفل المقال</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة الإعلان
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="scheduled">مجدول</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
              
              <Link
                href="/admin/ads"
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
