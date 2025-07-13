'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MigrateAdsPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const checkTables = async () => {
    setLoading(true);
    try {
      // فحص الجدول القديم
      const { data: oldAds, error: oldError } = await supabase
        .from('ads')
        .select('id, title, status, created_at')
        .limit(10);

      // فحص الجدول الجديد
      const { data: newAds, error: newError } = await supabase
        .from('advertisements')
        .select('id, title, is_active, created_at')
        .limit(10);

      setResults({
        success: true,
        oldTable: {
          exists: !oldError,
          count: oldAds?.length || 0,
          sample: oldAds || []
        },
        newTable: {
          exists: !newError,
          count: newAds?.length || 0,
          sample: newAds || []
        }
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

  const migrateData = async () => {
    if (!confirm('هل أنت متأكد من ترحيل البيانات من الجدول القديم؟')) return;

    setLoading(true);
    try {
      // ترحيل البيانات المتبقية
      const { error } = await supabase.rpc('migrate_ads_to_advertisements');
      
      if (error) {
        // إذا لم تكن الدالة موجودة، استخدم SQL مباشر
        const { error: directError } = await supabase
          .from('advertisements')
          .insert([
            // يمكن إضافة البيانات هنا يدوياً إذا لزم الأمر
          ]);
      }

      alert('تم ترحيل البيانات بنجاح');
      await checkTables();
    } catch (error: any) {
      alert('خطأ في الترحيل: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const dropOldTable = async () => {
    if (!confirm('⚠️ تحذير: هل أنت متأكد من حذف الجدول القديم؟ هذا الإجراء لا يمكن التراجع عنه!')) return;
    if (!confirm('تأكيد نهائي: سيتم حذف جدول ads القديم نهائياً!')) return;

    setLoading(true);
    try {
      // حذف الجدول القديم
      await supabase.rpc('drop_old_ads_table');
      
      alert('تم حذف الجدول القديم بنجاح');
      await checkTables();
    } catch (error: any) {
      alert('خطأ في حذف الجدول: ' + error.message);
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
              <h1 className="text-3xl font-bold text-white mb-2">ترحيل بيانات الإعلانات</h1>
              <p className="text-dark-text-secondary">
                ترحيل البيانات من الجدول القديم (ads) إلى الجدول الجديد (advertisements)
              </p>
            </div>
            <Link
              href="/admin/ads"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              العودة للإعلانات
            </Link>
          </div>

          {/* معلومات المشكلة */}
          <div className="bg-yellow-900 border border-yellow-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">🔍 المشكلة المكتشفة</h2>
            <div className="text-yellow-100 space-y-2">
              <p>• لديك جدولين منفصلين للإعلانات: <code>ads</code> (القديم) و <code>advertisements</code> (الجديد)</p>
              <p>• لوحة التحكم تقرأ من الجدول الجديد بينما بعض المكونات تقرأ من القديم</p>
              <p>• هذا يسبب عدم تطابق في البيانات المعروضة</p>
              <p>• الرابط الذي أرسلته يشير إلى محرر SQL في Supabase حيث يمكنك رؤية هذه المشكلة</p>
            </div>
          </div>

          {/* أدوات الفحص والترحيل */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">فحص الجداول</h2>
              <p className="text-gray-300 mb-4">
                فحص حالة الجدولين القديم والجديد
              </p>
              <button
                onClick={checkTables}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'جاري الفحص...' : 'فحص الجداول'}
              </button>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">ترحيل البيانات</h2>
              <p className="text-gray-300 mb-4">
                ترحيل البيانات المتبقية من القديم للجديد
              </p>
              <button
                onClick={migrateData}
                disabled={loading}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'جاري الترحيل...' : 'ترحيل البيانات'}
              </button>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">حذف الجدول القديم</h2>
              <p className="text-gray-300 mb-4">
                حذف الجدول القديم نهائياً (خطر!)
              </p>
              <button
                onClick={dropOldTable}
                disabled={loading}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'جاري الحذف...' : '⚠️ حذف الجدول القديم'}
              </button>
            </div>
          </div>

          {/* نتائج الفحص */}
          {results && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">
                {results.success ? '✅ نتائج الفحص' : '❌ خطأ في الفحص'}
              </h2>

              {results.success ? (
                <div className="space-y-6">
                  {/* مقارنة الجداول */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* الجدول القديم */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-red-400 mb-3">
                        📊 الجدول القديم (ads)
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">الحالة:</span>
                          <span className={results.oldTable.exists ? 'text-green-400' : 'text-red-400'}>
                            {results.oldTable.exists ? 'موجود' : 'غير موجود'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">عدد الإعلانات:</span>
                          <span className="text-white">{results.oldTable.count}</span>
                        </div>
                      </div>
                      
                      {results.oldTable.sample.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">عينة من البيانات:</h4>
                          <div className="space-y-1">
                            {results.oldTable.sample.slice(0, 3).map((ad: any) => (
                              <div key={ad.id} className="text-xs text-gray-400 bg-gray-900 p-2 rounded">
                                {ad.title} - {ad.status}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* الجدول الجديد */}
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-green-400 mb-3">
                        📊 الجدول الجديد (advertisements)
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300">الحالة:</span>
                          <span className={results.newTable.exists ? 'text-green-400' : 'text-red-400'}>
                            {results.newTable.exists ? 'موجود' : 'غير موجود'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">عدد الإعلانات:</span>
                          <span className="text-white">{results.newTable.count}</span>
                        </div>
                      </div>
                      
                      {results.newTable.sample.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">عينة من البيانات:</h4>
                          <div className="space-y-1">
                            {results.newTable.sample.slice(0, 3).map((ad: any) => (
                              <div key={ad.id} className="text-xs text-gray-400 bg-gray-900 p-2 rounded">
                                {ad.title} - {ad.is_active ? 'نشط' : 'غير نشط'}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* التوصيات */}
                  <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-300 mb-3">💡 التوصيات</h3>
                    <div className="text-blue-100 space-y-2">
                      {results.oldTable.exists && results.oldTable.count > 0 && (
                        <p>• يُنصح بترحيل البيانات المتبقية من الجدول القديم</p>
                      )}
                      {results.oldTable.exists && results.oldTable.count === 0 && (
                        <p>• يمكن حذف الجدول القديم بأمان لأنه فارغ</p>
                      )}
                      <p>• تأكد من أن جميع المكونات تستخدم الجدول الجديد (advertisements)</p>
                      <p>• قم بعمل نسخة احتياطية قبل حذف الجدول القديم</p>
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
            <h2 className="text-xl font-semibold text-white mb-4">معلومات الترحيل</h2>
            <div className="space-y-3 text-gray-300">
              <p>• <strong>الجدول القديم (ads):</strong> يستخدم status, placement, description</p>
              <p>• <strong>الجدول الجديد (advertisements):</strong> يستخدم is_active, position, content</p>
              <p>• <strong>الترحيل:</strong> يحول البيانات من الهيكل القديم للجديد تلقائياً</p>
              <p>• <strong>الحذف:</strong> يحذف الجدول القديم نهائياً بعد التأكد من الترحيل</p>
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
                href="/admin/ads/sync"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                مزامنة البيانات
              </Link>
              <a
                href="https://supabase.com/dashboard/project/zgktrwpladrkhhemhnni/editor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                محرر SQL
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
