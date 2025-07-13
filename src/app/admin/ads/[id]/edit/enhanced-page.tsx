'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: string;
  position: string;
  is_active: boolean;
  target_url?: string;
  image_url?: string;
  video_url?: string;
  custom_css?: string;
  custom_js?: string;
  priority?: number;
  start_date?: string;
  end_date?: string;
  max_views?: number;
  max_clicks?: number;
  created_at: string;
  updated_at: string;
}

interface EditAdPageProps {
  params: Promise<{ id: string }>;
}

export default function EnhancedEditAdPage({ params }: EditAdPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [adId, setAdId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'text',
    position: 'header',
    is_active: true,
    target_url: '',
    image_url: '',
    video_url: '',
    custom_css: '',
    custom_js: '',
    priority: 1,
    start_date: '',
    end_date: '',
    max_views: 0,
    max_clicks: 0
  });

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setAdId(resolvedParams.id);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (adId) {
      fetchAd();
    }
  }, [adId]);

  const fetchAd = async () => {
    try {
      setLoading(true);
      const { data: ad, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('id', adId)
        .single();

      if (error) {
        console.error('Database error:', error);
        alert('فشل في جلب بيانات الإعلان');
        router.push('/admin/ads');
        return;
      }

      if (!ad) {
        alert('الإعلان غير موجود');
        router.push('/admin/ads');
        return;
      }

      setAd(ad);
      
      // تحويل التواريخ للتنسيق المطلوب
      const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().slice(0, 16);
      };

      setFormData({
        title: ad.title || '',
        content: ad.content || '',
        type: ad.type || 'text',
        position: ad.position || 'header',
        is_active: ad.is_active !== false,
        target_url: ad.target_url || '',
        image_url: ad.image_url || '',
        video_url: ad.video_url || '',
        custom_css: ad.custom_css || '',
        custom_js: ad.custom_js || '',
        priority: ad.priority || 1,
        start_date: formatDate(ad.start_date),
        end_date: formatDate(ad.end_date),
        max_views: ad.max_views || 0,
        max_clicks: ad.max_clicks || 0
      });
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
      const { data: updatedAd, error } = await supabase
        .from('advertisements')
        .update({
          title: formData.title,
          content: formData.content,
          type: formData.type,
          position: formData.position,
          is_active: formData.is_active,
          target_url: formData.target_url || null,
          image_url: formData.image_url || null,
          video_url: formData.video_url || null,
          custom_css: formData.custom_css || null,
          custom_js: formData.custom_js || null,
          priority: formData.priority,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          max_views: formData.max_views || null,
          max_clicks: formData.max_clicks || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', adId)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        alert('فشل في تحديث الإعلان');
        return;
      }

      alert('تم تحديث الإعلان بنجاح');
      router.push('/admin/ads');
    } catch (error) {
      console.error('Error updating ad:', error);
      alert('حدث خطأ أثناء تحديث الإعلان');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white text-xl">جاري تحميل بيانات الإعلان...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* رأس الصفحة */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">تعديل الإعلان</h1>
              <p className="text-dark-text-secondary">
                تعديل إعلان: {ad?.title}
              </p>
            </div>
            <Link
              href="/admin/ads"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              العودة للقائمة
            </Link>
          </div>

          {/* نموذج التعديل */}
          <div className="bg-dark-card rounded-xl border border-gray-800 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* المعلومات الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">عنوان الإعلان *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                    placeholder="أدخل عنوان الإعلان"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">نوع الإعلان *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                  >
                    <option value="text">نصي</option>
                    <option value="image">صورة</option>
                    <option value="video">فيديو</option>
                    <option value="html">HTML مخصص</option>
                    <option value="banner">بانر</option>
                    <option value="adsense">Google AdSense</option>
                  </select>
                </div>
              </div>

              {/* المحتوى */}
              <div>
                <label className="block text-white font-medium mb-2">محتوى الإعلان *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                  placeholder="أدخل محتوى الإعلان (نص، HTML، ad slot، إلخ)"
                />
              </div>

              {/* الموضع والأولوية */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">موضع الإعلان *</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                  >
                    <option value="header">الهيدر</option>
                    <option value="footer">الفوتر</option>
                    <option value="sidebar-right">الشريط الجانبي</option>
                    <option value="article-body-start">بداية المقال</option>
                    <option value="article-body-mid">وسط المقال</option>
                    <option value="article-body-end">نهاية المقال</option>
                    <option value="in-content">داخل المحتوى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">الأولوية</label>
                  <input
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="ml-2 w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary"
                    />
                    إعلان نشط
                  </label>
                </div>
              </div>

              {/* الروابط والوسائط */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">رابط الهدف</label>
                  <input
                    type="url"
                    name="target_url"
                    value={formData.target_url}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">رابط الصورة</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">رابط الفيديو</label>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              </div>

              {/* CSS و JavaScript مخصص */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">CSS مخصص</label>
                  <textarea
                    name="custom_css"
                    value={formData.custom_css}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none font-mono text-sm"
                    placeholder=".ad-class { color: red; }"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">JavaScript مخصص</label>
                  <textarea
                    name="custom_js"
                    value={formData.custom_js}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none font-mono text-sm"
                    placeholder="console.log('Ad loaded');"
                  />
                </div>
              </div>

              {/* التواريخ والحدود */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">تاريخ البداية</label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">تاريخ النهاية</label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">حد المشاهدات</label>
                  <input
                    type="number"
                    name="max_views"
                    value={formData.max_views}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                    placeholder="0 = بلا حدود"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">حد النقرات</label>
                  <input
                    type="number"
                    name="max_clicks"
                    value={formData.max_clicks}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-primary focus:outline-none"
                    placeholder="0 = بلا حدود"
                  />
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-700">
                <Link
                  href="/admin/ads"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  إلغاء
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
