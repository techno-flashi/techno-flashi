'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  adMetrics: {
    totalAds: number;
    successfulAds: number;
    failedAds: number;
    averageLoadTime: number;
  };
  deviceMetrics: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

interface AdPerformanceAnalyzerProps {
  className?: string;
  showDetails?: boolean;
}

/**
 * مكون تحليل أداء الإعلانات ومراقبة Core Web Vitals
 */
export default function AdPerformanceAnalyzer({ 
  className = '',
  showDetails = false 
}: AdPerformanceAnalyzerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    coreWebVitals: { lcp: 0, fid: 0, cls: 0 },
    adMetrics: { totalAds: 0, successfulAds: 0, failedAds: 0, averageLoadTime: 0 },
    deviceMetrics: { mobile: 0, tablet: 0, desktop: 0 }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    analyzePerformance();
    
    // مراقبة مستمرة كل 30 ثانية
    const interval = setInterval(analyzePerformance, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const analyzePerformance = async () => {
    setIsAnalyzing(true);
    
    try {
      // قياس Core Web Vitals
      const coreWebVitals = await measureCoreWebVitals();
      
      // قياس أداء الإعلانات
      const adMetrics = await measureAdPerformance();
      
      // قياس استخدام الأجهزة
      const deviceMetrics = getDeviceMetrics();
      
      // قياس أوقات التحميل والرندر
      const loadTime = performance.now();
      const renderTime = await measureRenderTime();
      
      const newMetrics: PerformanceMetrics = {
        loadTime,
        renderTime,
        coreWebVitals,
        adMetrics,
        deviceMetrics
      };
      
      setMetrics(newMetrics);
      
      // إنشاء التوصيات
      const newRecommendations = generateRecommendations(newMetrics);
      setRecommendations(newRecommendations);
      
    } catch (error) {
      console.error('Error analyzing performance:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const measureCoreWebVitals = async (): Promise<PerformanceMetrics['coreWebVitals']> => {
    return new Promise((resolve) => {
      // قياس LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        resolve({
          lcp: lastEntry?.startTime || 0,
          fid: 0, // سيتم قياسه بشكل منفصل
          cls: 0  // سيتم قياسه بشكل منفصل
        });
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // fallback بعد 5 ثوان
        setTimeout(() => {
          lcpObserver.disconnect();
          resolve({ lcp: 0, fid: 0, cls: 0 });
        }, 5000);
      } catch (error) {
        resolve({ lcp: 0, fid: 0, cls: 0 });
      }
    });
  };

  const measureAdPerformance = async (): Promise<PerformanceMetrics['adMetrics']> => {
    try {
      // جلب إحصائيات الإعلانات من قاعدة البيانات
      const { data: ads, error } = await supabase
        .from('advertisements')
        .select('id, view_count, click_count, created_at')
        .eq('is_active', true);

      if (error) throw error;

      // قياس الإعلانات المحملة في الصفحة
      const adElements = document.querySelectorAll('[data-ad-id]');
      const successfulAds = Array.from(adElements).filter(el => 
        !el.querySelector('.error') && !el.classList.contains('ad-failed')
      ).length;

      const totalAds = ads?.length || 0;
      const failedAds = totalAds - successfulAds;

      // قياس متوسط وقت تحميل الإعلانات
      const adLoadTimes = Array.from(adElements).map(el => {
        const loadTime = el.getAttribute('data-load-time');
        return loadTime ? parseFloat(loadTime) : 0;
      });

      const averageLoadTime = adLoadTimes.length > 0 
        ? adLoadTimes.reduce((sum, time) => sum + time, 0) / adLoadTimes.length
        : 0;

      return {
        totalAds,
        successfulAds,
        failedAds,
        averageLoadTime
      };
    } catch (error) {
      console.error('Error measuring ad performance:', error);
      return { totalAds: 0, successfulAds: 0, failedAds: 0, averageLoadTime: 0 };
    }
  };

  const measureRenderTime = async (): Promise<number> => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const renderTime = performance.now();
        resolve(renderTime);
      });
    });
  };

  const getDeviceMetrics = (): PerformanceMetrics['deviceMetrics'] => {
    const width = window.innerWidth;
    
    if (width < 768) {
      return { mobile: 100, tablet: 0, desktop: 0 };
    } else if (width < 1024) {
      return { mobile: 0, tablet: 100, desktop: 0 };
    } else {
      return { mobile: 0, tablet: 0, desktop: 100 };
    }
  };

  const generateRecommendations = (metrics: PerformanceMetrics): string[] => {
    const recommendations: string[] = [];

    // توصيات Core Web Vitals
    if (metrics.coreWebVitals.lcp > 2500) {
      recommendations.push('تحسين LCP: قم بتحسين تحميل الصور والمحتوى الرئيسي');
    }

    // توصيات الإعلانات
    if (metrics.adMetrics.failedAds > 0) {
      recommendations.push(`إصلاح ${metrics.adMetrics.failedAds} إعلان فاشل`);
    }

    if (metrics.adMetrics.averageLoadTime > 1000) {
      recommendations.push('تحسين سرعة تحميل الإعلانات');
    }

    // توصيات الأداء العام
    if (metrics.loadTime > 3000) {
      recommendations.push('تحسين سرعة تحميل الصفحة');
    }

    if (metrics.renderTime > 100) {
      recommendations.push('تحسين أداء الرندر');
    }

    return recommendations;
  };

  const getPerformanceScore = (): number => {
    const lcpScore = metrics.coreWebVitals.lcp < 2500 ? 25 : 0;
    const adSuccessScore = metrics.adMetrics.totalAds > 0 
      ? (metrics.adMetrics.successfulAds / metrics.adMetrics.totalAds) * 25 
      : 25;
    const loadTimeScore = metrics.loadTime < 3000 ? 25 : 0;
    const renderTimeScore = metrics.renderTime < 100 ? 25 : 0;

    return lcpScore + adSuccessScore + loadTimeScore + renderTimeScore;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const performanceScore = getPerformanceScore();

  return (
    <div className={`ad-performance-analyzer bg-dark-card rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">تحليل أداء الإعلانات</h3>
        <button
          onClick={analyzePerformance}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isAnalyzing ? 'جاري التحليل...' : 'تحديث'}
        </button>
      </div>

      {/* نقاط الأداء الإجمالية */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold ${getScoreColor(performanceScore)} mb-2`}>
          {performanceScore.toFixed(0)}/100
        </div>
        <div className="text-gray-400">نقاط الأداء الإجمالية</div>
      </div>

      {/* المقاييس الأساسية */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {metrics.adMetrics.successfulAds}/{metrics.adMetrics.totalAds}
          </div>
          <div className="text-gray-400 text-sm">إعلانات ناجحة</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {metrics.adMetrics.averageLoadTime.toFixed(0)}ms
          </div>
          <div className="text-gray-400 text-sm">متوسط التحميل</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {metrics.coreWebVitals.lcp.toFixed(0)}ms
          </div>
          <div className="text-gray-400 text-sm">LCP</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {metrics.renderTime.toFixed(0)}ms
          </div>
          <div className="text-gray-400 text-sm">وقت الرندر</div>
        </div>
      </div>

      {/* التوصيات */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">التوصيات:</h4>
          <div className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <span className="text-yellow-400 ml-2 mt-1">⚠️</span>
                <span className="text-gray-300 text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* تفاصيل إضافية */}
      {showDetails && (
        <div className="border-t border-gray-700 pt-6">
          <h4 className="text-lg font-semibold text-white mb-3">تفاصيل الأداء:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="text-gray-300 font-medium mb-2">Core Web Vitals:</h5>
              <div className="space-y-1 text-gray-400">
                <div>LCP: {metrics.coreWebVitals.lcp.toFixed(2)}ms</div>
                <div>FID: {metrics.coreWebVitals.fid.toFixed(2)}ms</div>
                <div>CLS: {metrics.coreWebVitals.cls.toFixed(3)}</div>
              </div>
            </div>
            
            <div>
              <h5 className="text-gray-300 font-medium mb-2">استخدام الأجهزة:</h5>
              <div className="space-y-1 text-gray-400">
                <div>موبايل: {metrics.deviceMetrics.mobile}%</div>
                <div>تابلت: {metrics.deviceMetrics.tablet}%</div>
                <div>ديسكتوب: {metrics.deviceMetrics.desktop}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مؤشر التحليل */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
          <div className="text-center text-white">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <div>جاري تحليل الأداء...</div>
          </div>
        </div>
      )}
    </div>
  );
}
