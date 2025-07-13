'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import SpacingDebugger, { AdDebugger } from '@/components/debug/SpacingDebugger';

export default function TestUpdatesPage() {
  const [adStats, setAdStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdStats();
  }, []);

  const fetchAdStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ad stats:', error);
        return;
      }

      // تجميع الإحصائيات
      const stats = {
        total: data?.length || 0,
        active: data?.filter(ad => ad.is_active && !ad.is_paused).length || 0,
        inactive: data?.filter(ad => !ad.is_active).length || 0,
        paused: data?.filter(ad => ad.is_paused).length || 0,
        byPosition: data?.reduce((acc: any, ad) => {
          acc[ad.position] = (acc[ad.position] || 0) + 1;
          return acc;
        }, {}) || {}
      };

      setAdStats(stats);
    } catch (error) {
      console.error('Error in fetchAdStats:', error);
    } finally {
      setLoading(false);
    }
  };

  const testPauseAd = async () => {
    try {
      // البحث عن إعلان نشط لاختباره
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .eq('is_paused', false)
        .limit(1)
        .single();

      if (error || !data) {
        alert('لا توجد إعلانات نشطة للاختبار');
        return;
      }

      // إيقاف الإعلان مؤقتاً
      const { error: updateError } = await supabase
        .from('advertisements')
        .update({
          is_paused: true,
          paused_at: new Date().toISOString(),
          pause_reason: 'اختبار وظيفة الإيقاف المؤقت'
        })
        .eq('id', data.id);

      if (updateError) {
        alert('خطأ في إيقاف الإعلان: ' + updateError.message);
        return;
      }

      alert(`تم إيقاف الإعلان "${data.title}" مؤقتاً بنجاح`);
      await fetchAdStats();
    } catch (error) {
      console.error('Error in testPauseAd:', error);
      alert('خطأ في اختبار الإيقاف المؤقت');
    }
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🚀 اختبار التحديثات الجديدة
            </h1>
            <p className="text-dark-text-secondary text-lg">
              اختبار شامل للميزات الجديدة: إصلاح المساحات، إيقاف الإعلانات، التحميل التدريجي
            </p>
          </div>

          {/* ملخص التحديثات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dark-card rounded-xl p-6 border border-green-500">
              <h2 className="text-xl font-semibold text-green-400 mb-3">✅ إصلاح المساحات الفارغة</h2>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• إزالة المساحات الفارغة في صفحات المقالات</li>
                <li>• إزالة المساحات الفارغة في صفحات أدوات AI</li>
                <li>• تحسين مكونات الإعلانات الذكية</li>
                <li>• إضافة أدوات تشخيص متقدمة</li>
              </ul>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border border-blue-500">
              <h2 className="text-xl font-semibold text-blue-400 mb-3">⏸️ إيقاف الإعلانات مؤقتاً</h2>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• إضافة حقول is_paused, paused_at, pause_reason</li>
                <li>• تحديث مكونات الإعلانات لتجاهل المؤقفة</li>
                <li>• إضافة أزرار الإيقاف في لوحة التحكم</li>
                <li>• إمكانية الإيقاف بدون حذف البيانات</li>
              </ul>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border border-purple-500">
              <h2 className="text-xl font-semibold text-purple-400 mb-3">📱 التحميل التدريجي</h2>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• مكون LazyAIToolsGrid للتحميل التدريجي</li>
                <li>• تحميل 12 أداة في البداية</li>
                <li>• زر "تحميل المزيد" للصفحات التالية</li>
                <li>• تحسين أداء صفحة أدوات AI</li>
              </ul>
            </div>
          </div>

          {/* إحصائيات الإعلانات */}
          {!loading && adStats && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">📊 إحصائيات الإعلانات المحدثة</h2>
                <button
                  onClick={fetchAdStats}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  تحديث الإحصائيات
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{adStats.total}</div>
                  <div className="text-gray-400 text-sm">إجمالي الإعلانات</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{adStats.active}</div>
                  <div className="text-gray-400 text-sm">نشطة وتعمل</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{adStats.paused}</div>
                  <div className="text-gray-400 text-sm">مؤقفة مؤقتاً</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">{adStats.inactive}</div>
                  <div className="text-gray-400 text-sm">غير نشطة</div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-3">الإعلانات حسب الموضع</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(adStats.byPosition).map(([position, count]: [string, any]) => (
                    <div key={position} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-white text-sm">{position}</span>
                      <span className="text-primary font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* اختبارات تفاعلية */}
          <div className="space-y-8">
            
            {/* اختبار إيقاف الإعلانات */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🧪 اختبارات تفاعلية</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">اختبار إيقاف الإعلانات</h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    اختبار وظيفة إيقاف الإعلانات مؤقتاً بدون حذف البيانات
                  </p>
                  <button
                    onClick={testPauseAd}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    اختبار الإيقاف المؤقت
                  </button>
                </div>

                <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">اختبار أدوات التشخيص</h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    استخدم الأزرار في أسفل الصفحة لتفعيل أدوات تشخيص المساحات والإعلانات
                  </p>
                  <div className="text-green-400 text-sm">
                    ✅ أدوات التشخيص متاحة في أسفل الصفحة
                  </div>
                </div>
              </div>
            </section>

            {/* روابط الاختبار */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🔗 صفحات الاختبار</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href="/articles/no-code-guide-for-beginners-2025"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">✅ صفحة مقال محسنة</h3>
                  <p className="text-gray-400 text-sm">اختبار إصلاح المساحات الفارغة في المقالات</p>
                </Link>

                <Link
                  href="/ai-tools/chatgpt"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-green-500 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">✅ صفحة أداة AI محسنة</h3>
                  <p className="text-gray-400 text-sm">اختبار إصلاح المساحات في صفحات الأدوات</p>
                </Link>

                <Link
                  href="/ai-tools"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-purple-500 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">📱 التحميل التدريجي</h3>
                  <p className="text-gray-400 text-sm">اختبار التحميل التدريجي لأدوات AI</p>
                </Link>

                <Link
                  href="/admin/ads"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-blue-500 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">⏸️ إدارة الإعلانات</h3>
                  <p className="text-gray-400 text-sm">اختبار أزرار الإيقاف المؤقت</p>
                </Link>

                <Link
                  href="/debug-spacing"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-red-500 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">🔍 أدوات التشخيص</h3>
                  <p className="text-gray-400 text-sm">أدوات تشخيص المساحات والإعلانات</p>
                </Link>

                <Link
                  href="/test-dashboard"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">🧪 لوحة الاختبار</h3>
                  <p className="text-gray-400 text-sm">جميع أدوات الاختبار والتشخيص</p>
                </Link>
              </div>
            </section>

            {/* تقرير الحالة */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">📋 تقرير الحالة</h2>
              
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-3">✅ تم الإصلاح</h3>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• المساحات الفارغة في صفحات المقالات</li>
                      <li>• المساحات الفارغة في صفحات أدوات AI</li>
                      <li>• مكونات الإعلانات الذكية</li>
                      <li>• إضافة وظيفة الإيقاف المؤقت</li>
                      <li>• التحميل التدريجي لأدوات AI</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">🔧 ميزات جديدة</h3>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• أدوات تشخيص المساحات</li>
                      <li>• أدوات تشخيص الإعلانات</li>
                      <li>• إيقاف الإعلانات بدون حذف</li>
                      <li>• تحميل تدريجي محسن</li>
                      <li>• واجهة إدارة محسنة</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">⚡ تحسينات الأداء</h3>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• تقليل وقت تحميل صفحة أدوات AI</li>
                      <li>• تحسين استعلامات قاعدة البيانات</li>
                      <li>• تحسين عرض الإعلانات</li>
                      <li>• تحسين تجربة المستخدم</li>
                      <li>• تحسين التجاوب مع الأجهزة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* أدوات التشخيص */}
      <SpacingDebugger enabled={true} />
      <AdDebugger enabled={true} />
    </div>
  );
}
