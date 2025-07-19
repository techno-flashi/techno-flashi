'use client';

import { useEffect, useState } from 'react';
import { checkMonetagStatus } from './MonetagManager';

interface MonetagStatus {
  scriptsLoaded: boolean;
  metaTagPresent: boolean;
  errors: string[];
  adsVisible: number;
  lastCheck: string;
}

export default function MonetagChecker({ showDebug = false }: { showDebug?: boolean }) {
  const [status, setStatus] = useState<MonetagStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const result = checkMonetagStatus();
      
      // Count visible ads
      const adsVisible = document.querySelectorAll('[data-monetag-id]').length;
      
      setStatus({
        ...result,
        adsVisible,
        lastCheck: new Date().toLocaleTimeString('ar-SA')
      });
    } catch (error) {
      console.error('Error checking Monetag status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial check after component mounts
    const timer = setTimeout(checkStatus, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!showDebug && !status) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">حالة Monetag</h3>
        <button
          onClick={checkStatus}
          disabled={isChecking}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isChecking ? 'فحص...' : 'فحص'}
        </button>
      </div>

      {status && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span>Meta Tag:</span>
            <span className={`px-2 py-1 rounded ${
              status.metaTagPresent 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {status.metaTagPresent ? '✓' : '✗'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Scripts:</span>
            <span className={`px-2 py-1 rounded ${
              status.scriptsLoaded 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {status.scriptsLoaded ? '✓' : '✗'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>إعلانات مرئية:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {status.adsVisible}
            </span>
          </div>

          {status.errors.length > 0 && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
              <div className="text-red-800 font-medium mb-1">أخطاء:</div>
              <ul className="text-red-700 space-y-1">
                {status.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-gray-500 text-xs mt-2">
            آخر فحص: {status.lastCheck}
          </div>
        </div>
      )}
    </div>
  );
}

// Component for testing Monetag ads
export function MonetagTester() {
  const [testResults, setTestResults] = useState<any[]>([]);

  const runTests = async () => {
    const tests = [
      {
        name: 'Meta Tag Test',
        test: () => !!document.querySelector('meta[name="monetag"]'),
        expected: true
      },
      {
        name: 'Script Load Test',
        test: () => document.querySelectorAll('script[data-monetag-id]').length > 0,
        expected: true
      },
      {
        name: 'Ad Container Test',
        test: () => document.querySelectorAll('[data-monetag-id]').length > 0,
        expected: true
      },
      {
        name: 'Zone ID Test',
        test: () => {
          const containers = document.querySelectorAll('[data-zone-id]');
          return Array.from(containers).some(el => el.getAttribute('data-zone-id'));
        },
        expected: true
      }
    ];

    const results = tests.map(test => ({
      ...test,
      result: test.test(),
      passed: test.test() === test.expected
    }));

    setTestResults(results);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 m-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">اختبار Monetag</h3>
        <button
          onClick={runTests}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          تشغيل الاختبارات
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-2 rounded ${
                result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <span className="text-sm">{result.name}</span>
              <span className={`text-sm font-medium ${
                result.passed ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.passed ? '✓ نجح' : '✗ فشل'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Performance monitor for Monetag
export function MonetagPerformanceMonitor() {
  const [performance, setPerformance] = useState<any[]>([]);

  useEffect(() => {
    const loadPerformanceData = () => {
      const data = JSON.parse(localStorage.getItem('monetagPerformance') || '[]');
      setPerformance(data.slice(-10)); // Show last 10 events
    };

    loadPerformanceData();
    
    // Update every 5 seconds
    const interval = setInterval(loadPerformanceData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (performance.length === 0) return null;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 m-4">
      <h3 className="text-lg font-semibold mb-4">أداء Monetag</h3>
      
      <div className="space-y-2">
        {performance.map((event, index) => (
          <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
            <span>{event.adId}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              event.event === 'load' ? 'bg-blue-100 text-blue-800' :
              event.event === 'view' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {event.event}
            </span>
            <span className="text-gray-500">
              {new Date(event.timestamp).toLocaleTimeString('ar-SA')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
