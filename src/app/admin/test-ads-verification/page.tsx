'use client';

import { useState, useEffect } from 'react';
import { getAllCodeInjections, type CodeInjection } from '@/lib/supabase-ads';

export default function AdsVerificationPage() {
  const [injections, setInjections] = useState<CodeInjection[]>([]);
  const [verificationResults, setVerificationResults] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInjections = async () => {
      try {
        const data = await getAllCodeInjections();
        setInjections(data.filter(inj => inj.enabled));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading injections:', error);
        setIsLoading(false);
      }
    };

    loadInjections();
  }, []);

  useEffect(() => {
    // Check for ad network verification every 2 seconds
    const interval = setInterval(() => {
      const results: {[key: string]: boolean} = {};
      
      injections.forEach(injection => {
        if (injection.name.toLowerCase().includes('monetag')) {
          // Monetag verification removed
          results[injection.id] = false;
        } else if (injection.name.toLowerCase().includes('google analytics')) {
          // Check for Google Analytics
          results[injection.id] = typeof (window as any).gtag === 'function';
        } else if (injection.name.toLowerCase().includes('meta pixel')) {
          // Check for Meta Pixel
          results[injection.id] = typeof (window as any).fbq === 'function';
        } else if (injection.name.toLowerCase().includes('adsense')) {
          // Check for AdSense
          results[injection.id] = typeof (window as any).adsbygoogle !== 'undefined';
        } else {
          // Generic check - look for script elements with injection data
          const scriptElements = document.querySelectorAll(`script[data-injection-id="${injection.id}"]`);
          results[injection.id] = scriptElements.length > 0;
        }
      });
      
      setVerificationResults(results);
    }, 2000);

    return () => clearInterval(interval);
  }, [injections]);

  const testAdNetwork = async (injection: CodeInjection) => {
    try {
      // Create a test script element
      const testScript = document.createElement('script');
      testScript.setAttribute('data-test-injection', injection.id);
      
      if (injection.code.includes('<script')) {
        const scriptContent = injection.code.replace(/<\/?script[^>]*>/g, '');
        testScript.innerHTML = scriptContent;
      } else {
        testScript.innerHTML = injection.code;
      }
      
      document.head.appendChild(testScript);
      
      // Wait a bit and check if it loaded
      setTimeout(() => {
        console.log(`Test script added for: ${injection.name}`);
      }, 1000);
      
    } catch (error) {
      console.error(`Error testing ${injection.name}:`, error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل اختبارات الإعلانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 اختبار والتحقق من الإعلانات</h1>
          <p className="text-gray-600 mb-6">
            هذه الصفحة تساعدك في التحقق من أن أكواد الإعلانات تعمل بشكل صحيح على الموقع
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">إجمالي حقن الكود</h3>
              <p className="text-2xl font-bold text-blue-600">{injections.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">يعمل بنجاح</h3>
              <p className="text-2xl font-bold text-green-600">
                {Object.values(verificationResults).filter(Boolean).length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900">لا يعمل</h3>
              <p className="text-2xl font-bold text-red-600">
                {Object.values(verificationResults).filter(v => !v).length}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {injections.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">لا توجد إعلانات مفعلة</h3>
              <p className="text-yellow-700">
                اذهب إلى <a href="/admin/ads" className="underline font-medium">لوحة إدارة الإعلانات</a> لإضافة إعلانات جديدة
              </p>
            </div>
          ) : (
            injections.map((injection) => {
              const isVerified = verificationResults[injection.id] || false;
              
              return (
                <div key={injection.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        isVerified ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <h3 className="text-lg font-semibold text-gray-900">{injection.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isVerified ? '✅ يعمل' : '❌ لا يعمل'}
                      </span>
                    </div>
                    <button
                      onClick={() => testAdNetwork(injection)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      🧪 اختبار
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">الموضع:</span>
                      <p className="text-gray-900">{injection.position}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">الأولوية:</span>
                      <p className="text-gray-900">{injection.priority}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">الصفحات:</span>
                      <p className="text-gray-900">{injection.pages.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">تاريخ الإنشاء:</span>
                      <p className="text-gray-900">
                        {new Date(injection.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded border">
                    <span className="text-sm font-medium text-gray-500 block mb-1">معاينة الكود:</span>
                    <pre className="text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap">
                      {injection.code.length > 300 
                        ? injection.code.substring(0, 300) + '...' 
                        : injection.code
                      }
                    </pre>
                  </div>
                  
                  {!isVerified && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded p-3">
                      <h4 className="font-medium text-red-800 mb-2">💡 نصائح لحل المشكلة:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• تأكد من صحة الكود المدخل</li>
                        <li>• تحقق من أن الموضع مناسب للكود</li>
                        <li>• تأكد من أن CSP يسمح بالدومين المطلوب</li>
                        <li>• جرب إعادة تحميل الصفحة</li>
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">🔧 أدوات التشخيص</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔄 إعادة تحميل الصفحة
            </button>
            <button
              onClick={() => {
                console.log('Current injections:', injections);
                console.log('Verification results:', verificationResults);
                console.log('All scripts:', document.querySelectorAll('script'));
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              🐛 طباعة معلومات التشخيص
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
