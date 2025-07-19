'use client';

import { useEffect, useState } from 'react';
import DirectMonetagAd, { MonetagTest, MonetagBanner, MonetagSidebar, MonetagInContent } from '@/components/ads/DirectMonetagAd';

export default function TestAdsPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      setLogs(prev => [...prev, `LOG: ${args.join(' ')}`]);
      originalLog(...args);
    };

    console.error = (...args) => {
      setLogs(prev => [...prev, `ERROR: ${args.join(' ')}`]);
      originalError(...args);
    };

    // Test Monetag setup
    setTimeout(() => {
      console.log('=== Monetag Test Started ===');
      
      // Check meta tag
      const metaTag = document.querySelector('meta[name="monetag"]');
      console.log('Meta tag found:', !!metaTag);
      if (metaTag) {
        console.log('Meta content:', metaTag.getAttribute('content'));
      }

      // Check scripts
      const scripts = document.querySelectorAll('script');
      const monetagScripts = Array.from(scripts).filter(script => 
        script.innerHTML.includes('vemtoutcheeg.com')
      );
      console.log('Monetag scripts found:', monetagScripts.length);

      // Check ad containers
      const adContainers = document.querySelectorAll('[data-zone-id]');
      console.log('Ad containers found:', adContainers.length);

      console.log('=== Monetag Test Completed ===');
    }, 2000);

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const testDirectScript = () => {
    try {
      // Test direct script execution
      const script = document.createElement('script');
      script.innerHTML = `
        console.log('Testing direct Monetag script...');
        (function(d,z,s){
          s.src='https://'+d+'/400/'+z;
          try{
            (document.body||document.documentElement).appendChild(s);
            console.log('Monetag script executed successfully for zone: ' + z);
          }catch(e){
            console.error('Monetag script error:', e);
          }
        })('vemtoutcheeg.com',9593378,document.createElement('script'));
      `;
      document.body.appendChild(script);
    } catch (error) {
      console.error('Failed to execute test script:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">اختبار إعلانات Monetag</h1>
          <p className="text-gray-600">صفحة اختبار لفحص عمل إعلانات Monetag</p>
          
          <div className="mt-4 flex gap-4">
            <button
              onClick={testDirectScript}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              اختبار Script مباشر
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>

        {/* Test Component */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">مكون الاختبار الشامل</h2>
          <MonetagTest />
        </div>

        {/* Individual Ad Tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">إعلان Banner (Zone: 9593378)</h3>
            <MonetagBanner />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">إعلان Sidebar (Zone: 9593331)</h3>
            <MonetagSidebar />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">إعلان In-Content</h3>
          <MonetagInContent />
        </div>

        {/* Custom Zone Test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">اختبار Zone مخصص</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DirectMonetagAd zoneId="9593378" />
            <DirectMonetagAd zoneId="9593331" />
          </div>
        </div>

        {/* Console Logs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">سجل وحدة التحكم</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">لا توجد رسائل بعد...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            مسح السجل
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">تعليمات الاختبار</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-2">
            <li>افتح Developer Tools (اضغط F12)</li>
            <li>اذهب إلى تبويب Console</li>
            <li>ابحث عن رسائل Monetag</li>
            <li>تحقق من وجود أخطاء في Network tab</li>
            <li>تأكد من تحميل scripts من vemtoutcheeg.com</li>
          </ol>
          
          <div className="mt-4 p-4 bg-blue-100 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">ما يجب أن تراه:</h4>
            <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
              <li>رسالة "Monetag scripts loaded" في Console</li>
              <li>طلبات HTTP إلى vemtoutcheeg.com في Network</li>
              <li>عناصر script جديدة في DOM</li>
              <li>إعلانات تظهر في المساحات المخصصة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
