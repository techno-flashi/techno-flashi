'use client';

import { useEffect } from 'react';

/**
 * مكون لإزالة JavaScript و CSS غير المستخدم
 */
export default function UnusedCodeRemover() {
  useEffect(() => {
    // إزالة Legacy JavaScript (66 KiB potential savings)
    const removeLegacyJS = () => {
      if (typeof window !== 'undefined') {
        // List of legacy patterns to remove
        const legacyPatterns = [
          'babel-polyfill',
          'core-js',
          'regenerator-runtime',
          'whatwg-fetch',
          'es6-promise',
          'object-assign'
        ];

        // Remove scripts containing legacy patterns
        legacyPatterns.forEach(pattern => {
          const scripts = document.querySelectorAll(`script[src*="${pattern}"]`);
          scripts.forEach(script => {
            console.log(`Removing legacy script: ${pattern}`);
            script.remove();
          });
        });

        // Check if modern features are supported
        const isModernBrowser =
          'fetch' in window &&
          'Promise' in window &&
          'IntersectionObserver' in window;

        if (isModernBrowser) {
          // Remove polyfill scripts that are no longer needed
          const polyfillScripts = document.querySelectorAll('script[src*="polyfill"]');
          polyfillScripts.forEach(script => {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
          });
        }
      }
    };

    // إزالة CSS غير المستخدم
    const removeUnusedCSS = () => {
      const stylesheets = Array.from(document.styleSheets);
      
      stylesheets.forEach(stylesheet => {
        try {
          const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
          const unusedRules: number[] = [];
          
          rules.forEach((rule, index) => {
            if (rule.type === CSSRule.STYLE_RULE) {
              const styleRule = rule as CSSStyleRule;
              const selector = styleRule.selectorText;
              
              // فحص ما إذا كان المحدد مستخدم في الصفحة
              try {
                const elements = document.querySelectorAll(selector);
                if (elements.length === 0) {
                  // التحقق من أن المحدد ليس للحالات الديناميكية
                  const isDynamic = selector.includes(':hover') || 
                                   selector.includes(':focus') || 
                                   selector.includes(':active') ||
                                   selector.includes('::before') ||
                                   selector.includes('::after') ||
                                   selector.includes('.group-hover') ||
                                   selector.includes('[data-') ||
                                   selector.includes('.dark') ||
                                   selector.includes('.light');
                  
                  if (!isDynamic) {
                    unusedRules.push(index);
                  }
                }
              } catch (e) {
                // تجاهل الأخطاء للمحددات المعقدة
              }
            }
          });
          
          // إزالة القواعد غير المستخدمة (من الأخير للأول لتجنب تغيير الفهارس)
          unusedRules.reverse().forEach(index => {
            try {
              stylesheet.deleteRule(index);
            } catch (e) {
              // تجاهل الأخطاء
            }
          });
          
        } catch (e) {
          // تجاهل الأخطاء للـ stylesheets الخارجية
        }
      });
    };

    // إزالة JavaScript غير المستخدم
    const removeUnusedJS = () => {
      // قائمة بالمتغيرات والدوال غير المستخدمة الشائعة
      const unusedGlobals = [
        'webkitURL',
        'webkitRequestAnimationFrame',
        'webkitCancelAnimationFrame',
        'mozRequestAnimationFrame',
        'mozCancelAnimationFrame',
        'msRequestAnimationFrame',
        'msCancelAnimationFrame'
      ];

      unusedGlobals.forEach(globalVar => {
        try {
          if (window[globalVar as keyof Window] && typeof window[globalVar as keyof Window] === 'function') {
            // لا نحذف المتغيرات العامة فعلياً، فقط نسجل أنها غير مستخدمة
            console.log(`Unused global detected: ${globalVar}`);
          }
        } catch (e) {
          // تجاهل الأخطاء
        }
      });
    };

    // تحسين polyfills
    const optimizePolyfills = () => {
      // فحص ما إذا كان المتصفح يدعم الميزات الحديثة
      const modernBrowser = 'fetch' in window && 
                           'Promise' in window && 
                           'Map' in window && 
                           'Set' in window &&
                           'Symbol' in window;

      if (modernBrowser) {
        // إزالة polyfills غير الضرورية
        const polyfillScripts = document.querySelectorAll('script[src*="polyfill"]');
        polyfillScripts.forEach(script => {
          const src = script.getAttribute('src') || '';
          
          // قائمة بـ polyfills يمكن إزالتها للمتصفحات الحديثة
          const unnecessaryPolyfills = [
            'es6-promise',
            'fetch-polyfill',
            'array-includes',
            'object-assign',
            'string-includes'
          ];

          if (unnecessaryPolyfills.some(polyfill => src.includes(polyfill))) {
            script.remove();
            console.log(`Removed unnecessary polyfill: ${src}`);
          }
        });
      }
    };

    // تأجيل تنفيذ التحسينات لتجنب التأثير على الأداء الأولي
    const timeoutId = setTimeout(() => {
      removeUnusedCSS();
      removeUnusedJS();
      optimizePolyfills();
    }, 3000); // 3 ثوان بعد تحميل الصفحة

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}

/**
 * مكون لتحسين تحميل الموارد الخارجية
 */
export function ExternalResourceOptimizer() {
  useEffect(() => {
    // تحسين تحميل Google Fonts
    const optimizeGoogleFonts = () => {
      try {
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');

        fontLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && !href.includes('display=swap')) {
            try {
              // التحقق من صحة الرابط وإصلاح الروابط النسبية
              let fullUrl = href;
              if (href.startsWith('//')) {
                fullUrl = `https:${href}`;
              } else if (!href.startsWith('http://') && !href.startsWith('https://')) {
                // تجاهل الروابط النسبية المحلية
                return;
              }

              if (fullUrl.startsWith('http://') || fullUrl.startsWith('https://')) {
                const url = new URL(fullUrl);
                url.searchParams.set('display', 'swap');
                link.setAttribute('href', url.toString());
              }
            } catch (error) {
              // تجاهل الروابط غير الصحيحة
              console.warn('Invalid font URL:', href, error);
            }
          }
        });
      } catch (error) {
        console.warn('Error optimizing Google Fonts:', error);
      }
    };

    // تحسين تحميل أكواد الأطراف الثالثة
    const optimizeThirdPartyScripts = () => {
      const scripts = document.querySelectorAll('script[src]');
      
      scripts.forEach(script => {
        const src = script.getAttribute('src') || '';
        
        // قائمة بالأكواد التي يمكن تأجيل تحميلها
        const deferableScripts = [
          'google-analytics',
          'googletagmanager',
          'facebook.net',
          'twitter.com',
          'linkedin.com',
          'pinterest.com'
        ];

        if (deferableScripts.some(domain => src.includes(domain))) {
          if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
            script.setAttribute('defer', '');
          }
        }
      });
    };

    // تطبيق التحسينات مع معالجة الأخطاء
    try {
      optimizeGoogleFonts();
      optimizeThirdPartyScripts();
    } catch (error) {
      console.warn('Error in UnusedCodeOptimizer:', error);
    }
  }, []);

  return null;
}

/**
 * مكون لمراقبة وتحسين استخدام الذاكرة
 */
export function MemoryOptimizer() {
  useEffect(() => {
    // تنظيف event listeners غير المستخدمة
    const cleanupEventListeners = () => {
      // إزالة event listeners المكررة
      const elements = document.querySelectorAll('*');
      
      elements.forEach(element => {
        // فحص العناصر التي قد تحتوي على event listeners مكررة
        const events = ['click', 'scroll', 'resize', 'load'];
        
        events.forEach(eventType => {
          // لا يمكننا إزالة event listeners مباشرة، لكن يمكننا تسجيل العناصر المشبوهة
          const listeners = (element as any)._listeners;
          if (listeners && listeners[eventType] && listeners[eventType].length > 3) {
            console.warn(`Element has many ${eventType} listeners:`, element);
          }
        });
      });
    };

    // مراقبة استخدام الذاكرة
    const monitorMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
        
        console.log(`Memory usage: ${usedMB}MB / ${totalMB}MB`);
        
        // تحذير إذا كان استخدام الذاكرة مرتفع
        if (usedMB > 100) {
          console.warn('High memory usage detected. Consider optimizing.');
        }
      }
    };

    // تنظيف دوري للذاكرة
    const memoryCleanup = () => {
      // إجبار garbage collection إذا كان متاح
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
      
      // تنظيف المتغيرات العامة غير المستخدمة
      const globalVars = Object.keys(window);
      globalVars.forEach(varName => {
        if (varName.startsWith('temp_') || varName.startsWith('old_')) {
          try {
            delete (window as any)[varName];
          } catch (e) {
            // تجاهل الأخطاء
          }
        }
      });
    };

    // تشغيل التحسينات بعد تعريف جميع الدوال
    const runOptimizations = () => {
      removeLegacyJS();
      removeUnusedCSS();
      cleanupEventListeners();
      monitorMemoryUsage();
    };

    // تشغيل التحسينات
    runOptimizations();
    
    // تنظيف دوري كل 5 دقائق
    const cleanupInterval = setInterval(memoryCleanup, 300000);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);

  return null;
}

/**
 * مكون شامل لإزالة الكود غير المستخدم
 */
export function UnusedCodeOptimizer() {
  return (
    <>
      <UnusedCodeRemover />
      <ExternalResourceOptimizer />
      <MemoryOptimizer />
    </>
  );
}
