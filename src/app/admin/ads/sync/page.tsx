'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SyncAdsPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const syncData = async () => {
    setLoading(true);
    setResults(null);

    try {
      // 1. حذف الإعلانات الاختبارية
      const { error: deleteError } = await supabase
        .from('advertisements')
        .delete()
        .or('title.eq.s,title.eq.ss,title.eq.v,title.eq.1,title.like.%test%,title.like.%Test%,title.like.%TEST%');

      // 2. إعادة تعيين عدادات المشاهدات والنقرات للإعلانات الجديدة
      const { error: resetError } = await supabase
        .from('advertisements')
        .update({ 
          view_count: 0, 
          click_count: 0 
        })
        .is('view_count', null);

      // 3. جلب الإحصائيات النهائية
      const { data: stats, error: statsError } = await supabase
        .from('advertisements')
        .select('id, title, type, position, is_active, view_count, click_count');

      if (statsError) throw statsError;

      // تجميع الإحصائيات
      const totalAds = stats?.length || 0;
      const activeAds = stats?.filter(ad => ad.is_active).length || 0;
      const inactiveAds = totalAds - activeAds;
      
      const typeStats = stats?.reduce((acc: any, ad) => {
        acc[ad.type] = (acc[ad.type] || 0) + 1;
        return acc;
      }, {});

      const positionStats = stats?.reduce((acc: any, ad) => {
        acc[ad.position] = (acc[ad.position] || 0) + 1;
        return acc;
      }, {});

      const totalViews = stats?.reduce((sum, ad) => sum + (ad.view_count || 0), 0) || 0;
      const totalClicks = stats?.reduce((sum, ad) => sum + (ad.click_count || 0), 0) || 0;

      setResults({
        success: true,
        totalAds,
        activeAds,
        inactiveAds,
        typeStats,
        positionStats,
        totalViews,
        totalClicks,
        ctr: totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00'
      });

    } catch (error: any) {
      setResults({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const cleanupTestAds = async () => {
    setLoading(true);
    try {
      // حذف الإعلانات الاختبارية بعناوين قصيرة أو غير مفيدة
      const { data: testAds, error: fetchError } = await supabase
        .from('advertisements')
        .select('id, title')
        .or('title.like.%test%,title.like.%Test%,title.like.%TEST%,title.eq.s,title.eq.ss,title.eq.v,title.eq.1,title.eq.2,title.eq.3');

      if (fetchError) throw fetchError;

      if (testAds && testAds.length > 0) {
        const { error: deleteError } = await supabase
          .from('advertisements')
          .delete()
          .in('id', testAds.map(ad => ad.id));

        if (deleteError) throw deleteError;

        alert(`تم حذف ${testAds.length} إعلان اختباري`);
      } else {
        alert('لا توجد إعلانات اختبارية للحذف');
      }

      // تحديث الإحصائيات
      await syncData();
    } catch (error: any) {
      alert('خطأ في حذف الإعلانات الاختبارية: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* رأس الصفحة */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">مزامنة بيانات الإعلانات</h1>
              <p className="text-dark-text-secondary">
                تنظيف وتحديث بيانات الإعلانات في قاعدة البيانات
              </p>
            </div>
            <Link
              href="/admin/ads"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              العودة للإعلانات
            </Link>
          </div>

          {/* أدوات المزامنة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">مزامنة شاملة</h2>
              <p className="text-gray-300 mb-4">
                تنظيف البيانات وإعادة حساب الإحصائيات
              </p>
              <button
                onClick={syncData}
                disabled={loading}
                className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {loading ? 'جاري المزامنة...' : 'بدء المزامنة'}
              </button>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">حذف الإعلانات الاختبارية</h2>
              <p className="text-gray-300 mb-4">
                حذف الإعلانات بعناوين اختبارية أو قصيرة
              </p>
              <button
                onClick={cleanupTestAds}
                disabled={loading}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'جاري الحذف...' : 'حذف الإعلانات الاختبارية'}
              </button>
            </div>
          </div>

          {/* نتائج المزامنة */}
          {results && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">
                {results.success ? '✅ نتائج المزامنة' : '❌ خطأ في المزامنة'}
              </h2>

              {results.success ? (
                <div className="space-y-6">
                  {/* الإحصائيات العامة */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{results.totalAds}</div>
                      <div className="text-gray-400 text-sm">إجمالي الإعلانات</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">{results.activeAds}</div>
                      <div className="text-gray-400 text-sm">إعلانات نشطة</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-400 mb-1">{results.inactiveAds}</div>
                      <div className="text-gray-400 text-sm">إعلانات غير نشطة</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">{results.ctr}%</div>
                      <div className="text-gray-400 text-sm">معدل النقر</div>
                    </div>
                  </div>

                  {/* إحصائيات الأنواع */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">الإعلانات حسب النوع</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(results.typeStats).map(([type, count]: [string, any]) => (
                        <div key={type} className="bg-gray-800 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-blue-400 mb-1">{count}</div>
                          <div className="text-gray-400 text-sm">{type.toUpperCase()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* إحصائيات المواضع */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">الإعلانات حسب الموضع</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(results.positionStats).map(([position, count]: [string, any]) => (
                        <div key={position} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                          <span className="text-white">{position}</span>
                          <span className="text-purple-400 font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* إحصائيات الأداء */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">إجمالي المشاهدات</h4>
                      <div className="text-2xl font-bold text-green-400">{results.totalViews.toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">إجمالي النقرات</h4>
                      <div className="text-2xl font-bold text-blue-400">{results.totalClicks.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                  <p className="text-red-300">{results.error}</p>
                </div>
              )}
            </div>
          )}

          {/* معلومات إضافية */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">معلومات المزامنة</h2>
            <div className="space-y-3 text-gray-300">
              <p>• <strong>المزامنة الشاملة:</strong> تحذف الإعلانات الاختبارية وتعيد حساب الإحصائيات</p>
              <p>• <strong>حذف الإعلانات الاختبارية:</strong> يحذف الإعلانات بعناوين قصيرة أو تحتوي على "test"</p>
              <p>• <strong>إعادة تعيين العدادات:</strong> يعيد تعيين عدادات المشاهدات والنقرات للإعلانات الجديدة</p>
              <p>• <strong>تحديث الإحصائيات:</strong> يحسب الإحصائيات الحالية بناءً على البيانات المنظفة</p>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="mt-8 text-center">
            <div className="space-x-4 space-x-reverse">
              <Link
                href="/admin/ads"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                إدارة الإعلانات
              </Link>
              <Link
                href="/test-smart-ads"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                اختبار الإعلانات الذكية
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
