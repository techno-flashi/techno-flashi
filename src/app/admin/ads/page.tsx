'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Ad } from '@/types';

export default function AdsManagementPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: '',
    placement: '',
    status: ''
  });

  useEffect(() => {
    fetchAds();
  }, [filter]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.type) params.append('type', filter.type);
      if (filter.placement) params.append('placement', filter.placement);
      if (filter.status) params.append('status', filter.status);

      const response = await fetch(`/api/ads?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAds(data.ads || []);
      } else {
        console.error('Failed to fetch ads:', response.status);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAds(ads.filter(ad => ad.id !== id));
        alert('تم حذف الإعلان بنجاح');
      } else {
        alert('فشل في حذف الإعلان');
      }
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('حدث خطأ أثناء حذف الإعلان');
    }
  };

  const toggleAdStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setAds(ads.map(ad => 
          ad.id === id ? { ...ad, status: newStatus } : ad
        ));
      } else {
        alert('فشل في تغيير حالة الإعلان');
      }
    } catch (error) {
      console.error('Error updating ad status:', error);
      alert('حدث خطأ أثناء تغيير حالة الإعلان');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إدارة الإعلانات</h1>
          <Link
            href="/admin/ads/new"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            إضافة إعلان جديد
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">فلترة الإعلانات</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النوع
              </label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">جميع الأنواع</option>
                <option value="banner">بانر</option>
                <option value="sponsor">راعي</option>
                <option value="popup">نافذة منبثقة</option>
                <option value="sidebar">شريط جانبي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المكان
              </label>
              <select
                value={filter.placement}
                onChange={(e) => setFilter({ ...filter, placement: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">جميع الأماكن</option>
                <option value="homepage-top">أعلى الصفحة الرئيسية</option>
                <option value="sponsors-section">قسم الرعاة</option>
                <option value="sidebar">الشريط الجانبي</option>
                <option value="article-top">أعلى المقال</option>
                <option value="article-bottom">أسفل المقال</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="scheduled">مجدول</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ads List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              الإعلانات ({ads.length})
            </h2>
          </div>

          {ads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد إعلانات مطابقة للفلاتر المحددة
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {ads.map((ad) => (
                <div key={ad.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {ad.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ad.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : ad.status === 'inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ad.status === 'active' ? 'نشط' : 
                           ad.status === 'inactive' ? 'غير نشط' : 'مجدول'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {ad.type === 'banner' ? 'بانر' :
                           ad.type === 'sponsor' ? 'راعي' :
                           ad.type === 'popup' ? 'نافذة منبثقة' : 'شريط جانبي'}
                        </span>
                      </div>
                      
                      {ad.description && (
                        <p className="text-gray-600 mb-2">{ad.description}</p>
                      )}
                      
                      <div className="text-sm text-gray-500">
                        <span>المكان: {ad.placement}</span>
                        {ad.sponsor_name && (
                          <span className="mr-4">الراعي: {ad.sponsor_name}</span>
                        )}
                        <span className="mr-4">الأولوية: {ad.priority}</span>
                        <span className="mr-4">النقرات: {ad.click_count}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAdStatus(ad.id, ad.status)}
                        className={`px-3 py-1 text-sm rounded ${
                          ad.status === 'active'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {ad.status === 'active' ? 'إلغاء التفعيل' : 'تفعيل'}
                      </button>
                      
                      <Link
                        href={`/admin/ads/${ad.id}/edit`}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        تعديل
                      </Link>
                      
                      <button
                        onClick={() => deleteAd(ad.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
