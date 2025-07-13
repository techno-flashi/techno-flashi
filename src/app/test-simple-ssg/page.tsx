import { supabase } from '@/lib/supabase';
import { getAllArticlesForSSG, getAllAIToolsForSSG } from '@/lib/ssg';
import Link from 'next/link';

// إعدادات SSG
export const revalidate = 86400; // 24 ساعة
export const dynamic = 'force-static';

async function testSSGFunctions() {
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    articles: {
      ssg: { count: 0, error: null, success: false },
      runtime: { count: 0, error: null, success: false }
    },
    aiTools: {
      ssg: { count: 0, error: null, success: false },
      runtime: { count: 0, error: null, success: false }
    }
  };

  // اختبار SSG للمقالات
  try {
    console.log('🔄 Testing SSG articles...');
    const ssgArticles = await getAllArticlesForSSG();
    results.articles.ssg = {
      count: ssgArticles.length,
      error: null,
      success: true
    };
    console.log(`✅ SSG Articles: ${ssgArticles.length}`);
  } catch (error) {
    console.error('❌ SSG Articles failed:', error);
    results.articles.ssg = {
      count: 0,
      error: (error as Error).message,
      success: false
    };
  }

  // اختبار Runtime للمقالات
  try {
    console.log('🔄 Testing runtime articles...');
    const { data: runtimeArticles, error } = await supabase
      .from('articles')
      .select('id, title, slug, status')
      .eq('status', 'published')
      .limit(10);

    if (error) throw error;

    results.articles.runtime = {
      count: runtimeArticles?.length || 0,
      error: null,
      success: true
    };
    console.log(`✅ Runtime Articles: ${runtimeArticles?.length || 0}`);
  } catch (error) {
    console.error('❌ Runtime Articles failed:', error);
    results.articles.runtime = {
      count: 0,
      error: (error as Error).message,
      success: false
    };
  }

  // اختبار SSG لأدوات AI
  try {
    console.log('🔄 Testing SSG AI tools...');
    const ssgAITools = await getAllAIToolsForSSG();
    results.aiTools.ssg = {
      count: ssgAITools.length,
      error: null,
      success: true
    };
    console.log(`✅ SSG AI Tools: ${ssgAITools.length}`);
  } catch (error) {
    console.error('❌ SSG AI Tools failed:', error);
    results.aiTools.ssg = {
      count: 0,
      error: (error as Error).message,
      success: false
    };
  }

  // اختبار Runtime لأدوات AI
  try {
    console.log('🔄 Testing runtime AI tools...');
    const { data: runtimeAITools, error } = await supabase
      .from('ai_tools')
      .select('id, name, slug, status')
      .in('status', ['published', 'active'])
      .limit(10);

    if (error) throw error;

    results.aiTools.runtime = {
      count: runtimeAITools?.length || 0,
      error: null,
      success: true
    };
    console.log(`✅ Runtime AI Tools: ${runtimeAITools?.length || 0}`);
  } catch (error) {
    console.error('❌ Runtime AI Tools failed:', error);
    results.aiTools.runtime = {
      count: 0,
      error: (error as Error).message,
      success: false
    };
  }

  return results;
}

export default async function TestSimpleSSGPage() {
  const testResults = await testSSGFunctions();

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* رأس الصفحة */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              🧪 اختبار SSG مبسط
            </h1>
            <p className="text-dark-text-secondary">
              اختبار مباشر لوظائف SSG مقابل Runtime
            </p>
            <div className="text-sm text-gray-500 mt-2">
              تم البناء في: {testResults.timestamp}
            </div>
          </div>

          {/* معلومات البيئة */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">🌍 بيئة التشغيل</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-sm">NODE_ENV</div>
                <div className={`font-semibold ${
                  testResults.environment.nodeEnv === 'production' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {testResults.environment.nodeEnv}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-sm">Supabase URL</div>
                <div className={`font-semibold ${
                  testResults.environment.hasSupabaseUrl ? 'text-green-400' : 'text-red-400'
                }`}>
                  {testResults.environment.hasSupabaseUrl ? '✅' : '❌'}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-sm">Anon Key</div>
                <div className={`font-semibold ${
                  testResults.environment.hasAnonKey ? 'text-green-400' : 'text-red-400'
                }`}>
                  {testResults.environment.hasAnonKey ? '✅' : '❌'}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-gray-400 text-sm">Service Key</div>
                <div className={`font-semibold ${
                  testResults.environment.hasServiceKey ? 'text-green-400' : 'text-red-400'
                }`}>
                  {testResults.environment.hasServiceKey ? '✅' : '❌'}
                </div>
              </div>
            </div>
          </div>

          {/* نتائج اختبار المقالات */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">📄 اختبار المقالات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SSG */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">SSG</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">الحالة:</span>
                    <span className={`font-semibold ${
                      testResults.articles.ssg.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {testResults.articles.ssg.success ? '✅ نجح' : '❌ فشل'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">العدد:</span>
                    <span className="text-white font-semibold">
                      {testResults.articles.ssg.count}
                    </span>
                  </div>
                  {testResults.articles.ssg.error && (
                    <div className="text-red-400 text-xs mt-2 p-2 bg-red-900 rounded">
                      {testResults.articles.ssg.error}
                    </div>
                  )}
                </div>
              </div>

              {/* Runtime */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Runtime</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">الحالة:</span>
                    <span className={`font-semibold ${
                      testResults.articles.runtime.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {testResults.articles.runtime.success ? '✅ نجح' : '❌ فشل'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">العدد:</span>
                    <span className="text-white font-semibold">
                      {testResults.articles.runtime.count}
                    </span>
                  </div>
                  {testResults.articles.runtime.error && (
                    <div className="text-red-400 text-xs mt-2 p-2 bg-red-900 rounded">
                      {testResults.articles.runtime.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* نتائج اختبار أدوات AI */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">🤖 اختبار أدوات AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SSG */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">SSG</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">الحالة:</span>
                    <span className={`font-semibold ${
                      testResults.aiTools.ssg.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {testResults.aiTools.ssg.success ? '✅ نجح' : '❌ فشل'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">العدد:</span>
                    <span className="text-white font-semibold">
                      {testResults.aiTools.ssg.count}
                    </span>
                  </div>
                  {testResults.aiTools.ssg.error && (
                    <div className="text-red-400 text-xs mt-2 p-2 bg-red-900 rounded">
                      {testResults.aiTools.ssg.error}
                    </div>
                  )}
                </div>
              </div>

              {/* Runtime */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Runtime</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">الحالة:</span>
                    <span className={`font-semibold ${
                      testResults.aiTools.runtime.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {testResults.aiTools.runtime.success ? '✅ نجح' : '❌ فشل'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">العدد:</span>
                    <span className="text-white font-semibold">
                      {testResults.aiTools.runtime.count}
                    </span>
                  </div>
                  {testResults.aiTools.runtime.error && (
                    <div className="text-red-400 text-xs mt-2 p-2 bg-red-900 rounded">
                      {testResults.aiTools.runtime.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* التشخيص */}
          <div className="bg-yellow-900 border border-yellow-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">🔍 التشخيص</h2>
            <div className="text-yellow-100 space-y-2 text-sm">
              {!testResults.environment.hasServiceKey && (
                <p>⚠️ <strong>Service Role Key مفقود:</strong> قد يؤثر على SSG في الإنتاج</p>
              )}
              {!testResults.articles.ssg.success && testResults.articles.runtime.success && (
                <p>⚠️ <strong>SSG للمقالات فاشل:</strong> يتم استخدام Runtime كـ fallback</p>
              )}
              {!testResults.aiTools.ssg.success && testResults.aiTools.runtime.success && (
                <p>⚠️ <strong>SSG لأدوات AI فاشل:</strong> يتم استخدام Runtime كـ fallback</p>
              )}
              {testResults.articles.ssg.success && testResults.aiTools.ssg.success && (
                <p>✅ <strong>SSG يعمل بشكل صحيح:</strong> جميع البيانات تُجلب من SSG</p>
              )}
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="text-center">
            <div className="space-x-4 space-x-reverse">
              <Link
                href="/debug-ssg"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                تشخيص SSG
              </Link>
              <Link
                href="/test-ssg"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                اختبار SSG كامل
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
