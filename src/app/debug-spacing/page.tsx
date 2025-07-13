'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import SpacingDebugger, { AdDebugger } from '@/components/debug/SpacingDebugger';

export default function DebugSpacingPage() {
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
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching ad stats:', error);
        return;
      }

      // تجميع الإحصائيات حسب الموضع
      const positionStats = data?.reduce((acc: any, ad) => {
        if (!acc[ad.position]) {
          acc[ad.position] = {
            count: 0,
            totalViews: 0,
            totalClicks: 0,
            ads: []
          };
        }
        acc[ad.position].count++;
        acc[ad.position].totalViews += ad.view_count || 0;
        acc[ad.position].totalClicks += ad.click_count || 0;
        acc[ad.position].ads.push(ad);
        return acc;
      }, {});

      setAdStats({
        total: data?.length || 0,
        byPosition: positionStats || {},
        allAds: data || []
      });
    } catch (error) {
      console.error('Error in fetchAdStats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🔍 تشخيص المساحات والإعلانات
            </h1>
            <p className="text-dark-text-secondary text-lg">
              أداة تشخيص شاملة لاكتشاف المساحات الفارغة ومشاكل الإعلانات
            </p>
          </div>

          {/* إحصائيات الإعلانات */}
          {!loading && adStats && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">📊 إحصائيات الإعلانات</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{adStats.total}</div>
                  <div className="text-gray-400 text-sm">إجمالي الإعلانات النشطة</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {Object.keys(adStats.byPosition).length}
                  </div>
                  <div className="text-gray-400 text-sm">مواضع مختلفة</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {adStats.allAds.reduce((sum: number, ad: any) => sum + (ad.view_count || 0), 0)}
                  </div>
                  <div className="text-gray-400 text-sm">إجمالي المشاهدات</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {adStats.allAds.reduce((sum: number, ad: any) => sum + (ad.click_count || 0), 0)}
                  </div>
                  <div className="text-gray-400 text-sm">إجمالي النقرات</div>
                </div>
              </div>

              {/* الإعلانات حسب الموضع */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">الإعلانات حسب الموضع</h3>
                <div className="space-y-3">
                  {Object.entries(adStats.byPosition).map(([position, stats]: [string, any]) => (
                    <div key={position} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-white font-semibold">{position}</h4>
                        <span className="text-primary font-bold">{stats.count} إعلان</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">المشاهدات:</span>
                          <span className="text-green-400 ml-2">{stats.totalViews}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">النقرات:</span>
                          <span className="text-blue-400 ml-2">{stats.totalClicks}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">معدل النقر:</span>
                          <span className="text-yellow-400 ml-2">
                            {stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(1) : '0.0'}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* أمثلة للاختبار */}
          <div className="space-y-8">
            
            {/* مثال على مساحة فارغة */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🚨 أمثلة على المشاكل الشائعة</h2>
              
              <div className="space-y-6">
                {/* مساحة فارغة */}
                <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">1. مساحة فارغة</h3>
                  <div className="mb-4"></div> {/* عنصر فارغ */}
                  <p className="text-gray-300">هذا مثال على عنصر فارغ يأخذ مساحة بدون محتوى</p>
                </div>

                {/* margin كبير */}
                <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">2. Margin كبير</h3>
                  <div className="mb-8 bg-gray-700 p-4 rounded">
                    عنصر بـ margin كبير (mb-8)
                  </div>
                  <p className="text-gray-300">هذا مثال على عنصر بـ margin كبير قد يسبب مساحات غير مرغوبة</p>
                </div>

                {/* padding كبير */}
                <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">3. Padding كبير</h3>
                  <div className="py-8 bg-gray-700 rounded text-center">
                    عنصر بـ padding كبير (py-8)
                  </div>
                  <p className="text-gray-300 mt-4">هذا مثال على عنصر بـ padding كبير</p>
                </div>

                {/* إعلان وهمي */}
                <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">4. إعلان اختبار</h3>
                  <div className="smart-ad-container bg-primary/10 border border-primary rounded-lg p-4">
                    <div className="text-center text-primary font-bold">
                      📢 هذا إعلان اختبار
                    </div>
                  </div>
                  <p className="text-gray-300 mt-4">هذا مثال على إعلان يجب أن يظهر بوضوح في أدوات التشخيص</p>
                </div>

                {/* ارتفاع محدد */}
                <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">5. ارتفاع محدد</h3>
                  <div style={{ height: '100px' }} className="bg-gray-700 rounded flex items-center justify-center">
                    عنصر بارتفاع محدد (100px)
                  </div>
                  <p className="text-gray-300 mt-4">هذا مثال على عنصر بارتفاع محدد بـ style</p>
                </div>
              </div>
            </section>

            {/* دليل الاستخدام */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">📖 دليل استخدام أدوات التشخيص</h2>
              
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">🔍 تشخيص المساحات</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• <span className="text-red-400">أحمر:</span> جميع العناصر</li>
                      <li>• <span className="text-yellow-400">أصفر:</span> عناصر فارغة</li>
                      <li>• <span className="text-orange-400">برتقالي:</span> margin كبير</li>
                      <li>• <span className="text-purple-400">بنفسجي:</span> padding كبير</li>
                      <li>• <span className="text-lime-400">أخضر فاتح:</span> مكونات إعلانات</li>
                      <li>• <span className="text-cyan-400">سماوي:</span> ارتفاع محدد</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">📢 تشخيص الإعلانات</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• <span className="text-lime-400">أخضر:</span> إعلانات نشطة</li>
                      <li>• <span className="text-red-400">أحمر:</span> إعلانات فارغة</li>
                      <li>• تسميات واضحة لكل إعلان</li>
                      <li>• تمييز المواضع المختلفة</li>
                      <li>• عرض حالة الإعلان</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* روابط الاختبار */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🔗 صفحات للاختبار</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href="/articles/no-code-guide-for-beginners-2025"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">صفحة مقال</h3>
                  <p className="text-gray-400 text-sm">اختبار المساحات في صفحة مقال فردي</p>
                </Link>

                <Link
                  href="/ai-tools/chatgpt"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">صفحة أداة AI</h3>
                  <p className="text-gray-400 text-sm">اختبار المساحات في صفحة أداة ذكية</p>
                </Link>

                <Link
                  href="/"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">الصفحة الرئيسية</h3>
                  <p className="text-gray-400 text-sm">اختبار المساحات في الصفحة الرئيسية</p>
                </Link>

                <Link
                  href="/articles"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">قائمة المقالات</h3>
                  <p className="text-gray-400 text-sm">اختبار المساحات في صفحة المقالات</p>
                </Link>

                <Link
                  href="/ai-tools"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">قائمة أدوات AI</h3>
                  <p className="text-gray-400 text-sm">اختبار المساحات في صفحة الأدوات</p>
                </Link>

                <Link
                  href="/test-dashboard"
                  className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-white font-semibold mb-2">لوحة الاختبار</h3>
                  <p className="text-gray-400 text-sm">الوصول لجميع أدوات الاختبار</p>
                </Link>
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
