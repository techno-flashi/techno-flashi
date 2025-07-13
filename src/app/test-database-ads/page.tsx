'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdManager, { 
  HeaderAd, 
  FooterAd, 
  SidebarAdManager, 
  ArticleStartAd, 
  ArticleMiddleAd, 
  ArticleEndAd, 
  InContentAd 
} from '@/components/ads/AdManager';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: string;
  position: string;
  is_active: boolean;
  view_count: number;
  click_count: number;
  created_at: string;
}

export default function TestDatabaseAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');

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

  const positions = [
    'all',
    'header',
    'footer', 
    'sidebar-right',
    'article-body-start',
    'article-body-mid',
    'article-body-end',
    'in-content'
  ];

  const positionNames: Record<string, string> = {
    'all': 'جميع المواضع',
    'header': 'الهيدر',
    'footer': 'الفوتر',
    'sidebar-right': 'الشريط الجانبي',
    'article-body-start': 'بداية المقال',
    'article-body-mid': 'وسط المقال',
    'article-body-end': 'نهاية المقال',
    'in-content': 'داخل المحتوى'
  };

  const filteredAds = selectedPosition === 'all' 
    ? ads 
    : ads.filter(ad => ad.position === selectedPosition);

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
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار إعلانات قاعدة البيانات</h1>
            <p className="text-dark-text-secondary">
              عرض الإعلانات المحفوظة في قاعدة البيانات واختبار عملها
            </p>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{ads.length}</div>
              <div className="text-gray-400 text-sm">إجمالي الإعلانات</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {ads.filter(ad => ad.is_active).length}
              </div>
              <div className="text-gray-400 text-sm">إعلانات نشطة</div>
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

          {/* فلاتر المواضع */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">تصفية حسب الموضع</h2>
            <div className="flex flex-wrap gap-2">
              {positions.map(position => (
                <button
                  key={position}
                  onClick={() => setSelectedPosition(position)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedPosition === position
                      ? 'bg-primary text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {positionNames[position]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* المحتوى الرئيسي */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* إعلان الهيدر */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">إعلان الهيدر</h2>
                <HeaderAd />
              </section>

              {/* إعلان بداية المقال */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">إعلان بداية المقال</h2>
                <ArticleStartAd />
              </section>

              {/* محتوى تجريبي */}
              <section>
                <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    مقال تجريبي مع إعلانات
                  </h3>
                  
                  <p className="text-gray-300 mb-4">
                    هذا نص تجريبي لمحاكاة مقال حقيقي. يتم عرض الإعلانات في مواضع مختلفة 
                    داخل المحتوى لاختبار كيفية ظهورها وتفاعلها مع النص.
                  </p>

                  {/* إعلان وسط المقال */}
                  <ArticleMiddleAd />

                  <p className="text-gray-300 mb-4">
                    يستمر المحتوى هنا بعد الإعلان. هذا يساعد في فهم كيفية تدفق المحتوى 
                    مع الإعلانات وضمان عدم تأثيرها على تجربة القراءة.
                  </p>

                  {/* إعلان داخل المحتوى */}
                  <InContentAd />

                  <p className="text-gray-300">
                    النص الختامي للمقال. هنا يمكن أن نضع خلاصة أو استنتاجات المقال 
                    قبل عرض إعلان نهاية المقال.
                  </p>
                </div>
              </section>

              {/* إعلان نهاية المقال */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">إعلان نهاية المقال</h2>
                <ArticleEndAd />
              </section>

              {/* إعلان الفوتر */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">إعلان الفوتر</h2>
                <FooterAd />
              </section>
            </div>

            {/* الشريط الجانبي */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                <h2 className="text-xl font-semibold text-white">الشريط الجانبي</h2>
                
                {/* إعلانات الشريط الجانبي */}
                <SidebarAdManager />

                {/* قائمة الإعلانات */}
                <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    الإعلانات المتاحة ({filteredAds.length})
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredAds.map((ad) => (
                      <div key={ad.id} className="bg-gray-800 rounded-lg p-3">
                        <h4 className="text-white font-medium text-sm mb-1">
                          {ad.title}
                        </h4>
                        <div className="text-xs text-gray-400 space-y-1">
                          <div>النوع: <span className="text-primary">{ad.type}</span></div>
                          <div>الموضع: <span className="text-primary">{positionNames[ad.position] || ad.position}</span></div>
                          <div>المشاهدات: <span className="text-green-400">{ad.view_count || 0}</span></div>
                          <div>النقرات: <span className="text-yellow-400">{ad.click_count || 0}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* روابط سريعة */}
                <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">روابط سريعة</h3>
                  <div className="space-y-2">
                    <a href="/admin/ads" className="block text-primary hover:text-primary/80 text-sm">
                      إدارة الإعلانات
                    </a>
                    <a href="/admin/ads/new" className="block text-primary hover:text-primary/80 text-sm">
                      إضافة إعلان جديد
                    </a>
                    <a href="/test-ads" className="block text-primary hover:text-primary/80 text-sm">
                      اختبار إعلانات AdSense
                    </a>
                    <a href="/test-dashboard" className="block text-primary hover:text-primary/80 text-sm">
                      لوحة الاختبار
                    </a>
                  </div>
                </div>

                {/* معلومات تقنية */}
                <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">معلومات تقنية</h3>
                  <div className="text-xs text-gray-300 space-y-1">
                    <p>• الإعلانات محملة من قاعدة البيانات</p>
                    <p>• يتم تتبع المشاهدات والنقرات</p>
                    <p>• دعم جميع أنواع الإعلانات</p>
                    <p>• تصفية حسب الموضع والحالة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
