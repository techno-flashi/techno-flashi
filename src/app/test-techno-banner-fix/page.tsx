'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TechnoFlashHeaderBanner, TechnoFlashFooterBanner, TechnoFlashContentBanner } from '@/components/ads/TechnoFlashBanner';
import Link from 'next/link';

export default function TestTechnoBannerFixPage() {
  const [bannerStats, setBannerStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchBannerStats();
    
    // مراقبة الأخطاء في Console
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.('TechnoFlash') || args[0]?.includes?.('banner')) {
        setErrors(prev => [...prev, args.join(' ')]);
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const fetchBannerStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .like('title', '%حصري متحرك%')
        .order('position');

      if (error) {
        console.error('Error fetching banner stats:', error);
        return;
      }

      setBannerStats(data);
    } catch (error) {
      console.error('Error in fetchBannerStats:', error);
    } finally {
      setLoading(false);
    }
  };

  const testBannerPositions = async () => {
    const positions = ['header', 'footer', 'article-body-mid'];
    const results = [];

    for (const position of positions) {
      try {
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('position', position)
          .eq('is_active', true)
          .eq('is_paused', false)
          .like('title', '%حصري متحرك%')
          .limit(1);

        results.push({
          position,
          found: data && data.length > 0,
          data: data?.[0] || null,
          error: error?.message || null
        });
      } catch (error) {
        results.push({
          position,
          found: false,
          data: null,
          error: (error as Error).message
        });
      }
    }

    console.log('Banner position test results:', results);
    alert('تم اختبار المواضع - راجع Console للتفاصيل');
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🔧 إصلاح إعلانات TechnoFlash
            </h1>
            <p className="text-dark-text-secondary text-lg">
              اختبار وإصلاح مشكلة جلب إعلانات TechnoFlash المتحركة
            </p>
          </div>

          {/* حالة الأخطاء */}
          {errors.length > 0 && (
            <div className="bg-red-900 border border-red-700 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-red-300">❌ الأخطاء المكتشفة</h2>
                <button
                  onClick={clearErrors}
                  className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  مسح الأخطاء
                </button>
              </div>
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="bg-red-800 p-3 rounded text-red-200 text-sm font-mono">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* أزرار الاختبار */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={fetchBannerStats}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              🔄 تحديث الإحصائيات
            </button>
            <button
              onClick={testBannerPositions}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              🧪 اختبار المواضع
            </button>
            <button
              onClick={clearErrors}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              🧹 مسح الأخطاء
            </button>
          </div>

          {/* إحصائيات الإعلانات */}
          {!loading && bannerStats && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">📊 إحصائيات إعلانات TechnoFlash</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{bannerStats.length}</div>
                  <div className="text-gray-400 text-sm">إجمالي الإعلانات</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {bannerStats.filter((ad: any) => ad.is_active && !ad.is_paused).length}
                  </div>
                  <div className="text-gray-400 text-sm">نشطة وتعمل</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {bannerStats.filter((ad: any) => ad.is_paused).length}
                  </div>
                  <div className="text-gray-400 text-sm">مؤقفة</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {bannerStats.filter((ad: any) => !ad.is_active).length}
                  </div>
                  <div className="text-gray-400 text-sm">غير نشطة</div>
                </div>
              </div>

              <div className="space-y-3">
                {bannerStats.map((ad: any) => (
                  <div key={ad.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold">{ad.title}</h3>
                      <div className="flex space-x-2 space-x-reverse">
                        <span className={`px-2 py-1 rounded text-xs ${
                          ad.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                          {ad.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                        {ad.is_paused && (
                          <span className="px-2 py-1 rounded text-xs bg-yellow-900 text-yellow-300">
                            مؤقف
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">الموضع:</span>
                        <span className="text-white ml-2">{ad.position}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">الأولوية:</span>
                        <span className="text-primary ml-2">{ad.priority}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">المشاهدات:</span>
                        <span className="text-green-400 ml-2">{ad.view_count || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">النقرات:</span>
                        <span className="text-blue-400 ml-2">{ad.click_count || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* اختبار الإعلانات المباشر */}
          <div className="space-y-8">
            
            {/* إعلان الهيدر */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🔝 اختبار إعلان الهيدر</h2>
              <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                <TechnoFlashHeaderBanner />
              </div>
              <p className="text-gray-400 text-sm mt-2">
                يجب أن يظهر إعلان متحرك في الأعلى
              </p>
            </section>

            {/* إعلان المحتوى */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">📄 اختبار إعلان المحتوى</h2>
              <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                <TechnoFlashContentBanner />
              </div>
              <p className="text-gray-400 text-sm mt-2">
                يجب أن يظهر إعلان متحرك في الوسط
              </p>
            </section>

            {/* إعلان الفوتر */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🔻 اختبار إعلان الفوتر</h2>
              <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                <TechnoFlashFooterBanner />
              </div>
              <p className="text-gray-400 text-sm mt-2">
                يجب أن يظهر إعلان متحرك في الأسفل
              </p>
            </section>
          </div>

          {/* معلومات الإصلاح */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">🔧 معلومات الإصلاح</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">المشاكل المحلولة</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• إزالة استخدام .single() الذي يسبب أخطاء</li>
                  <li>• إضافة فحص is_paused في الاستعلام</li>
                  <li>• إضافة معالجة أفضل للأخطاء</li>
                  <li>• إضافة إعلانات افتراضية للمواضع المفقودة</li>
                  <li>• تحسين تسجيل المشاهدات والنقرات</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">الميزات الجديدة</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• إعلانات افتراضية عند عدم وجود إعلانات</li>
                  <li>• معالجة أفضل للحالات الاستثنائية</li>
                  <li>• تشخيص مفصل للأخطاء</li>
                  <li>• اختبار تفاعلي للمواضع</li>
                  <li>• مراقبة الأخطاء في الوقت الفعلي</li>
                </ul>
              </div>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="mt-8 text-center">
            <div className="space-x-4 space-x-reverse">
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                الصفحة الرئيسية
              </Link>
              <Link
                href="/test-techno-banner"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                اختبار الإعلانات الأصلي
              </Link>
              <Link
                href="/admin/ads"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                إدارة الإعلانات
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
