'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type AdType = 'banner' | 'popup' | 'sidebar' | 'text' | 'image' | 'video' | 'html' | 'adsense';
type AdPosition = 'header' | 'footer' | 'sidebar-right' | 'sidebar-left' | 'in-content' | 'popup' | 'floating';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: AdType;
  position: AdPosition;
  target_url?: string;
  image_url?: string;
  video_url?: string;
  custom_css?: string;
  custom_js?: string;
  priority: number;
  max_views?: number;
  max_clicks?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdsManagementPage() {
  const router = useRouter();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'banner' as AdType,
    position: 'header' as AdPosition,
    target_url: '',
    image_url: '',
    video_url: '',
    custom_css: '',
    custom_js: '',
    priority: 1,
    max_views: '',
    max_clicks: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  // Load ads
  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error loading ads:', error);
      toast.error('خطأ في تحميل الإعلانات');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'banner',
      position: 'header',
      target_url: '',
      image_url: '',
      video_url: '',
      custom_css: '',
      custom_js: '',
      priority: 1,
      max_views: '',
      max_clicks: '',
      start_date: '',
      end_date: '',
      is_active: true
    });
    setEditingAd(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('العنوان والمحتوى مطلوبان');
      return;
    }

    try {
      const adData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: formData.type,
        position: formData.position,
        target_url: formData.target_url.trim() || null,
        image_url: formData.image_url.trim() || null,
        video_url: formData.video_url.trim() || null,
        custom_css: formData.custom_css.trim() || null,
        custom_js: formData.custom_js.trim() || null,
        priority: formData.priority,
        max_views: formData.max_views ? parseInt(formData.max_views) : null,
        max_clicks: formData.max_clicks ? parseInt(formData.max_clicks) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_active: formData.is_active
      };

      if (editingAd) {
        const { error } = await supabase
          .from('advertisements')
          .update(adData)
          .eq('id', editingAd.id);

        if (error) throw error;
        toast.success('تم تحديث الإعلان بنجاح');
      } else {
        const { error } = await supabase
          .from('advertisements')
          .insert([adData]);

        if (error) throw error;
        toast.success('تم إنشاء الإعلان بنجاح');
      }

      resetForm();
      loadAds();
    } catch (error) {
      console.error('Error saving ad:', error);
      toast.error('حدث خطأ في حفظ الإعلان');
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setFormData({
      title: ad.title,
      content: ad.content,
      type: ad.type,
      position: ad.position,
      target_url: ad.target_url || '',
      image_url: ad.image_url || '',
      video_url: ad.video_url || '',
      custom_css: ad.custom_css || '',
      custom_js: ad.custom_js || '',
      priority: ad.priority,
      max_views: ad.max_views?.toString() || '',
      max_clicks: ad.max_clicks?.toString() || '',
      start_date: ad.start_date ? ad.start_date.split('T')[0] : '',
      end_date: ad.end_date ? ad.end_date.split('T')[0] : '',
      is_active: ad.is_active
    });
    setEditingAd(ad);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('تم حذف الإعلان بنجاح');
      loadAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('حدث خطأ في حذف الإعلان');
    }
  };

  const toggleAdStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`تم ${!currentStatus ? 'تفعيل' : 'إيقاف'} الإعلان`);
      loadAds();
    } catch (error) {
      console.error('Error toggling ad status:', error);
      toast.error('حدث خطأ في تغيير حالة الإعلان');
    }
  };

  const adTypes: { value: AdType; label: string }[] = [
    { value: 'banner', label: 'بانر' },
    { value: 'popup', label: 'منبثق' },
    { value: 'sidebar', label: 'جانبي' },
    { value: 'text', label: 'نصي' },
    { value: 'image', label: 'صورة' },
    { value: 'video', label: 'فيديو' },
    { value: 'html', label: 'HTML مخصص' },
    { value: 'adsense', label: 'Google AdSense' }
  ];

  const adPositions: { value: AdPosition; label: string }[] = [
    { value: 'header', label: 'أعلى الصفحة' },
    { value: 'footer', label: 'أسفل الصفحة' },
    { value: 'sidebar-right', label: 'الشريط الجانبي الأيمن' },
    { value: 'sidebar-left', label: 'الشريط الجانبي الأيسر' },
    { value: 'in-content', label: 'داخل المحتوى' },
    { value: 'popup', label: 'نافذة منبثقة' },
    { value: 'floating', label: 'عائم' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">إدارة الإعلانات</h1>
              <p className="text-dark-text-secondary">إنشاء وإدارة الإعلانات في الموقع</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 space-x-reverse bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span>+</span>
              <span>إعلان جديد</span>
            </button>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {editingAd ? 'تعديل الإعلان' : 'إنشاء إعلان جديد'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      عنوان الإعلان *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل عنوان الإعلان"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      نوع الإعلان
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AdType }))}
                      className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {adTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      موقع الإعلان
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value as AdPosition }))}
                      className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {adPositions.map(position => (
                        <option key={position.value} value={position.value}>
                          {position.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      الأولوية (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">
                    محتوى الإعلان *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                    placeholder="أدخل محتوى الإعلان (HTML, نص، كود AdSense، إلخ)"
                    required
                  />
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      رابط الهدف
                    </label>
                    <input
                      type="url"
                      value={formData.target_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_url: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      رابط الصورة
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      تاريخ البداية
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      تاريخ النهاية
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 text-primary bg-dark-background border-gray-700 rounded focus:ring-primary"
                    />
                    <span className="mr-2 text-dark-text">إعلان نشط</span>
                  </label>
                </div>

                {/* Preview */}
                {formData.content && (
                  <div>
                    <label className="block text-sm font-medium text-dark-text mb-2">
                      معاينة الإعلان
                    </label>
                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                      <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 space-x-reverse">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {editingAd ? 'تحديث الإعلان' : 'إنشاء الإعلان'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Ads List */}
          <div className="bg-dark-card rounded-xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">الإعلانات الحالية</h2>
            </div>

            {ads.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                لا توجد إعلانات حالياً
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        العنوان
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        النوع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        الموقع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {ads.map((ad) => (
                      <tr key={ad.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {ad.title}
                          </div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {ad.content.replace(/<[^>]*>/g, '').substring(0, 50)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded">
                            {adTypes.find(t => t.value === ad.type)?.label || ad.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded">
                            {adPositions.find(p => p.value === ad.position)?.label || ad.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              ad.is_active
                                ? 'bg-green-600 text-white'
                                : 'bg-red-600 text-white'
                            }`}
                          >
                            {ad.is_active ? 'نشط' : 'متوقف'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleEdit(ad)}
                              className="text-primary hover:text-primary/80"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDelete(ad.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              حذف
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
        </div>
      </div>
    </div>
  );
}
