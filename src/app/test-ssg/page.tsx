'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestSSGPage() {
  const [buildInfo, setBuildInfo] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  useEffect(() => {
    // جمع معلومات البناء
    const getBuildInfo = () => {
      const info = {
        buildTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        isSSG: typeof window !== 'undefined' ? 'Client-side' : 'Server-side',
        revalidateTime: process.env.NEXT_PUBLIC_REVALIDATE_TIME || '86400',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        nodeEnv: process.env.NODE_ENV || 'development'
      };
      setBuildInfo(info);
    };

    // قياس الأداء
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const metrics = {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: 0,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0
        };

        // First Paint
        const paintEntries = performance.getEntriesByType('paint');
        const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fpEntry) metrics.firstPaint = fpEntry.startTime;
        if (fcpEntry) metrics.firstContentfulPaint = fcpEntry.startTime;

        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
          try {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              if (lastEntry) {
                metrics.largestContentfulPaint = lastEntry.startTime;
                setPerformanceMetrics({...metrics});
              }
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
          } catch (error) {
            console.log('LCP measurement not supported');
          }
        }

        setPerformanceMetrics(metrics);
      }
    };

    getBuildInfo();
    measurePerformance();
  }, []);

  const testSSGEndpoints = async () => {
    const endpoints = [
      '/api/articles',
      '/api/ai-tools',
      '/sitemap.xml',
      '/robots.txt'
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const startTime = performance.now();
        const response = await fetch(endpoint);
        const endTime = performance.now();
        
        results.push({
          endpoint,
          status: response.status,
          responseTime: Math.round(endTime - startTime),
          size: response.headers.get('content-length') || 'Unknown',
          cacheControl: response.headers.get('cache-control') || 'None'
        });
      } catch (error) {
        results.push({
          endpoint,
          status: 'Error',
          responseTime: 0,
          size: 'Error',
          cacheControl: 'Error',
          error: (error as Error).message
        });
      }
    }

    console.log('SSG Endpoints Test Results:', results);
    alert('تم اختبار endpoints - راجع Console للتفاصيل');
  };

  const testStaticPages = () => {
    const staticPages = [
      '/',
      '/articles',
      '/ai-tools',
      '/articles/no-code-guide-for-beginners-2025',
      '/ai-tools/chatgpt'
    ];

    staticPages.forEach((page, index) => {
      setTimeout(() => {
        window.open(page, '_blank');
      }, index * 1000);
    });
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🚀 اختبار Static Site Generation (SSG)
            </h1>
            <p className="text-dark-text-secondary text-lg">
              اختبار وتحليل أداء الموقع الثابت مع Incremental Static Regeneration
            </p>
          </div>

          {/* معلومات البناء */}
          {buildInfo && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">📊 معلومات البناء</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">وقت البناء</div>
                    <div className="text-white font-semibold">
                      {new Date(buildInfo.buildTime).toLocaleString('ar-SA')}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">نوع التشغيل</div>
                    <div className="text-white font-semibold">
                      {buildInfo.isSSG}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">وقت إعادة التحقق (ISR)</div>
                    <div className="text-white font-semibold">
                      {Math.round(parseInt(buildInfo.revalidateTime) / 3600)} ساعة
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">رابط الموقع</div>
                    <div className="text-white font-semibold break-all">
                      {buildInfo.siteUrl}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">بيئة التشغيل</div>
                    <div className={`font-semibold ${
                      buildInfo.nodeEnv === 'production' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {buildInfo.nodeEnv}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 text-sm">المتصفح</div>
                    <div className="text-white font-semibold text-xs">
                      {buildInfo.userAgent.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* مقاييس الأداء */}
          {performanceMetrics && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">⚡ مقاييس الأداء</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {Math.round(performanceMetrics.firstContentfulPaint)}ms
                  </div>
                  <div className="text-green-200 text-sm">First Contentful Paint</div>
                </div>
                
                <div className="bg-blue-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {Math.round(performanceMetrics.domContentLoaded)}ms
                  </div>
                  <div className="text-blue-200 text-sm">DOM Content Loaded</div>
                </div>
                
                <div className="bg-purple-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {Math.round(performanceMetrics.loadComplete)}ms
                  </div>
                  <div className="text-purple-200 text-sm">Load Complete</div>
                </div>
              </div>

              {performanceMetrics.largestContentfulPaint > 0 && (
                <div className="mt-4 bg-orange-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {Math.round(performanceMetrics.largestContentfulPaint)}ms
                  </div>
                  <div className="text-orange-200 text-sm">Largest Contentful Paint</div>
                </div>
              )}
            </div>
          )}

          {/* اختبارات SSG */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">🧪 اختبارات SSG</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={testSSGEndpoints}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
              >
                🔗 اختبار API Endpoints
              </button>
              
              <button
                onClick={testStaticPages}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
              >
                📄 اختبار الصفحات الثابتة
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
              >
                🔄 إعادة تحميل
              </button>
            </div>
          </div>

          {/* معلومات SSG */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">📚 معلومات SSG</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3">الميزات المطبقة</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Static Site Generation للمقالات وأدوات AI</li>
                  <li>• Incremental Static Regeneration كل 24 ساعة</li>
                  <li>• generateStaticParams للصفحات الديناميكية</li>
                  <li>• تحسين الأداء مع force-static</li>
                  <li>• Cache headers محسنة</li>
                  <li>• Fallback للبيانات الديناميكية</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">الفوائد المحققة</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• تحميل أسرع للصفحات</li>
                  <li>• تقليل استهلاك الخادم</li>
                  <li>• تحسين SEO</li>
                  <li>• تجربة مستخدم أفضل</li>
                  <li>• توفير في التكاليف</li>
                  <li>• استقرار أعلى</li>
                </ul>
              </div>
            </div>
          </div>

          {/* إعدادات ISR */}
          <div className="bg-yellow-900 border border-yellow-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">⚙️ إعدادات ISR</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-800 rounded-lg p-4">
                <h3 className="text-yellow-200 font-semibold mb-2">وقت إعادة التحقق</h3>
                <p className="text-yellow-100 text-sm">
                  24 ساعة (86400 ثانية) - يتم تحديث المحتوى تلقائياً كل يوم
                </p>
              </div>
              
              <div className="bg-yellow-800 rounded-lg p-4">
                <h3 className="text-yellow-200 font-semibold mb-2">نوع التوليد</h3>
                <p className="text-yellow-100 text-sm">
                  force-static - جميع الصفحات يتم توليدها كصفحات ثابتة
                </p>
              </div>
              
              <div className="bg-yellow-800 rounded-lg p-4">
                <h3 className="text-yellow-200 font-semibold mb-2">المعاملات الديناميكية</h3>
                <p className="text-yellow-100 text-sm">
                  dynamicParams: true - يمكن إضافة صفحات جديدة تلقائياً
                </p>
              </div>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">🔗 روابط للاختبار</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">🏠 الصفحة الرئيسية</h4>
                <p className="text-gray-400 text-sm">اختبار SSG للصفحة الرئيسية</p>
              </Link>

              <Link
                href="/articles"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">📄 قائمة المقالات</h4>
                <p className="text-gray-400 text-sm">اختبار SSG لصفحة المقالات</p>
              </Link>

              <Link
                href="/ai-tools"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">🤖 قائمة أدوات AI</h4>
                <p className="text-gray-400 text-sm">اختبار SSG لصفحة الأدوات</p>
              </Link>

              <Link
                href="/test-dashboard"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">🧪 لوحة الاختبار</h4>
                <p className="text-gray-400 text-sm">جميع أدوات الاختبار</p>
              </Link>

              <Link
                href="/seo-diagnosis"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">🔍 تشخيص SEO</h4>
                <p className="text-gray-400 text-sm">اختبار تحسين محركات البحث</p>
              </Link>

              <Link
                href="/mobile-test"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">📱 اختبار الموبايل</h4>
                <p className="text-gray-400 text-sm">اختبار التجاوب والأداء</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
