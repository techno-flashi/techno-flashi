'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdItem from '@/components/ads/AdItem';
import ResponsiveAd, { 
  ResponsiveHeaderAd, 
  ResponsiveSidebarAd, 
  ResponsiveInContentAd,
  MobileBannerAd,
  DesktopBannerAd
} from '@/components/ads/ResponsiveAd';
import SafeHTMLAd from '@/components/ads/SafeHTMLAd';

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: string;
  position: string;
  is_active: boolean;
  view_count: number;
  click_count: number;
  target_url?: string;
  image_url?: string;
  video_url?: string;
  custom_css?: string;
  custom_js?: string;
}

export default function ComprehensiveAdsTestPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    totalAds: 0,
    successfulAds: 0
  });

  useEffect(() => {
    fetchAds();
    measurePerformance();
  }, []);

  const fetchAds = async () => {
    const startTime = performance.now();
    
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

      const loadTime = performance.now() - startTime;
      setAds(data || []);
      setPerformanceMetrics(prev => ({
        ...prev,
        loadTime,
        totalAds: data?.length || 0,
        successfulAds: data?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const measurePerformance = () => {
    const startTime = performance.now();
    
    // قياس وقت الرندر
    requestAnimationFrame(() => {
      const renderTime = performance.now() - startTime;
      setPerformanceMetrics(prev => ({
        ...prev,
        renderTime
      }));
    });
  };

  const adTypes = ['all', 'text', 'image', 'video', 'html', 'banner', 'adsense'];
  const filteredAds = selectedType === 'all' 
    ? ads 
    : ads.filter(ad => ad.type === selectedType);

  const getDeviceClass = () => {
    switch (deviceView) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      case 'desktop':
        return 'max-w-7xl mx-auto';
      default:
        return 'max-w-7xl mx-auto';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white text-xl">جاري تحميل الإعلانات...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className={getDeviceClass()}>
          {/* رأس الصفحة */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار الإعلانات الشامل</h1>
            <p className="text-dark-text-secondary">
              اختبار جميع أنواع الإعلانات والتجاوب مع الأجهزة المختلفة
            </p>
          </div>

          {/* أدوات التحكم */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* فلتر نوع الإعلان */}
              <div>
                <label className="block text-white font-medium mb-2">نوع الإعلان:</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600"
                >
                  {adTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'جميع الأنواع' : type.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* محاكي الجهاز */}
              <div>
                <label className="block text-white font-medium mb-2">محاكي الجهاز:</label>
                <div className="flex space-x-2 space-x-reverse">
                  {(['mobile', 'tablet', 'desktop'] as const).map(device => (
                    <button
                      key={device}
                      onClick={() => setDeviceView(device)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        deviceView === device
                          ? 'bg-primary text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {device === 'mobile' ? '📱' : device === 'tablet' ? '📱' : '💻'} {device}
                    </button>
                  ))}
                </div>
              </div>

              {/* إحصائيات الأداء */}
              <div>
                <label className="block text-white font-medium mb-2">الأداء:</label>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>تحميل: {performanceMetrics.loadTime.toFixed(2)}ms</div>
                  <div>رندر: {performanceMetrics.renderTime.toFixed(2)}ms</div>
                  <div>الإعلانات: {performanceMetrics.successfulAds}/{performanceMetrics.totalAds}</div>
                </div>
              </div>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{filteredAds.length}</div>
              <div className="text-gray-400 text-sm">إعلانات متاحة</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {new Set(filteredAds.map(ad => ad.type)).size}
              </div>
              <div className="text-gray-400 text-sm">أنواع مختلفة</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {filteredAds.reduce((sum, ad) => sum + (ad.view_count || 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">إجمالي المشاهدات</div>
            </div>
            <div className="bg-dark-card rounded-xl p-4 border border-gray-800 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {filteredAds.reduce((sum, ad) => sum + (ad.click_count || 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">إجمالي النقرات</div>
            </div>
          </div>

          {/* عرض الإعلانات */}
          <div className="space-y-8">
            {/* إعلان هيدر متجاوب */}
            {filteredAds.find(ad => ad.position === 'header') && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">إعلان الهيدر (متجاوب)</h2>
                <ResponsiveHeaderAd ad={filteredAds.find(ad => ad.position === 'header')!} />
              </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* المحتوى الرئيسي */}
              <div className="lg:col-span-3 space-y-8">
                {/* إعلانات المحتوى */}
                {filteredAds
                  .filter(ad => ['article-body-start', 'article-body-mid', 'article-body-end', 'in-content'].includes(ad.position))
                  .map((ad, index) => (
                    <section key={ad.id}>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {ad.title} ({ad.type.toUpperCase()})
                      </h3>
                      <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                        <ResponsiveInContentAd ad={ad} />
                        
                        {/* معلومات الإعلان */}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">النوع:</span>
                              <span className="text-white ml-2">{ad.type}</span>
                            </div>
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
                              <span className="text-yellow-400 ml-2">{ad.click_count || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}

                {/* محتوى تجريبي */}
                <section>
                  <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">محتوى تجريبي</h3>
                    <p className="text-gray-300 mb-4">
                      هذا نص تجريبي لمحاكاة محتوى حقيقي. يساعد في اختبار كيفية ظهور الإعلانات 
                      وتفاعلها مع المحتوى الفعلي للموقع.
                    </p>
                    <p className="text-gray-300">
                      يمكنك استخدام هذه الصفحة لاختبار جميع أنواع الإعلانات والتأكد من 
                      عملها بشكل صحيح على جميع الأجهزة.
                    </p>
                  </div>
                </section>
              </div>

              {/* الشريط الجانبي */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">الشريط الجانبي</h2>
                  
                  {/* إعلانات الشريط الجانبي */}
                  {filteredAds
                    .filter(ad => ad.position === 'sidebar-right')
                    .map(ad => (
                      <div key={ad.id}>
                        <h3 className="text-sm font-medium text-gray-300 mb-2">{ad.title}</h3>
                        <ResponsiveSidebarAd ad={ad} />
                      </div>
                    ))}

                  {/* معلومات الاختبار */}
                  <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-3">معلومات الاختبار</h3>
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>• اختبر التجاوب بتغيير حجم النافذة</p>
                      <p>• جرب أنواع الإعلانات المختلفة</p>
                      <p>• تحقق من سرعة التحميل</p>
                      <p>• اختبر النقر على الإعلانات</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* إعلان الفوتر */}
            {filteredAds.find(ad => ad.position === 'footer') && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">إعلان الفوتر</h2>
                <ResponsiveInContentAd ad={filteredAds.find(ad => ad.position === 'footer')!} />
              </section>
            )}
          </div>

          {/* إعلان موبايل ثابت */}
          {filteredAds.find(ad => ad.type === 'banner') && (
            <MobileBannerAd ad={filteredAds.find(ad => ad.type === 'banner')!} />
          )}

          {/* روابط سريعة */}
          <div className="mt-12 text-center">
            <div className="space-x-4 space-x-reverse">
              <a
                href="/admin/ads"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                إدارة الإعلانات
              </a>
              <a
                href="/test-ads-integration"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                اختبار التكامل
              </a>
              <a
                href="/test-dashboard"
                className="inline-block px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                لوحة الاختبار
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
