'use client';

import React, { useState, useEffect } from 'react';

interface CompatibilityTestResult {
  browser: string;
  version: string;
  arabicSupport: boolean;
  animationSupport: boolean;
  cssSupport: boolean;
  jsSupport: boolean;
  performanceScore: number;
  issues: string[];
}

export function AdCompatibilityTester() {
  const [testResults, setTestResults] = useState<CompatibilityTestResult | null>(null);
  const [testing, setTesting] = useState(false);

  const runCompatibilityTest = async () => {
    setTesting(true);
    
    try {
      // اختبار معلومات المتصفح
      const browserInfo = getBrowserInfo();
      
      // اختبار دعم العربية
      const arabicSupport = testArabicSupport();
      
      // اختبار دعم الرسوم المتحركة
      const animationSupport = testAnimationSupport();
      
      // اختبار دعم CSS المتقدم
      const cssSupport = testCSSSupport();
      
      // اختبار دعم JavaScript
      const jsSupport = testJavaScriptSupport();
      
      // اختبار الأداء
      const performanceScore = await testPerformance();
      
      // جمع المشاكل المحتملة
      const issues = detectIssues(browserInfo, arabicSupport, animationSupport, cssSupport, jsSupport, performanceScore);
      
      const results: CompatibilityTestResult = {
        browser: browserInfo.name,
        version: browserInfo.version,
        arabicSupport,
        animationSupport,
        cssSupport,
        jsSupport,
        performanceScore,
        issues
      };
      
      setTestResults(results);
    } catch (error) {
      console.error('خطأ في اختبار التوافق:', error);
    } finally {
      setTesting(false);
    }
  };

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let name = 'Unknown';
    let version = 'Unknown';

    if (userAgent.includes('Chrome')) {
      name = 'Chrome';
      version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Firefox')) {
      name = 'Firefox';
      version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Safari')) {
      name = 'Safari';
      version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Edge')) {
      name = 'Edge';
      version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }

    return { name, version };
  };

  const testArabicSupport = (): boolean => {
    try {
      // إنشاء عنصر اختبار
      const testElement = document.createElement('div');
      testElement.style.fontFamily = 'Cairo, Amiri, Noto Sans Arabic, Arial, sans-serif';
      testElement.style.direction = 'rtl';
      testElement.textContent = 'اختبار النص العربي';
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      
      document.body.appendChild(testElement);
      
      // قياس العرض
      const width = testElement.offsetWidth;
      
      // تنظيف
      document.body.removeChild(testElement);
      
      // إذا كان العرض أكبر من 0، فالدعم متوفر
      return width > 0;
    } catch {
      return false;
    }
  };

  const testAnimationSupport = (): boolean => {
    try {
      const testElement = document.createElement('div');
      const animationProperties = [
        'animation',
        'webkitAnimation',
        'mozAnimation',
        'oAnimation',
        'msAnimation'
      ];
      
      return animationProperties.some(prop => prop in testElement.style);
    } catch {
      return false;
    }
  };

  const testCSSSupport = (): boolean => {
    try {
      // اختبار خصائص CSS المتقدمة
      const testElement = document.createElement('div');
      const cssFeatures = [
        'transform',
        'transition',
        'borderRadius',
        'boxShadow',
        'gradient'
      ];
      
      let supportedFeatures = 0;
      
      cssFeatures.forEach(feature => {
        if (feature in testElement.style || 
            `webkit${feature.charAt(0).toUpperCase() + feature.slice(1)}` in testElement.style) {
          supportedFeatures++;
        }
      });
      
      return supportedFeatures >= 3;
    } catch {
      return false;
    }
  };

  const testJavaScriptSupport = (): boolean => {
    try {
      // اختبار ميزات JavaScript الحديثة
      const features = [
        () => typeof requestAnimationFrame !== 'undefined',
        () => typeof Promise !== 'undefined',
        () => typeof Array.prototype.includes !== 'undefined',
        () => typeof Object.assign !== 'undefined'
      ];
      
      return features.every(test => test());
    } catch {
      return false;
    }
  };

  const testPerformance = async (): Promise<number> => {
    try {
      const startTime = performance.now();
      
      // اختبار أداء الرسوم المتحركة
      const testElement = document.createElement('div');
      testElement.style.cssText = `
        position: absolute;
        top: -1000px;
        width: 100px;
        height: 100px;
        background: red;
        transition: transform 0.3s ease;
      `;
      
      document.body.appendChild(testElement);
      
      // تشغيل عدة تحويلات
      for (let i = 0; i < 10; i++) {
        testElement.style.transform = `translateX(${i * 10}px)`;
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
      
      const endTime = performance.now();
      document.body.removeChild(testElement);
      
      // حساب النقاط (كلما قل الوقت، زادت النقاط)
      const duration = endTime - startTime;
      return Math.max(0, Math.min(100, 100 - (duration / 10)));
    } catch {
      return 50; // نقاط متوسطة في حالة الخطأ
    }
  };

  const detectIssues = (
    browserInfo: any,
    arabicSupport: boolean,
    animationSupport: boolean,
    cssSupport: boolean,
    jsSupport: boolean,
    performanceScore: number
  ): string[] => {
    const issues: string[] = [];

    if (!arabicSupport) {
      issues.push('دعم النصوص العربية غير متوفر أو محدود');
    }

    if (!animationSupport) {
      issues.push('دعم الرسوم المتحركة CSS غير متوفر');
    }

    if (!cssSupport) {
      issues.push('دعم خصائص CSS المتقدمة محدود');
    }

    if (!jsSupport) {
      issues.push('دعم JavaScript الحديث محدود');
    }

    if (performanceScore < 30) {
      issues.push('أداء ضعيف - قد تكون الرسوم المتحركة بطيئة');
    }

    if (browserInfo.name === 'Unknown') {
      issues.push('متصفح غير معروف - قد تحدث مشاكل في التوافق');
    }

    // اختبارات خاصة بمتصفحات معينة
    if (browserInfo.name === 'Safari' && parseInt(browserInfo.version) < 14) {
      issues.push('إصدار Safari قديم - قد لا تعمل بعض الميزات');
    }

    if (browserInfo.name === 'Chrome' && parseInt(browserInfo.version) < 80) {
      issues.push('إصدار Chrome قديم - يُنصح بالتحديث');
    }

    return issues;
  };

  const getOverallScore = (results: CompatibilityTestResult): number => {
    let score = 0;
    if (results.arabicSupport) score += 25;
    if (results.animationSupport) score += 25;
    if (results.cssSupport) score += 20;
    if (results.jsSupport) score += 20;
    score += results.performanceScore * 0.1;
    return Math.round(score);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-dark-card rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">اختبار توافق الإعلانات</h3>
        <button
          onClick={runCompatibilityTest}
          disabled={testing}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? 'جاري الاختبار...' : 'بدء الاختبار'}
        </button>
      </div>

      {testing && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="mr-3 text-dark-text-secondary">جاري فحص التوافق...</span>
        </div>
      )}

      {testResults && (
        <div className="space-y-6">
          {/* النتيجة الإجمالية */}
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className={`text-3xl font-bold ${getScoreColor(getOverallScore(testResults))}`}>
              {getOverallScore(testResults)}%
            </div>
            <div className="text-dark-text-secondary">نقاط التوافق الإجمالية</div>
          </div>

          {/* معلومات المتصفح */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-dark-text-secondary">المتصفح</div>
              <div className="text-white font-medium">{testResults.browser} {testResults.version}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-dark-text-secondary">نقاط الأداء</div>
              <div className={`font-medium ${getScoreColor(testResults.performanceScore)}`}>
                {Math.round(testResults.performanceScore)}/100
              </div>
            </div>
          </div>

          {/* نتائج الاختبارات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <div className={`text-2xl ${testResults.arabicSupport ? 'text-green-400' : 'text-red-400'}`}>
                {testResults.arabicSupport ? '✓' : '✗'}
              </div>
              <div className="text-xs text-dark-text-secondary mt-1">النصوص العربية</div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <div className={`text-2xl ${testResults.animationSupport ? 'text-green-400' : 'text-red-400'}`}>
                {testResults.animationSupport ? '✓' : '✗'}
              </div>
              <div className="text-xs text-dark-text-secondary mt-1">الرسوم المتحركة</div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <div className={`text-2xl ${testResults.cssSupport ? 'text-green-400' : 'text-red-400'}`}>
                {testResults.cssSupport ? '✓' : '✗'}
              </div>
              <div className="text-xs text-dark-text-secondary mt-1">CSS المتقدم</div>
            </div>
            <div className="text-center p-3 bg-gray-800 rounded-lg">
              <div className={`text-2xl ${testResults.jsSupport ? 'text-green-400' : 'text-red-400'}`}>
                {testResults.jsSupport ? '✓' : '✗'}
              </div>
              <div className="text-xs text-dark-text-secondary mt-1">JavaScript</div>
            </div>
          </div>

          {/* المشاكل المكتشفة */}
          {testResults.issues.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-400 font-medium mb-2">مشاكل مكتشفة:</h4>
              <ul className="space-y-1">
                {testResults.issues.map((issue, index) => (
                  <li key={index} className="text-red-300 text-sm flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* توصيات */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2">توصيات:</h4>
            <ul className="space-y-1 text-blue-300 text-sm">
              <li>• استخدم خطوط ويب آمنة للنصوص العربية</li>
              <li>• اختبر الإعلانات على متصفحات مختلفة</li>
              <li>• قلل من تعقيد الرسوم المتحركة للأجهزة الضعيفة</li>
              <li>• استخدم fallbacks للميزات غير المدعومة</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
