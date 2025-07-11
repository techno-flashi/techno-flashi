'use client';

import { useEffect, useState } from 'react';

interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  mobile: boolean;
  supported: boolean;
  warnings: string[];
}

interface FeatureSupport {
  feature: string;
  supported: boolean;
  fallback?: string;
}

export function BrowserCompatibility() {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [features, setFeatures] = useState<FeatureSupport[]>([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const detectBrowser = (): BrowserInfo => {
      const userAgent = navigator.userAgent;
      const warnings: string[] = [];
      
      let name = 'Unknown';
      let version = 'Unknown';
      let engine = 'Unknown';
      let supported = true;

      // Detect browser
      if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        name = 'Chrome';
        const match = userAgent.match(/Chrome\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Blink';
        if (parseInt(version) < 90) {
          supported = false;
          warnings.push('إصدار Chrome قديم، يُنصح بالتحديث');
        }
      } else if (userAgent.includes('Firefox')) {
        name = 'Firefox';
        const match = userAgent.match(/Firefox\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Gecko';
        if (parseInt(version) < 88) {
          supported = false;
          warnings.push('إصدار Firefox قديم، يُنصح بالتحديث');
        }
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        name = 'Safari';
        const match = userAgent.match(/Version\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'WebKit';
        if (parseInt(version) < 14) {
          supported = false;
          warnings.push('إصدار Safari قديم، يُنصح بالتحديث');
        }
      } else if (userAgent.includes('Edg')) {
        name = 'Edge';
        const match = userAgent.match(/Edg\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Blink';
        if (parseInt(version) < 90) {
          supported = false;
          warnings.push('إصدار Edge قديم، يُنصح بالتحديث');
        }
      } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
        name = 'Internet Explorer';
        supported = false;
        warnings.push('Internet Explorer غير مدعوم، يُرجى استخدام متصفح حديث');
      }

      const platform = navigator.platform;
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

      return {
        name,
        version,
        engine,
        platform,
        mobile,
        supported,
        warnings
      };
    };

    const checkFeatureSupport = (): FeatureSupport[] => {
      const features: FeatureSupport[] = [
        {
          feature: 'CSS Grid',
          supported: CSS.supports('display', 'grid'),
          fallback: 'Flexbox layout'
        },
        {
          feature: 'CSS Flexbox',
          supported: CSS.supports('display', 'flex'),
          fallback: 'Block layout'
        },
        {
          feature: 'CSS Custom Properties',
          supported: CSS.supports('--test', 'value'),
          fallback: 'Static CSS values'
        },
        {
          feature: 'Intersection Observer',
          supported: 'IntersectionObserver' in window,
          fallback: 'Scroll event listeners'
        },
        {
          feature: 'Web Share API',
          supported: 'share' in navigator,
          fallback: 'Manual sharing'
        },
        {
          feature: 'Service Workers',
          supported: 'serviceWorker' in navigator,
          fallback: 'No offline support'
        },
        {
          feature: 'Local Storage',
          supported: 'localStorage' in window,
          fallback: 'Session-only storage'
        },
        {
          feature: 'Fetch API',
          supported: 'fetch' in window,
          fallback: 'XMLHttpRequest'
        },
        {
          feature: 'ES6 Modules',
          supported: 'noModule' in document.createElement('script'),
          fallback: 'Bundled JavaScript'
        },
        {
          feature: 'WebP Images',
          supported: false // Will be checked asynchronously
        }
      ];

      // Check WebP support asynchronously
      const webp = new Image();
      webp.onload = webp.onerror = () => {
        const webpFeature = features.find(f => f.feature === 'WebP Images');
        if (webpFeature) {
          webpFeature.supported = webp.height === 2;
          setFeatures([...features]);
        }
      };
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

      return features;
    };

    setBrowserInfo(detectBrowser());
    setFeatures(checkFeatureSupport());
  }, []);

  const getSupportColor = (supported: boolean) => {
    return supported ? 'text-green-400' : 'text-red-400';
  };

  const getSupportIcon = (supported: boolean) => {
    return supported ? '✅' : '❌';
  };

  if (!browserInfo) return null;

  // Only show in development or when explicitly enabled
  if (process.env.NODE_ENV !== 'development' && !showReport) {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setShowReport(!showReport)}
        className="fixed bottom-20 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        aria-label={showReport ? "إخفاء تقرير التوافق" : "عرض تقرير التوافق"}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {!browserInfo.supported && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Browser compatibility report */}
      {showReport && (
        <div className="fixed bottom-32 right-4 z-40 bg-dark-card border border-gray-700 rounded-lg p-4 shadow-xl max-w-sm max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-sm">تقرير التوافق</h3>
            <button
              onClick={() => setShowReport(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="إغلاق التقرير"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Browser info */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <h4 className="text-white font-semibold mb-2">معلومات المتصفح</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">المتصفح:</span>
                <span className="text-white">{browserInfo.name} {browserInfo.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">المحرك:</span>
                <span className="text-white">{browserInfo.engine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">النظام:</span>
                <span className="text-white">{browserInfo.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">الجهاز:</span>
                <span className="text-white">{browserInfo.mobile ? 'موبايل' : 'سطح مكتب'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">الدعم:</span>
                <span className={getSupportColor(browserInfo.supported)}>
                  {browserInfo.supported ? 'مدعوم' : 'غير مدعوم'}
                </span>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {browserInfo.warnings.length > 0 && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
              <h4 className="text-red-400 font-semibold mb-2">تحذيرات</h4>
              <ul className="text-sm space-y-1">
                {browserInfo.warnings.map((warning, index) => (
                  <li key={index} className="text-red-300">• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Feature support */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold">دعم الميزات</h4>
            {features.map((feature, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-gray-300">{feature.feature}:</span>
                <span className={getSupportColor(feature.supported)}>
                  {getSupportIcon(feature.supported)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400">
            <div>المدعوم: {features.filter(f => f.supported).length}/{features.length}</div>
          </div>
        </div>
      )}
    </>
  );
}

// Hook للتحقق من دعم المتصفح
export function useBrowserSupport() {
  const [isSupported, setIsSupported] = useState(true);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const newWarnings: string[] = [];
    let supported = true;

    // Check for unsupported browsers
    if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      supported = false;
      newWarnings.push('Internet Explorer غير مدعوم');
    }

    // Check for old versions
    const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
    if (chromeMatch && parseInt(chromeMatch[1]) < 90) {
      newWarnings.push('إصدار Chrome قديم');
    }

    setIsSupported(supported);
    setWarnings(newWarnings);
  }, []);

  return { isSupported, warnings };
}
