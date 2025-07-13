'use client';

import { useState, useEffect } from 'react';
import { TechnoFlashHeaderBanner, TechnoFlashFooterBanner, TechnoFlashContentBanner } from '@/components/ads/TechnoFlashBanner';
import { AutoAIToolStartAd, AutoAIToolMidAd, AutoAIToolEndAd } from '@/components/ads/AutoAIToolAds';
import Link from 'next/link';

export default function MobileTestPage() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  useEffect(() => {
    // جمع معلومات الجهاز
    const getDeviceInfo = () => {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        touchSupport: 'ontouchstart' in window,
        orientation: window.screen.orientation?.type || 'unknown'
      };
      setDeviceInfo(info);
    };

    // جمع معلومات الشبكة
    const getNetworkInfo = () => {
      const info = {
        currentUrl: window.location.href,
        hostname: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol,
        localIP: 'يتطلب فحص يدوي'
      };
      setNetworkInfo(info);
    };

    getDeviceInfo();
    getNetworkInfo();

    // تحديث معلومات الجهاز عند تغيير الاتجاه
    const handleResize = () => {
      setDeviceInfo((prev: any) => ({
        ...prev,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        orientation: window.screen.orientation?.type || 'unknown'
      }));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('تم نسخ النص إلى الحافظة');
    }).catch(() => {
      alert('فشل في نسخ النص');
    });
  };

  const testResponsiveness = () => {
    const tests = [
      { name: 'شاشة صغيرة (320px)', width: 320 },
      { name: 'شاشة متوسطة (768px)', width: 768 },
      { name: 'شاشة كبيرة (1024px)', width: 1024 }
    ];

    tests.forEach((test, index) => {
      setTimeout(() => {
        if (window.innerWidth !== test.width) {
          alert(`اختبر الموقع على عرض ${test.width}px للتأكد من التجاوب`);
        }
      }, index * 1000);
    });
  };

  return (
    <div className="min-h-screen bg-dark-background">
      {/* إعلان الهيدر */}
      <TechnoFlashHeaderBanner />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* رأس الصفحة */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              📱 اختبار الموبايل
            </h1>
            <p className="text-dark-text-secondary text-lg">
              صفحة مخصصة لاختبار الموقع على الأجهزة المحمولة
            </p>
          </div>

          {/* معلومات الاتصال */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">🌐 معلومات الاتصال</h2>
            
            {networkInfo && (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">للوصول من الموبايل:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">الرابط الحالي:</span>
                      <button
                        onClick={() => copyToClipboard(networkInfo.currentUrl)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        نسخ
                      </button>
                    </div>
                    <div className="bg-gray-900 p-3 rounded text-green-400 text-sm font-mono break-all">
                      {networkInfo.currentUrl}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-300 mb-3">📋 خطوات الاتصال من الموبايل:</h3>
                  <ol className="text-yellow-100 space-y-2 text-sm">
                    <li>1. تأكد أن الموبايل والكمبيوتر على نفس الشبكة (WiFi)</li>
                    <li>2. احصل على IP Address الكمبيوتر:</li>
                    <li className="ml-4">• Windows: اكتب <code className="bg-gray-800 px-2 py-1 rounded">ipconfig</code> في Command Prompt</li>
                    <li className="ml-4">• Mac: اكتب <code className="bg-gray-800 px-2 py-1 rounded">ifconfig</code> في Terminal</li>
                    <li>3. ابحث عن IP يبدأ بـ 192.168.x.x أو 10.x.x.x</li>
                    <li>4. افتح المتصفح في الموبايل واكتب: <code className="bg-gray-800 px-2 py-1 rounded">http://[IP]:3000</code></li>
                    <li>5. مثال: <code className="bg-gray-800 px-2 py-1 rounded">http://192.168.1.100:3000</code></li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* معلومات الجهاز */}
          {deviceInfo && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">📱 معلومات الجهاز</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">نوع الجهاز</div>
                    <div className="text-white font-semibold">
                      {deviceInfo.touchSupport ? '📱 جهاز لمسي' : '🖥️ جهاز سطح مكتب'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">دقة الشاشة</div>
                    <div className="text-white font-semibold">
                      {deviceInfo.screenWidth} × {deviceInfo.screenHeight}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">حجم النافذة</div>
                    <div className="text-white font-semibold">
                      {deviceInfo.windowWidth} × {deviceInfo.windowHeight}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">اتجاه الشاشة</div>
                    <div className="text-white font-semibold">
                      {deviceInfo.orientation}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">نسبة البكسل</div>
                    <div className="text-white font-semibold">
                      {deviceInfo.devicePixelRatio}x
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">حالة الاتصال</div>
                    <div className={`font-semibold ${deviceInfo.onLine ? 'text-green-400' : 'text-red-400'}`}>
                      {deviceInfo.onLine ? '🟢 متصل' : '🔴 غير متصل'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* اختبار الإعلانات على الموبايل */}
          <div className="space-y-8">
            
            {/* إعلان بداية المحتوى */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🚀 إعلان بداية المحتوى</h2>
              <AutoAIToolStartAd 
                toolName="ChatGPT"
                toolCategory="معالجة النصوص"
                className="mb-4"
              />
            </section>

            {/* إعلان TechnoFlash وسط المحتوى */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">⭐ إعلان TechnoFlash المتحرك</h2>
              <TechnoFlashContentBanner className="mb-4" />
            </section>

            {/* إعلان وسط المحتوى */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">💡 إعلان وسط المحتوى</h2>
              <AutoAIToolMidAd 
                toolName="ChatGPT"
                toolCategory="معالجة النصوص"
                className="mb-4"
              />
            </section>

            {/* محتوى تجريبي */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">📄 محتوى تجريبي</h2>
              <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <p className="text-gray-300 mb-4">
                  هذا نص تجريبي لاختبار كيفية ظهور المحتوى على الأجهزة المحمولة. 
                  يجب أن يكون النص واضحاً وسهل القراءة على جميع أحجام الشاشات.
                </p>
                <p className="text-gray-300 mb-4">
                  تأكد من أن الإعلانات تظهر بشكل صحيح وأنها لا تؤثر على تجربة القراءة.
                  يجب أن تكون الإعلانات متجاوبة ومناسبة لحجم الشاشة.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <h3 className="text-primary font-semibold mb-2">ميزة 1</h3>
                    <p className="text-gray-300 text-sm">وصف الميزة الأولى</p>
                  </div>
                  <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                    <h3 className="text-blue-400 font-semibold mb-2">ميزة 2</h3>
                    <p className="text-gray-300 text-sm">وصف الميزة الثانية</p>
                  </div>
                </div>
              </div>
            </section>

            {/* إعلان نهاية المحتوى */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">🎯 إعلان نهاية المحتوى</h2>
              <AutoAIToolEndAd 
                toolName="ChatGPT"
                toolCategory="معالجة النصوص"
                className="mb-4"
              />
            </section>
          </div>

          {/* أزرار الاختبار */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={testResponsiveness}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🧪 اختبار التجاوب
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🔄 إعادة تحميل
            </button>
          </div>

          {/* روابط سريعة */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">🔗 روابط للاختبار</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">🏠 الصفحة الرئيسية</h4>
                <p className="text-gray-400 text-sm">اختبار الصفحة الرئيسية</p>
              </Link>

              <Link
                href="/articles"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">📄 المقالات</h4>
                <p className="text-gray-400 text-sm">اختبار صفحة المقالات</p>
              </Link>

              <Link
                href="/ai-tools"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">🤖 أدوات AI</h4>
                <p className="text-gray-400 text-sm">اختبار صفحة الأدوات</p>
              </Link>

              <Link
                href="/ai-tools/chatgpt"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">💬 ChatGPT</h4>
                <p className="text-gray-400 text-sm">اختبار صفحة أداة فردية</p>
              </Link>

              <Link
                href="/test-dashboard"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">🧪 لوحة الاختبار</h4>
                <p className="text-gray-400 text-sm">جميع أدوات الاختبار</p>
              </Link>

              <Link
                href="/admin/ads"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">⚙️ إدارة الإعلانات</h4>
                <p className="text-gray-400 text-sm">لوحة تحكم الإعلانات</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* إعلان الفوتر */}
      <TechnoFlashFooterBanner />
    </div>
  );
}
