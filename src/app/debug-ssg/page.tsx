'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DebugSSGPage() {
  const [envVars, setEnvVars] = useState<any>(null);
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // فحص متغيرات البيئة
    const checkEnvVars = () => {
      const vars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'غير محدد',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'محدد' : 'غير محدد',
        SUPABASE_SERVICE_ROLE_KEY: 'غير متاح في العميل',
        NODE_ENV: process.env.NODE_ENV || 'غير محدد',
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'غير محدد'
      };
      setEnvVars(vars);
    };

    checkEnvVars();
  }, []);

  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      console.log('🔄 Testing Supabase connection...');
      
      // اختبار اتصال المقالات
      const articlesResponse = await fetch('/api/test-articles');
      const articlesResult = await articlesResponse.json();
      
      // اختبار اتصال أدوات AI
      const aiToolsResponse = await fetch('/api/test-ai-tools');
      const aiToolsResult = await aiToolsResponse.json();

      setConnectionTest({
        articles: {
          status: articlesResponse.ok ? 'نجح' : 'فشل',
          count: articlesResult.count || 0,
          error: articlesResult.error || null
        },
        aiTools: {
          status: aiToolsResponse.ok ? 'نجح' : 'فشل',
          count: aiToolsResult.count || 0,
          error: aiToolsResult.error || null
        },
        timestamp: new Date().toISOString()
      });

      console.log('✅ Connection test completed');
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      setConnectionTest({
        articles: { status: 'خطأ', count: 0, error: (error as Error).message },
        aiTools: { status: 'خطأ', count: 0, error: (error as Error).message },
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testSSGBuild = async () => {
    try {
      console.log('🔄 Testing SSG build...');
      
      // محاولة جلب البيانات مباشرة
      const response = await fetch('/api/test-ssg-build');
      const result = await response.json();
      
      console.log('SSG Build Test Result:', result);
      alert('تم اختبار SSG - راجع Console للتفاصيل');
    } catch (error) {
      console.error('❌ SSG build test failed:', error);
      alert('فشل اختبار SSG: ' + (error as Error).message);
    }
  };

  const clearCache = async () => {
    try {
      // محاولة مسح cache المتصفح
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Browser cache cleared');
      }
      
      // إعادة تحميل الصفحة
      window.location.reload();
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
      alert('فشل في مسح Cache');
    }
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🔧 تشخيص مشاكل SSG
            </h1>
            <p className="text-dark-text-secondary text-lg">
              تشخيص وإصلاح مشاكل Static Site Generation
            </p>
          </div>

          {/* متغيرات البيئة */}
          {envVars && (
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">🌍 متغيرات البيئة</h2>
              
              <div className="space-y-3">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{key}</span>
                      <span className={`font-semibold ${
                        value === 'غير محدد' || value === 'غير متاح في العميل' 
                          ? 'text-red-400' 
                          : 'text-green-400'
                      }`}>
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* اختبار الاتصال */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">🔗 اختبار اتصال Supabase</h2>
              <button
                onClick={testSupabaseConnection}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {loading ? 'جاري الاختبار...' : 'اختبار الاتصال'}
              </button>
            </div>

            {connectionTest && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">📄 المقالات</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">الحالة:</span>
                      <span className={`font-semibold ${
                        connectionTest.articles.status === 'نجح' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {connectionTest.articles.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">العدد:</span>
                      <span className="text-white">{connectionTest.articles.count}</span>
                    </div>
                    {connectionTest.articles.error && (
                      <div className="text-red-400 text-xs mt-2">
                        {connectionTest.articles.error}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">🤖 أدوات AI</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">الحالة:</span>
                      <span className={`font-semibold ${
                        connectionTest.aiTools.status === 'نجح' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {connectionTest.aiTools.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">العدد:</span>
                      <span className="text-white">{connectionTest.aiTools.count}</span>
                    </div>
                    {connectionTest.aiTools.error && (
                      <div className="text-red-400 text-xs mt-2">
                        {connectionTest.aiTools.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* أدوات التشخيص */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">🧪 أدوات التشخيص</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={testSSGBuild}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
              >
                🔨 اختبار بناء SSG
              </button>
              
              <button
                onClick={clearCache}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg transition-colors"
              >
                🧹 مسح Cache
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
              >
                🔄 إعادة تحميل
              </button>
            </div>
          </div>

          {/* معلومات التشخيص */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">📋 دليل التشخيص</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-3">المشاكل الشائعة</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• متغيرات البيئة غير محددة</li>
                  <li>• Service Role Key مفقود</li>
                  <li>• خطأ في اتصال Supabase</li>
                  <li>• جداول قاعدة البيانات فارغة</li>
                  <li>• مشاكل في صلاحيات RLS</li>
                  <li>• خطأ في تكوين next.config.js</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3">خطوات الإصلاح</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>1. تحقق من ملف .env.local</li>
                  <li>2. تأكد من صحة Supabase URLs</li>
                  <li>3. اختبر اتصال قاعدة البيانات</li>
                  <li>4. تحقق من وجود البيانات</li>
                  <li>5. راجع إعدادات RLS</li>
                  <li>6. أعد بناء المشروع</li>
                </ul>
              </div>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="bg-yellow-900 border border-yellow-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">⚠️ ملاحظات مهمة</h2>
            
            <div className="text-yellow-100 space-y-3 text-sm">
              <p>
                <strong>Service Role Key:</strong> مطلوب لبناء SSG في الإنتاج. 
                تأكد من إضافته في متغيرات البيئة على Vercel.
              </p>
              <p>
                <strong>RLS Policies:</strong> تأكد من أن سياسات الأمان تسمح بقراءة البيانات 
                للمستخدمين غير المسجلين للمحتوى العام.
              </p>
              <p>
                <strong>ISR:</strong> إذا كانت البيانات لا تتحدث، تحقق من إعدادات revalidate 
                وتأكد من أن الصفحات تُبنى بشكل صحيح.
              </p>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">🔗 روابط مفيدة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/test-ssg"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">🚀 اختبار SSG</h4>
                <p className="text-gray-400 text-sm">اختبار الأداء والبناء</p>
              </Link>

              <Link
                href="/test-dashboard"
                className="bg-dark-card rounded-lg p-4 border border-gray-800 hover:border-primary/50 transition-colors"
              >
                <h4 className="text-white font-semibold mb-2">🧪 لوحة الاختبار</h4>
                <p className="text-gray-400 text-sm">جميع أدوات الاختبار</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
