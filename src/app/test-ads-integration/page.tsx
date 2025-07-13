'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: string;
  position: string;
  is_active: boolean;
  view_count: number;
  click_count: number;
}

export default function TestAdsIntegrationPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

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

  const adsByPosition = ads.reduce((acc, ad) => {
    if (!acc[ad.position]) {
      acc[ad.position] = [];
    }
    acc[ad.position].push(ad);
    return acc;
  }, {} as Record<string, Advertisement[]>);

  const testPages = [
    {
      name: 'الصفحة الرئيسية',
      url: '/',
      description: 'إعلانات الهيدر والمحتوى والفوتر',
      positions: ['header', 'in-content', 'footer']
    },
    {
      name: 'قائمة المقالات',
      url: '/articles',
      description: 'إعلانات بين المقالات',
      positions: ['header', 'in-content', 'footer']
    },
    {
      name: 'مقال فردي',
      url: '/articles/test-article',
      description: 'إعلانات داخل المقال والشريط الجانبي',
      positions: ['article-body-start', 'article-body-mid', 'article-body-end', 'sidebar-right']
    },
    {
      name: 'أدوات الذكاء الاصطناعي',
      url: '/ai-tools',
      description: 'إعلانات في صفحة الأدوات',
      positions: ['header', 'in-content', 'footer']
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-white text-xl">جاري تحميل بيانات الإعلانات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار تكامل الإعلانات</h1>
            <p className="text-dark-text-secondary">
              اختبار عرض الإعلانات في جميع صفحات الموقع
            </p>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{ads.length}</div>
              <div className="text-gray-400 text-sm">إعلانات نشطة</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {Object.keys(adsByPosition).length}
              </div>
              <div className="text-gray-400 text-sm">مواضع مختلفة</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {ads.reduce((sum, ad) => sum + (ad.view_count || 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">إجمالي المشاهدات</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {ads.reduce((sum, ad) => sum + (ad.click_count || 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">إجمالي النقرات</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* صفحات الاختبار */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">صفحات الاختبار</h2>
              <div className="space-y-4">
                {testPages.map((page, index) => (
                  <div key={index} className="bg-dark-card rounded-xl p-6 border border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{page.name}</h3>
                        <p className="text-gray-400 text-sm mb-3">{page.description}</p>
                      </div>
                      <Link
                        href={page.url}
                        target="_blank"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                      >
                        اختبار
                      </Link>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">المواضع المتوقعة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {page.positions.map((position) => {
                          const adsInPosition = adsByPosition[position] || [];
                          return (
                            <span
                              key={position}
                              className={`px-2 py-1 rounded text-xs ${
                                adsInPosition.length > 0
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-red-900 text-red-300'
                              }`}
                            >
                              {position} ({adsInPosition.length})
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* الإعلانات حسب الموضع */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">الإعلانات حسب الموضع</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(adsByPosition).map(([position, positionAds]) => (
                  <div key={position} className="bg-dark-card rounded-xl p-4 border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {position} ({positionAds.length} إعلان)
                    </h3>
                    <div className="space-y-2">
                      {positionAds.map((ad) => (
                        <div key={ad.id} className="bg-gray-800 rounded-lg p-3">
                          <h4 className="text-white font-medium text-sm mb-1">{ad.title}</h4>
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>النوع: <span className="text-primary">{ad.type}</span></div>
                            <div>المشاهدات: <span className="text-green-400">{ad.view_count || 0}</span></div>
                            <div>النقرات: <span className="text-yellow-400">{ad.click_count || 0}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* تعليمات الاختبار */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">تعليمات الاختبار</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-300 mb-2">خطوات الاختبار:</h4>
                <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                  <li>انقر على "اختبار" بجانب كل صفحة</li>
                  <li>تحقق من ظهور الإعلانات في المواضع المحددة</li>
                  <li>اختبر النقر على الإعلانات</li>
                  <li>تحقق من تحديث الإحصائيات</li>
                  <li>اختبر على أجهزة مختلفة</li>
                </ol>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-300 mb-2">ما يجب ملاحظته:</h4>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  <li>سرعة تحميل الإعلانات</li>
                  <li>التصميم المتجاوب</li>
                  <li>عدم تأثير الإعلانات على التصميم</li>
                  <li>تسجيل المشاهدات والنقرات</li>
                  <li>عمل الإعلانات على الموبايل</li>
                </ul>
              </div>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
            <Link
              href="/admin/ads"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إدارة الإعلانات
            </Link>
            <Link
              href="/test-database-ads"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              اختبار قاعدة البيانات
            </Link>
            <Link
              href="/test-ads"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              اختبار AdSense
            </Link>
            <Link
              href="/test-dashboard"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              لوحة الاختبار
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
