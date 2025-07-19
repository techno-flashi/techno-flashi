'use client';

import { useState, useEffect } from 'react';
import { getAds, getAdsForPage, trackAdPerformance, initializeAdsSystem } from '@/lib/supabase-ads';
import SupabaseAdManager from './SupabaseAdManager';

export default function SupabaseAdTester() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'checking' | 'ready' | 'error'>('checking');

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const initialized = await initializeAdsSystem();
      setSystemStatus(initialized ? 'ready' : 'error');
    } catch (error) {
      console.error('Error checking system status:', error);
      setSystemStatus('error');
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results: any[] = [];

    // Test 1: Database Connection
    try {
      const ads = await getAds();
      results.push({
        test: 'Database Connection',
        status: 'success',
        message: `Connected successfully. Found ${ads.length} ads.`,
        data: ads
      });
    } catch (error) {
      results.push({
        test: 'Database Connection',
        status: 'error',
        message: `Connection failed: ${error}`,
        data: null
      });
    }

    // Test 2: Get Ads for Homepage
    try {
      const homeAds = await getAdsForPage('/', 'header');
      results.push({
        test: 'Get Homepage Header Ads',
        status: 'success',
        message: `Found ${homeAds.length} header ads for homepage.`,
        data: homeAds
      });
    } catch (error) {
      results.push({
        test: 'Get Homepage Header Ads',
        status: 'error',
        message: `Failed: ${error}`,
        data: null
      });
    }

    // Test 3: Get Ads for Articles
    try {
      const articleAds = await getAdsForPage('/articles/test', 'sidebar');
      results.push({
        test: 'Get Article Sidebar Ads',
        status: 'success',
        message: `Found ${articleAds.length} sidebar ads for articles.`,
        data: articleAds
      });
    } catch (error) {
      results.push({
        test: 'Get Article Sidebar Ads',
        status: 'error',
        message: `Failed: ${error}`,
        data: null
      });
    }

    // Test 4: Track Performance
    try {
      const ads = await getAds();
      if (ads.length > 0) {
        await trackAdPerformance(ads[0].id, 'load', '/test-page', 'Test User Agent');
        results.push({
          test: 'Track Ad Performance',
          status: 'success',
          message: `Successfully tracked performance for ad: ${ads[0].name}`,
          data: { adId: ads[0].id, event: 'load' }
        });
      } else {
        results.push({
          test: 'Track Ad Performance',
          status: 'warning',
          message: 'No ads available to test performance tracking.',
          data: null
        });
      }
    } catch (error) {
      results.push({
        test: 'Track Ad Performance',
        status: 'error',
        message: `Failed: ${error}`,
        data: null
      });
    }

    // Test 5: CSP Check
    try {
      const testScript = document.createElement('script');
      testScript.src = 'https://vemtoutcheeg.com/test.js';
      testScript.onload = () => {
        results.push({
          test: 'CSP Check',
          status: 'success',
          message: 'CSP allows loading from vemtoutcheeg.com',
          data: null
        });
      };
      testScript.onerror = () => {
        results.push({
          test: 'CSP Check',
          status: 'warning',
          message: 'CSP may be blocking vemtoutcheeg.com (or test file not found)',
          data: null
        });
      };
      document.head.appendChild(testScript);
      
      // Remove test script after 2 seconds
      setTimeout(() => {
        document.head.removeChild(testScript);
      }, 2000);
    } catch (error) {
      results.push({
        test: 'CSP Check',
        status: 'error',
        message: `CSP test failed: ${error}`,
        data: null
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-800 bg-green-100 border-green-200';
      case 'error': return 'text-red-800 bg-red-100 border-red-200';
      case 'warning': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '🔍';
    }
  };

  if (systemStatus === 'checking') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-blue-800">🔍 فحص حالة النظام...</div>
      </div>
    );
  }

  if (systemStatus === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 mb-2">❌ النظام غير مُعد</div>
        <p className="text-red-700 text-sm">
          يجب إعداد قاعدة البيانات أولاً. اذهب إلى <a href="/admin/setup-ads" className="underline">صفحة الإعداد</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">🧪 اختبار نظام الإعلانات</h3>
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? '⏳ جاري الاختبار...' : '🚀 تشغيل الاختبارات'}
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          سيتم اختبار: الاتصال بقاعدة البيانات، جلب الإعلانات، تتبع الأداء، وCSP.
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-4">📊 نتائج الاختبارات</h4>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className={`border rounded-lg p-3 ${getStatusColor(result.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {getStatusIcon(result.status)} {result.test}
                  </span>
                  <span className="text-xs uppercase font-medium">
                    {result.status}
                  </span>
                </div>
                <div className="text-sm">{result.message}</div>
                {result.data && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer">عرض التفاصيل</summary>
                    <pre className="text-xs bg-black text-green-400 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Ad Test */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-4">🎯 اختبار الإعلانات المباشر</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="font-medium mb-2">Header Ad (Homepage):</h5>
            <SupabaseAdManager 
              position="header" 
              currentPage="/" 
              showDebug={true}
              className="border-2 border-dashed border-blue-300"
            />
          </div>

          <div>
            <h5 className="font-medium mb-2">Sidebar Ad (Articles):</h5>
            <SupabaseAdManager 
              position="sidebar" 
              currentPage="/articles/test" 
              showDebug={true}
              className="border-2 border-dashed border-green-300"
            />
          </div>

          <div>
            <h5 className="font-medium mb-2">In-Content Ad:</h5>
            <SupabaseAdManager 
              position="in-content" 
              currentPage="/" 
              showDebug={true}
              className="border-2 border-dashed border-purple-300"
            />
          </div>
        </div>
      </div>

      {/* Console Logs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-4">📝 تعليمات الاختبار</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>1. افتح Developer Tools (F12) وانتقل إلى Console</p>
          <p>2. شغل الاختبارات وراقب الرسائل في Console</p>
          <p>3. تحقق من تحميل scripts من vemtoutcheeg.com في Network tab</p>
          <p>4. تأكد من ظهور الإعلانات في المساحات المخصصة أعلاه</p>
          <p>5. اضغط على الإعلانات لاختبار تتبع النقرات</p>
        </div>
      </div>
    </div>
  );
}
