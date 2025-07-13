'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TechnoFlashHeaderBanner, TechnoFlashFooterBanner, TechnoFlashContentBanner } from '@/components/ads/TechnoFlashBanner';
import Link from 'next/link';

export default function TestTechnoBannerPage() {
  const [bannerStats, setBannerStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBannerStats();
  }, []);

  const fetchBannerStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .like('title', '%حصري متحرك%')
        .eq('is_active', true);

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

  const refreshStats = () => {
    fetchBannerStats();
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🚀 اختبار الإعلان المتحرك الحصري
            </h1>
            <p className="text-dark-text-secondary text-lg">
              اختبار الإعلان المتحرك من تكنوفلاش في جميع المواضع
            </p>
          </div>

          {/* إحصائيات الإعلانات */}
          {!loading && bannerStats && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">📊 إحصائيات الإعلانات المتحركة</h2>
                <button
                  onClick={refreshStats}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  تحديث الإحصائيات
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{bannerStats.length}</div>
                  <div className="text-gray-400 text-sm">إجمالي الإعلانات</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {bannerStats.reduce((sum: number, ad: any) => sum + (ad.view_count || 0), 0)}
                  </div>
                  <div className="text-gray-400 text-sm">إجمالي المشاهدات</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {bannerStats.reduce((sum: number, ad: any) => sum + (ad.click_count || 0), 0)}
                  </div>
                  <div className="text-gray-400 text-sm">إجمالي النقرات</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {bannerStats.reduce((sum: number, ad: any) => sum + (ad.view_count || 0), 0) > 0 
                      ? ((bannerStats.reduce((sum: number, ad: any) => sum + (ad.click_count || 0), 0) / 
                          bannerStats.reduce((sum: number, ad: any) => sum + (ad.view_count || 0), 0)) * 100).toFixed(1)
                      : '0.0'
                    }%
                  </div>
                  <div className="text-gray-400 text-sm">معدل النقر</div>
                </div>
              </div>
            </div>
          )}

          {/* اختبار الإعلانات في مواضع مختلفة */}
          <div className="space-y-12">
            
            {/* إعلان الهيدر */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🔝 إعلان الهيدر</h2>
              <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                <TechnoFlashHeaderBanner />
              </div>
              <p className="text-gray-400 text-sm mt-2">
                يظهر في أعلى جميع صفحات الموقع
              </p>
            </section>

            {/* إعلان المحتوى */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">📄 إعلان المحتوى</h2>
              <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                <TechnoFlashContentBanner />
              </div>
              <p className="text-gray-400 text-sm mt-2">
                يظهر في وسط المقالات وصفحات الأدوات
              </p>
            </section>

            {/* إعلان الفوتر */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🔻 إعلان الفوتر</h2>
              <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                <TechnoFlashFooterBanner />
              </div>
              <p className="text-gray-400 text-sm mt-2">
                يظهر في أسفل جميع صفحات الموقع
              </p>
            </section>

            {/* إعلانات ثابتة للمقارنة */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">⚡ إعلانات ثابتة (للمقارنة)</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">إعلان هيدر ثابت</h3>
                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 rounded-lg text-center">
                    🎯 إعلان ثابت - تكنوفلاش يقدم أفضل المحتوى التقني! 💻
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">إعلان محتوى ثابت</h3>
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg text-center">
                    ✨ تعلم الذكاء الاصطناعي مع تكنوفلاش - دورات متقدمة وشهادات معتمدة! 🎓
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">إعلان فوتر ثابت</h3>
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-lg text-center">
                    🔥 عروض حصرية من تكنوفلاش - لا تفوت الفرصة! انضم الآن واحصل على خصم 50% 💰
                  </div>
                </div>
              </div>
            </section>

            {/* تفاصيل تقنية */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">⚙️ التفاصيل التقنية</h2>
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">المميزات</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• تأثير متحرك بـ CSS Animation</li>
                      <li>• تصميم متجاوب لجميع الأجهزة</li>
                      <li>• تتبع المشاهدات والنقرات</li>
                      <li>• توقف الحركة عند المرور بالماوس</li>
                      <li>• تأثيرات بصرية متقدمة</li>
                      <li>• تحميل من قاعدة البيانات</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">المواضع</h3>
                    <ul className="text-gray-300 space-y-2">
                      <li>• <strong>Header:</strong> أعلى كل صفحة</li>
                      <li>• <strong>Footer:</strong> أسفل كل صفحة</li>
                      <li>• <strong>Content:</strong> وسط المقالات والأدوات</li>
                      <li>• <strong>Homepage:</strong> الصفحة الرئيسية</li>
                      <li>• <strong>Articles:</strong> صفحات المقالات</li>
                      <li>• <strong>AI Tools:</strong> صفحات الأدوات</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* كود الإعلان */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">💻 الكود المستخدم</h2>
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-3">HTML</h3>
                <pre className="bg-gray-900 p-4 rounded-lg text-green-400 text-sm overflow-x-auto mb-4">
{`<div style="width: 100%; background: #111; color: #fff; padding: 10px 0; overflow: hidden; position: relative;">
    <div style="display: inline-block; white-space: nowrap; animation: slide-left 10s linear infinite; font-size: 20px; font-weight: bold; color: #FFD700;">
        📢 اعلان حصري من تكنوفلاش - عروض مميزة لفترة محدودة! 🚀
    </div>
</div>`}
                </pre>

                <h3 className="text-lg font-semibold text-white mb-3">CSS</h3>
                <pre className="bg-gray-900 p-4 rounded-lg text-blue-400 text-sm overflow-x-auto">
{`@keyframes slide-left {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
}`}
                </pre>
              </div>
            </section>

            {/* تفاصيل الإعلانات */}
            {!loading && bannerStats && bannerStats.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">📋 تفاصيل الإعلانات</h2>
                <div className="space-y-4">
                  {bannerStats.map((ad: any, index: number) => (
                    <div key={ad.id} className="bg-dark-card rounded-xl p-4 border border-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white">{ad.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${ad.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                          {ad.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">الموضع:</span>
                          <span className="text-white ml-2">{ad.position}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">المشاهدات:</span>
                          <span className="text-green-400 ml-2">{ad.view_count || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">النقرات:</span>
                          <span className="text-blue-400 ml-2">{ad.click_count || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">الأولوية:</span>
                          <span className="text-yellow-400 ml-2">{ad.priority}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* روابط سريعة */}
          <div className="mt-12 text-center">
            <div className="space-x-4 space-x-reverse">
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                الصفحة الرئيسية
              </Link>
              <Link
                href="/articles"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                المقالات
              </Link>
              <Link
                href="/ai-tools"
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                أدوات AI
              </Link>
              <Link
                href="/admin/ads"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
