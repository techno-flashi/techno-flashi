'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Advertisement {
  id: string;
  title: string;
  position: string;
  is_active: boolean;
  is_paused?: boolean;
  paused_at?: string;
  pause_reason?: string;
  created_at: string;
}

export default function TestPauseAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching ads:', error);
        return;
      }

      console.log('Fetched ads:', data);
      setAds(data || []);
    } catch (error) {
      console.error('Error in fetchAds:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePauseAd = async (adId: string, isPaused: boolean) => {
    try {
      setActionLoading(adId);
      console.log('🔄 Starting pause toggle for ad:', adId, 'Current paused state:', isPaused);
      
      const updateData = {
        is_paused: !isPaused,
        paused_at: !isPaused ? new Date().toISOString() : null,
        pause_reason: !isPaused ? 'تم الإيقاف من صفحة الاختبار' : null,
        updated_at: new Date().toISOString()
      };
      
      console.log('📝 Update data:', updateData);

      const { data, error } = await supabase
        .from('advertisements')
        .update(updateData)
        .eq('id', adId)
        .select();

      if (error) {
        console.error('❌ Error toggling ad pause:', error);
        alert('خطأ في تغيير حالة الإعلان: ' + error.message);
        return;
      }

      console.log('✅ Update successful, returned data:', data);
      
      // تحديث القائمة
      await fetchAds();
      alert(isPaused ? '✅ تم تشغيل الإعلان' : '⏸️ تم إيقاف الإعلان مؤقتاً');
    } catch (error) {
      console.error('❌ Error in togglePauseAd:', error);
      alert('خطأ في تغيير حالة الإعلان: ' + (error as Error).message);
    } finally {
      setActionLoading(null);
    }
  };

  const testDirectUpdate = async () => {
    try {
      // اختبار تحديث مباشر
      const { data, error } = await supabase
        .from('advertisements')
        .update({ 
          is_paused: true,
          paused_at: new Date().toISOString(),
          pause_reason: 'اختبار مباشر من صفحة الاختبار'
        })
        .eq('is_active', true)
        .eq('is_paused', false)
        .limit(1)
        .select();

      if (error) {
        console.error('Error in direct update:', error);
        alert('خطأ في الاختبار المباشر: ' + error.message);
        return;
      }

      console.log('Direct update result:', data);
      alert('تم الاختبار المباشر بنجاح');
      await fetchAds();
    } catch (error) {
      console.error('Error in testDirectUpdate:', error);
      alert('خطأ في الاختبار المباشر');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🧪 اختبار زر إيقاف الإعلانات</h1>
              <p className="text-dark-text-secondary">
                صفحة اختبار مخصصة لتشخيص وإصلاح مشكلة زر الإيقاف
              </p>
            </div>
            <Link
              href="/admin/ads"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              العودة للإعلانات
            </Link>
          </div>

          {/* أزرار الاختبار */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={fetchAds}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              🔄 تحديث القائمة
            </button>
            <button
              onClick={testDirectUpdate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              🧪 اختبار مباشر
            </button>
            <button
              onClick={() => console.log('Current ads state:', ads)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              📊 طباعة الحالة
            </button>
          </div>

          {/* جدول الإعلانات */}
          <div className="bg-dark-card rounded-xl overflow-hidden border border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-right p-4 text-white font-semibold">العنوان</th>
                    <th className="text-right p-4 text-white font-semibold">الموضع</th>
                    <th className="text-right p-4 text-white font-semibold">الحالة</th>
                    <th className="text-right p-4 text-white font-semibold">حالة الإيقاف</th>
                    <th className="text-right p-4 text-white font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
                    <tr key={ad.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                      <td className="p-4">
                        <div className="text-white font-medium">{ad.title}</div>
                        <div className="text-gray-400 text-sm">ID: {ad.id.slice(0, 8)}...</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">
                          {ad.position}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ad.is_active
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}>
                          {ad.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ad.is_paused
                              ? 'bg-yellow-900 text-yellow-300'
                              : 'bg-blue-900 text-blue-300'
                          }`}>
                            {ad.is_paused ? '⏸️ مؤقف' : '▶️ يعمل'}
                          </span>
                          {ad.is_paused && ad.pause_reason && (
                            <div className="text-xs text-yellow-400">
                              {ad.pause_reason}
                            </div>
                          )}
                          {ad.is_paused && ad.paused_at && (
                            <div className="text-xs text-gray-500">
                              {new Date(ad.paused_at).toLocaleString('ar-SA')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2 space-x-reverse">
                          {ad.is_active && (
                            <button
                              onClick={() => {
                                console.log('🖱️ Button clicked for ad:', {
                                  id: ad.id,
                                  title: ad.title,
                                  is_paused: ad.is_paused,
                                  is_active: ad.is_active
                                });
                                togglePauseAd(ad.id, ad.is_paused || false);
                              }}
                              disabled={actionLoading === ad.id}
                              className={`px-3 py-2 rounded text-sm transition-colors disabled:opacity-50 ${
                                ad.is_paused
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              }`}
                            >
                              {actionLoading === ad.id ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  جاري...
                                </div>
                              ) : (
                                ad.is_paused ? '▶️ تشغيل' : '⏸️ إيقاف'
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => console.log('Ad details:', ad)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors"
                          >
                            📋 تفاصيل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {ads.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">لا توجد إعلانات</div>
            </div>
          )}

          {/* معلومات التشخيص */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">🔍 معلومات التشخيص</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">خطوات التشخيص</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>1. افتح Developer Tools (F12)</li>
                  <li>2. انتقل إلى تبويب Console</li>
                  <li>3. اضغط على زر الإيقاف/التشغيل</li>
                  <li>4. راقب الرسائل في Console</li>
                  <li>5. تحقق من تحديث البيانات</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">الرسائل المتوقعة</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• 🖱️ Button clicked for ad</li>
                  <li>• 🔄 Starting pause toggle</li>
                  <li>• 📝 Update data</li>
                  <li>• ✅ Update successful</li>
                  <li>• تحديث القائمة</li>
                </ul>
              </div>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="mt-8 text-center">
            <div className="space-x-4 space-x-reverse">
              <Link
                href="/admin/ads"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                لوحة إدارة الإعلانات
              </Link>
              <Link
                href="/test-dashboard"
                className="inline-block px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                لوحة الاختبار
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
