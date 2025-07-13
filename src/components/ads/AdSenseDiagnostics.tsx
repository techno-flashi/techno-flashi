'use client';

import { useState, useEffect } from 'react';
import { ClientOnlyContent } from '@/components/HydrationSafeWrapper';

interface AdSenseDiagnosticsProps {
  className?: string;
}

/**
 * مكون تشخيص AdSense لمساعدة المطورين
 */
export default function AdSenseDiagnostics({ className = '' }: AdSenseDiagnosticsProps) {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const runDiagnostics = () => {
      if (typeof window === 'undefined') return;

      const results = {
        timestamp: new Date().toLocaleString('ar-SA'),
        adsbygoogle: {
          exists: !!window.adsbygoogle,
          isArray: Array.isArray(window.adsbygoogle),
          length: window.adsbygoogle?.length || 0
        },
        scripts: {
          adSenseScript: !!document.querySelector('script[src*="adsbygoogle.js"]'),
          scriptCount: document.querySelectorAll('script[src*="adsbygoogle.js"]').length
        },
        ads: {
          totalAds: document.querySelectorAll('.adsbygoogle').length,
          loadedAds: document.querySelectorAll('.adsbygoogle[data-adsbygoogle-status]').length,
          failedAds: document.querySelectorAll('.adsbygoogle[data-adsbygoogle-status="error"]').length
        },
        initialization: {
          adSenseInitialized: !!(window as any).adSenseInitialized,
          pageLevelAdsInitialized: !!(window as any).pageLevelAdsInitialized,
          autoAdsInitialized: !!(window as any).autoAdsInitialized
        },
        errors: []
      };

      // فحص الأخطاء الشائعة
      if (results.scripts.scriptCount > 1) {
        results.errors.push('تم تحميل AdSense script أكثر من مرة');
      }

      if (results.initialization.adSenseInitialized && results.initialization.pageLevelAdsInitialized) {
        results.errors.push('تم تهيئة page level ads أكثر من مرة');
      }

      if (results.ads.totalAds > 0 && results.ads.loadedAds === 0) {
        results.errors.push('لا توجد إعلانات محملة رغم وجود عناصر إعلانية');
      }

      setDiagnostics(results);
    };

    // تشغيل التشخيص فوراً وكل 5 ثوان
    runDiagnostics();
    const interval = setInterval(runDiagnostics, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm shadow-lg transition-colors"
        >
          🔍 تشخيص AdSense
        </button>
      </div>
    );
  }

  return (
    <ClientOnlyContent>
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-md shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-semibold text-sm">تشخيص AdSense</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* حالة AdSense */}
            <div>
              <h4 className="text-gray-300 font-medium mb-1">حالة AdSense:</h4>
              <div className="space-y-1">
                <div className={`flex justify-between ${diagnostics.adsbygoogle?.exists ? 'text-green-400' : 'text-red-400'}`}>
                  <span>adsbygoogle موجود:</span>
                  <span>{diagnostics.adsbygoogle?.exists ? '✓' : '✗'}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>عدد العناصر:</span>
                  <span>{diagnostics.adsbygoogle?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Scripts */}
            <div>
              <h4 className="text-gray-300 font-medium mb-1">Scripts:</h4>
              <div className="space-y-1">
                <div className={`flex justify-between ${diagnostics.scripts?.adSenseScript ? 'text-green-400' : 'text-red-400'}`}>
                  <span>AdSense Script:</span>
                  <span>{diagnostics.scripts?.adSenseScript ? '✓' : '✗'}</span>
                </div>
                <div className={`flex justify-between ${diagnostics.scripts?.scriptCount === 1 ? 'text-green-400' : 'text-yellow-400'}`}>
                  <span>عدد Scripts:</span>
                  <span>{diagnostics.scripts?.scriptCount || 0}</span>
                </div>
              </div>
            </div>

            {/* الإعلانات */}
            <div>
              <h4 className="text-gray-300 font-medium mb-1">الإعلانات:</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-gray-400">
                  <span>إجمالي الإعلانات:</span>
                  <span>{diagnostics.ads?.totalAds || 0}</span>
                </div>
                <div className={`flex justify-between ${diagnostics.ads?.loadedAds > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                  <span>الإعلانات المحملة:</span>
                  <span>{diagnostics.ads?.loadedAds || 0}</span>
                </div>
                <div className={`flex justify-between ${diagnostics.ads?.failedAds > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  <span>الإعلانات الفاشلة:</span>
                  <span>{diagnostics.ads?.failedAds || 0}</span>
                </div>
              </div>
            </div>

            {/* التهيئة */}
            <div>
              <h4 className="text-gray-300 font-medium mb-1">التهيئة:</h4>
              <div className="space-y-1">
                <div className={`flex justify-between ${diagnostics.initialization?.adSenseInitialized ? 'text-green-400' : 'text-gray-400'}`}>
                  <span>AdSense مهيأ:</span>
                  <span>{diagnostics.initialization?.adSenseInitialized ? '✓' : '✗'}</span>
                </div>
                <div className={`flex justify-between ${diagnostics.initialization?.pageLevelAdsInitialized ? 'text-yellow-400' : 'text-gray-400'}`}>
                  <span>Page Level Ads:</span>
                  <span>{diagnostics.initialization?.pageLevelAdsInitialized ? '⚠️' : '✗'}</span>
                </div>
              </div>
            </div>

            {/* الأخطاء */}
            {diagnostics.errors && diagnostics.errors.length > 0 && (
              <div>
                <h4 className="text-red-400 font-medium mb-1">الأخطاء:</h4>
                <div className="space-y-1">
                  {diagnostics.errors.map((error: string, index: number) => (
                    <div key={index} className="text-red-400 text-xs">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* وقت آخر تحديث */}
            <div className="pt-2 border-t border-gray-700">
              <div className="text-gray-500 text-xs">
                آخر تحديث: {diagnostics.timestamp}
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="mt-3 flex space-x-2 space-x-reverse">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  console.log('AdSense Diagnostics:', diagnostics);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
            >
              طباعة في Console
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.adsbygoogle) {
                  try {
                    window.adsbygoogle.push({});
                    console.log('تم إعادة تحميل الإعلانات');
                  } catch (error) {
                    console.error('خطأ في إعادة التحميل:', error);
                  }
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
            >
              إعادة تحميل
            </button>
          </div>
        </div>
      </div>
    </ClientOnlyContent>
  );
}
