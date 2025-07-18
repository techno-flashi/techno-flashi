'use client';

import { useEffect } from 'react';

// --- دوال التحسين (Helpers) ---

/**
 * يزيل سكربتات JavaScript القديمة و polyfills غير الضرورية.
 */
const removeLegacyJS = () => {
  if (typeof window === 'undefined') return;

  // قائمة بالأنماط القديمة المراد إزالتها
  const legacyPatterns = ['babel-polyfill', 'core-js', 'regenerator-runtime'];
  legacyPatterns.forEach(pattern => {
    document.querySelectorAll(`script[src*="${pattern}"]`).forEach(script => {
      console.log(`Removing legacy script: ${script.getAttribute('src')}`);
      script.remove();
    });
  });

  // التحقق من دعم المتصفح للميزات الحديثة
  const isModernBrowser = 'fetch' in window && 'Promise' in window;
  if (isModernBrowser) {
    document.querySelectorAll('script[src*="polyfill"]').forEach(script => {
      console.log(`Removing unnecessary polyfill: ${script.getAttribute('src')}`);
      script.remove();
    });
  }
};

/**
 * يزيل قواعد CSS غير المستخدمة من صفحات الأنماط.
 */
const removeUnusedCSS = () => {
  if (typeof window === 'undefined') return;
  
  Array.from(document.styleSheets).forEach(stylesheet => {
    try {
      if (!stylesheet.cssRules) return;
      const rules = Array.from(stylesheet.cssRules);
      const unusedRuleIndexes: number[] = [];

      rules.forEach((rule, index) => {
        if (rule.type === CSSRule.STYLE_RULE) {
          const styleRule = rule as CSSStyleRule;
          // تحقق مبسط: المحددات التي لا تحتوي على حالات ديناميكية
          const isDynamic = /[:[\]]|group-hover|dark|light/.test(styleRule.selectorText);
          try {
            if (!isDynamic && document.querySelector(styleRule.selectorText) === null) {
              unusedRuleIndexes.push(index);
            }
          } catch (e) {
            // تجاهل المحددات المعقدة التي تسبب أخطاء
          }
        }
      });

      // إزالة القواعد من النهاية للبداية
      unusedRuleIndexes.reverse().forEach(index => {
        stylesheet.deleteRule(index);
      });
    } catch (e) {
      // تجاهل أوراق الأنماط عبر النطاقات (cross-origin)
    }
  });
};

/**
 * يراقب استخدام الذاكرة ويسجل تحذيرًا عند الاستخدام المرتفع.
 */
const monitorMemoryUsage = () => {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        console.log(`Memory usage: ${usedMB}MB`);
        if (usedMB > 150) {
            console.warn('High memory usage detected.');
        }
    }
};

/**
 * يضيف 'display=swap' لروابط Google Fonts لتحسين عرض النص.
 */
const optimizeGoogleFonts = () => {
    document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.includes('display=swap')) {
            const newHref = `${href}&display=swap`;
            link.setAttribute('href', newHref);
        }
    });
};

/**
 * يضيف 'defer' للسكربتات الخارجية الشائعة لتجنب حظر العرض.
 */
const optimizeThirdPartyScripts = () => {
    const deferableScripts = ['google-analytics', 'googletagmanager', 'facebook.net'];
    document.querySelectorAll('script[src]').forEach(script => {
        const src = script.getAttribute('src') || '';
        if (deferableScripts.some(domain => src.includes(domain))) {
            if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
                script.setAttribute('defer', '');
            }
        }
    });
};

/**
 * مكون شامل لتطبيق جميع تحسينات الأداء.
 */
export function UnusedCodeOptimizer() {
  useEffect(() => {
    // تشغيل التحسينات بعد فترة وجيزة من تحميل الصفحة لتجنب التأثير على LCP
    const optimizationTimeout = setTimeout(() => {
      console.log('Running performance optimizations...');
      removeLegacyJS();
      removeUnusedCSS();
      monitorMemoryUsage();
      optimizeGoogleFonts();
      optimizeThirdPartyScripts();
    }, 3000); // تأخير 3 ثوانٍ

    // مراقبة الذاكرة بشكل دوري
    const memoryInterval = setInterval(monitorMemoryUsage, 60000); // كل دقيقة

    // دالة التنظيف عند إزالة المكون
    return () => {
      clearTimeout(optimizationTimeout);
      clearInterval(memoryInterval);
    };
  }, []); // يعمل مرة واحدة فقط بعد التحميل الأولي

  return null; // هذا المكون لا يعرض أي شيء في الـ DOM
}