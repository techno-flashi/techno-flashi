'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AdItem from '@/components/ads/AdItem';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'html' | 'banner' | 'adsense';
  position: string;
  is_active: boolean;
  is_paused?: boolean;
  paused_at?: string;
  pause_reason?: string;
  view_count: number;
  click_count: number;
  target_url?: string;
  image_url?: string;
  video_url?: string;
  custom_css?: string;
  custom_js?: string;
  priority?: number;
  created_at: string;
  updated_at: string;
}

export default function SimpleAdsAdminPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [previewAd, setPreviewAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ads:', error);
        return;
      }

      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  // إيقاف/تشغيل الإعلان مؤقتاً
  const togglePauseAd = async (adId: string, isPaused: boolean) => {
    try {
      console.log('togglePauseAd called:', { adId, isPaused });

      const updateData = {
        is_paused: !isPaused,
        paused_at: !isPaused ? new Date().toISOString() : null,
        pause_reason: !isPaused ? 'تم الإيقاف يدوياً من لوحة التحكم' : null,
        updated_at: new Date().toISOString()
      };

      console.log('Update data:', updateData);

      const { error } = await supabase
        .from('advertisements')
        .update(updateData)
        .eq('id', adId);

      if (error) {
        console.error('Error toggling ad pause:', error);
        alert('خطأ في تغيير حالة الإعلان: ' + error.message);
        return;
      }

      console.log('Update successful');

      // تحديث القائمة
      await fetchAds();
      alert(isPaused ? 'تم تشغيل الإعلان' : 'تم إيقاف الإعلان مؤقتاً');
    } catch (error) {
      console.error('Error in togglePauseAd:', error);
      alert('خطأ في تغيير حالة الإعلان: ' + (error as Error).message);
    }
  };

  const toggleAdStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating ad:', error);
        return;
      }

      // تحديث الحالة المحلية
      setAds(ads.map(ad => 
        ad.id === id 
          ? { ...ad, is_active: !currentStatus }
          : ad
      ));
    } catch (error) {
      console.error('Error updating ad:', error);
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting ad:', error);
        return;
      }

      setAds(ads.filter(ad => ad.id !== id));
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  // تصفية الإعلانات
  const filteredAds = ads.filter(ad => {
    if (filter === 'active' && !ad.is_active) return false;
    if (filter === 'inactive' && ad.is_active) return false;
    if (typeFilter !== 'all' && ad.type !== typeFilter) return false;
    if (positionFilter !== 'all' && ad.position !== positionFilter) return false;
    return true;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-900 text-blue-300';
      case 'image': return 'bg-green-900 text-green-300';
      case 'video': return 'bg-purple-900 text-purple-300';
      case 'html': return 'bg-orange-900 text-orange-300';
      case 'banner': return 'bg-pink-900 text-pink-300';
      case 'adsense': return 'bg-yellow-900 text-yellow-300';
      default: return 'bg-background-secondary text-text-secondary';
    }
  };

  const getPositionName = (position: string) => {
    const positions: Record<string, string> = {
      'header': 'الهيدر',
      'footer': 'الفوتر',
      'sidebar-right': 'الشريط الجانبي',
      'article-body-start': 'بداية المقال',
      'article-body-mid': 'وسط المقال',
      'article-body-end': 'نهاية المقال',
      'in-content': 'داخل المحتوى'
    };
    return positions[position] || position;
  };

  const uniqueTypes = Array.from(new Set(ads.map(ad => ad.type)));
  const uniquePositions = Array.from(new Set(ads.map(ad => ad.position)));

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-white text-xl">جاري تحميل الإعلانات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* رأس الصفحة */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">إدارة الإعلانات</h1>
              <p className="text-dark-text-secondary">
                إجمالي الإعلانات: {ads.length} | النشطة: {ads.filter(ad => ad.is_active).length} | غير النشطة: {ads.filter(ad => !ad.is_active).length}
              </p>
            </div>
            <div className="flex space-x-4 space-x-reverse">
              <Link
                href="/admin/ads/new"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                إضافة إعلان جديد
              </Link>
              <Link
                href="/admin/ads/sync"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                مزامنة البيانات
              </Link>
            </div>
          </div>

          {/* الفلاتر */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* فلتر الحالة */}
              <div>
                <label className="block text-white font-medium mb-2">الحالة:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600"
                >
                  <option value="all">جميع الإعلانات ({ads.length})</option>
                  <option value="active">النشطة ({ads.filter(ad => ad.is_active).length})</option>
                  <option value="inactive">غير النشطة ({ads.filter(ad => !ad.is_active).length})</option>
                </select>
              </div>

              {/* فلتر النوع */}
              <div>
                <label className="block text-white font-medium mb-2">النوع:</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600"
                >
                  <option value="all">جميع الأنواع</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* فلتر الموضع */}
              <div>
                <label className="block text-white font-medium mb-2">الموضع:</label>
                <select
                  value={positionFilter}
                  onChange={(e) => setPositionFilter(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600"
                >
                  <option value="all">جميع المواضع</option>
                  {uniquePositions.map(position => (
                    <option key={position} value={position}>{getPositionName(position)}</option>
                  ))}
                </select>
              </div>

              {/* أزرار الإجراءات */}
              <div>
                <label className="block text-white font-medium mb-2">الإجراءات:</label>
                <button
                  onClick={fetchAds}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  تحديث القائمة
                </button>
              </div>
            </div>
          </div>

          {/* قائمة الإعلانات */}
          <div className="bg-dark-card rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-right p-4 text-white font-semibold">العنوان</th>
                    <th className="text-right p-4 text-white font-semibold">النوع</th>
                    <th className="text-right p-4 text-white font-semibold">الموضع</th>
                    <th className="text-right p-4 text-white font-semibold">الحالة</th>
                    <th className="text-right p-4 text-white font-semibold">الإحصائيات</th>
                    <th className="text-right p-4 text-white font-semibold">تاريخ الإنشاء</th>
                    <th className="text-right p-4 text-white font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAds.map((ad, index) => (
                    <tr key={ad.id} className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-900/50' : ''}`}>
                      <td className="p-4">
                        <div>
                          <h3 className="text-white font-medium">{ad.title}</h3>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {ad.content.length > 100 ? `${ad.content.substring(0, 100)}...` : ad.content}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(ad.type)}`}>
                          {ad.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300 text-sm">
                          {getPositionName(ad.position)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              ad.is_active
                                ? 'bg-green-900 text-green-300 hover:bg-green-800'
                                : 'bg-red-900 text-red-300 hover:bg-red-800'
                            }`}
                          >
                            {ad.is_active ? 'نشط' : 'غير نشط'}
                          </button>

                          {ad.is_active && (
                            <button
                              onClick={() => {
                                console.log('Pause button clicked for ad:', ad.id, 'Current paused state:', ad.is_paused);
                                togglePauseAd(ad.id, ad.is_paused || false);
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                ad.is_paused
                                  ? 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800'
                                  : 'bg-blue-900 text-blue-300 hover:bg-blue-800'
                              }`}
                            >
                              {ad.is_paused ? '⏸️ مؤقف' : '▶️ يعمل'}
                            </button>
                          )}

                          {/* عرض سبب الإيقاف إذا كان موجوداً */}
                          {ad.is_paused && ad.pause_reason && (
                            <div className="text-xs text-yellow-400 mt-1">
                              {ad.pause_reason}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-300">
                          <div>👁️ {ad.view_count || 0}</div>
                          <div>👆 {ad.click_count || 0}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-400 text-sm">
                          {new Date(ad.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => setPreviewAd(ad)}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
                          >
                            معاينة
                          </button>
                          <Link
                            href={`/admin/ads/${ad.id}/edit`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                          >
                            تعديل
                          </Link>
                          {ad.is_active && (
                            <button
                              onClick={() => {
                                console.log('Action pause button clicked for ad:', ad.id, 'Current paused state:', ad.is_paused);
                                togglePauseAd(ad.id, ad.is_paused || false);
                              }}
                              className={`px-2 py-1 rounded text-xs transition-colors ${
                                ad.is_paused
                                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                  : 'bg-orange-600 hover:bg-orange-700 text-white'
                              }`}
                            >
                              {ad.is_paused ? 'تشغيل' : 'إيقاف'}
                            </button>
                          )}
                          <button
                            onClick={() => deleteAd(ad.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors"
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

            {filteredAds.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">لا توجد إعلانات تطابق الفلاتر المحددة</div>
                <Link
                  href="/admin/ads/new"
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
                >
                  إضافة إعلان جديد
                </Link>
              </div>
            )}
          </div>

          {/* روابط سريعة */}
          <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
            <Link
              href="/test-ads-comprehensive"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              اختبار الإعلانات
            </Link>
            <Link
              href="/test-ads-integration"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              اختبار التكامل
            </Link>
            <Link
              href="/test-dashboard"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              لوحة الاختبار
            </Link>
          </div>

          {/* نافذة المعاينة */}
          {previewAd && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-dark-card rounded-xl border border-gray-800 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">معاينة الإعلان</h3>
                    <button
                      onClick={() => setPreviewAd(null)}
                      className="text-gray-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-white mb-2">{previewAd.title}</h4>
                    <div className="flex space-x-4 space-x-reverse text-sm text-gray-400 mb-4">
                      <span>النوع: {previewAd.type}</span>
                      <span>الموضع: {getPositionName(previewAd.position)}</span>
                      <span>الحالة: {previewAd.is_active ? 'نشط' : 'غير نشط'}</span>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4">
                    <AdItem ad={previewAd} className="w-full" />
                  </div>

                  <div className="mt-4 flex justify-end space-x-2 space-x-reverse">
                    <button
                      onClick={() => setPreviewAd(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      إغلاق
                    </button>
                    <Link
                      href={`/admin/ads/${previewAd.id}/edit`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      تعديل الإعلان
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
