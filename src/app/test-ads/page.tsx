'use client';

import { useState } from 'react';
import AdSenseAd, { InArticleAd, SidebarAd, BannerAd, MobileAd, DesktopAd } from '@/components/ads/AdSenseAd';
import SafeAdSense, { SafeBannerAd, SafeSidebarAd, SafeInArticleAd, SafeMobileAd, SafeDesktopAd } from '@/components/ads/SafeAdSense';
import SimpleAdSense, { SimpleBanner, SimpleSidebar, SimpleRectangle, SimpleMobile, SimpleDesktop } from '@/components/ads/SimpleAdSense';
import AdSenseDiagnostics from '@/components/ads/AdSenseDiagnostics';
import CustomAd from '@/components/ads/CustomAd';
import AdManager, { HeaderAd, FooterAd, SidebarAdManager, InArticleAdManager } from '@/components/ads/AdManager';

export default function TestAdsPage() {
  const [selectedDemo, setSelectedDemo] = useState<string>('all');

  const demoAds = [
    {
      id: 'demo-1',
      title: 'تطبيق TechnoFlash الجديد',
      description: 'اكتشف أحدث أدوات الذكاء الاصطناعي والتقنيات المتطورة',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      linkUrl: '#',
      type: 'banner' as const
    },
    {
      id: 'demo-2',
      title: 'دورة البرمجة المتقدمة',
      description: 'تعلم البرمجة من الصفر إلى الاحتراف مع خبراء المجال',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      linkUrl: '#',
      type: 'card' as const
    },
    {
      id: 'demo-3',
      title: '🚀 عرض خاص محدود!',
      description: 'خصم 50% على جميع الكورسات التقنية',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
      linkUrl: '#',
      type: 'animated' as const
    }
  ];

  const htmlAdExample = `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      border-radius: 12px;
      color: white;
      text-align: center;
      font-family: 'Tajawal', sans-serif;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    ">
      <h3 style="margin: 0 0 10px 0; font-size: 1.5rem;">إعلان HTML مخصص</h3>
      <p style="margin: 0 0 15px 0; opacity: 0.9;">هذا مثال على إعلان HTML مع CSS مخصص</p>
      <button style="
        background: white;
        color: #667eea;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        اضغط هنا
      </button>
    </div>
  `;

  const cssExample = `
    .custom-ad-demo {
      animation: customPulse 2s infinite;
    }
    
    @keyframes customPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
  `;

  const jsExample = `
    console.log('إعلان مخصص تم تحميله!');
    
    // إضافة تفاعل مخصص
    document.addEventListener('DOMContentLoaded', function() {
      const adElement = document.querySelector('.custom-ad-demo');
      if (adElement) {
        adElement.addEventListener('click', function() {
          alert('تم النقر على الإعلان المخصص!');
        });
      }
    });
  `;

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">اختبار نظام الإعلانات</h1>
            <p className="text-dark-text-secondary">
              اختبار جميع أنواع الإعلانات: AdSense، HTML مخصص، متحركة، ومتجاوبة
            </p>
          </div>

          {/* أزرار التحكم */}
          <div className="mb-8 flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedDemo('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDemo === 'all' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              جميع الإعلانات
            </button>
            <button
              onClick={() => setSelectedDemo('adsense')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDemo === 'adsense' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              AdSense
            </button>
            <button
              onClick={() => setSelectedDemo('custom')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDemo === 'custom' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              إعلانات مخصصة
            </button>
            <button
              onClick={() => setSelectedDemo('html')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDemo === 'html' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              HTML مخصص
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* المحتوى الرئيسي */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* إعلان الهيدر */}
              {(selectedDemo === 'all' || selectedDemo === 'adsense') && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">إعلان الهيدر (AdSense البسيط)</h2>
                  <SimpleBanner adSlot="1234567890" className="mb-4" />

                  <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">مقارنة الإصدارات:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-2">الإصدار البسيط (موصى به):</p>
                        <SimpleBanner adSlot="1234567890" className="mb-2" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-2">الإصدار المتقدم:</p>
                        <SafeBannerAd adSlot="1234567890" className="mb-2" />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* إعلانات مخصصة */}
              {(selectedDemo === 'all' || selectedDemo === 'custom') && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">الإعلانات المخصصة</h2>
                  <div className="space-y-6">
                    {demoAds.map((ad) => (
                      <CustomAd
                        key={ad.id}
                        id={ad.id}
                        title={ad.title}
                        description={ad.description}
                        imageUrl={ad.imageUrl}
                        linkUrl={ad.linkUrl}
                        type={ad.type}
                        size="large"
                        animation="fade"
                        showCloseButton={true}
                        onClick={() => console.log(`تم النقر على ${ad.title}`)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* إعلان HTML مخصص */}
              {(selectedDemo === 'all' || selectedDemo === 'html') && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">إعلان HTML مخصص</h2>
                  <CustomAd
                    id="html-demo"
                    type="html"
                    htmlContent={htmlAdExample}
                    cssStyles={cssExample}
                    jsCode={jsExample}
                    className="custom-ad-demo"
                  />
                </section>
              )}

              {/* محتوى تجريبي مع إعلانات داخلية */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">مقال تجريبي مع إعلانات</h2>
                <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    مستقبل الذكاء الاصطناعي في التكنولوجيا
                  </h3>
                  
                  <p className="text-gray-300 mb-4">
                    يشهد عالم التكنولوجيا تطوراً مستمراً في مجال الذكاء الاصطناعي، حيث تتنوع التطبيقات 
                    والاستخدامات بشكل يومي. من المساعدات الذكية إلى السيارات ذاتية القيادة...
                  </p>

                  {/* إعلان داخل المقال */}
                  {(selectedDemo === 'all' || selectedDemo === 'adsense') && (
                    <SafeInArticleAd adSlot="1234567893" />
                  )}

                  <p className="text-gray-300 mb-4">
                    تستمر الشركات التقنية الكبرى في الاستثمار بمليارات الدولارات في أبحاث الذكاء الاصطناعي، 
                    مما يعد بمستقبل مليء بالابتكارات والحلول الذكية...
                  </p>

                  <p className="text-gray-300">
                    من المتوقع أن نشهد في السنوات القادمة تطورات جذرية في كيفية تفاعلنا مع التكنولوجيا، 
                    وكيف ستساعدنا في حل المشاكل المعقدة وتحسين جودة الحياة.
                  </p>
                </div>
              </section>

              {/* إعلانات الموبايل والديسكتوب */}
              {(selectedDemo === 'all' || selectedDemo === 'adsense') && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">إعلانات متجاوبة آمنة</h2>
                  <SafeMobileAd adSlot="1234567895" />
                  <SafeDesktopAd adSlot="1234567896" />
                </section>
              )}

              {/* إعلان الفوتر */}
              {(selectedDemo === 'all' || selectedDemo === 'adsense') && (
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">إعلان الفوتر الآمن</h2>
                  <SafeBannerAd adSlot="1234567891" />
                </section>
              )}
            </div>

            {/* الشريط الجانبي */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                <h2 className="text-xl font-semibold text-white">الشريط الجانبي</h2>
                
                {/* إعلانات الشريط الجانبي */}
                {(selectedDemo === 'all' || selectedDemo === 'adsense') && (
                  <>
                    <SafeSidebarAd adSlot="1234567892" />
                    <SidebarAdManager />
                  </>
                )}

                {/* معلومات الاختبار */}
                <div className="bg-dark-card rounded-xl p-4 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">معلومات الاختبار</h3>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>• <strong>AdSense:</strong> إعلانات Google</p>
                    <p>• <strong>مخصص:</strong> إعلانات بتصميم خاص</p>
                    <p>• <strong>HTML:</strong> إعلانات بكود مخصص</p>
                    <p>• <strong>متجاوب:</strong> يتكيف مع الشاشة</p>
                    <p>• <strong>متحرك:</strong> مع تأثيرات بصرية</p>
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
                    <a href="/test-dashboard" className="block text-primary hover:text-primary/80 text-sm">
                      لوحة الاختبار
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* مكون التشخيص */}
      {process.env.NODE_ENV === 'development' && (
        <AdSenseDiagnostics />
      )}
    </div>
  );
}
