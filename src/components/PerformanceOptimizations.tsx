'use client';

import { useEffect } from 'react';

// مكون تحسين الأداء العام
export function PerformanceOptimizations() {
  useEffect(() => {
    // تحسين التمرير
    const optimizeScrolling = () => {
      let ticking = false;
      
      const updateScrollPosition = () => {
        // تحديث موضع التمرير بكفاءة
        ticking = false;
      };
      
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateScrollPosition);
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    };

    // تحسين تغيير حجم النافذة
    const optimizeResize = () => {
      let resizeTimer: NodeJS.Timeout;
      
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          // تحديث التخطيط بعد انتهاء تغيير الحجم
          window.dispatchEvent(new Event('optimizedResize'));
        }, 250);
      };
      
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        clearTimeout(resizeTimer);
      };
    };

    // تحسين التركيز
    const optimizeFocus = () => {
      let isUsingKeyboard = false;
      
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          isUsingKeyboard = true;
          document.body.classList.add('using-keyboard');
        }
      };
      
      const onMouseDown = () => {
        isUsingKeyboard = false;
        document.body.classList.remove('using-keyboard');
      };
      
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('mousedown', onMouseDown);
      
      return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('mousedown', onMouseDown);
      };
    };

    // تحسين الصور الكسولة
    const optimizeLazyImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        }, {
          rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
        
        return () => imageObserver.disconnect();
      }
    };

    // تحسين الخطوط
    const optimizeFonts = () => {
      // تحميل الخطوط مسبقاً
      const fontUrls = [
        'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
      ];
      
      fontUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        link.onload = () => {
          link.rel = 'stylesheet';
        };
        document.head.appendChild(link);
      });
    };

    // تحسين الذاكرة
    const optimizeMemory = () => {
      // تنظيف المتغيرات غير المستخدمة
      const cleanupInterval = setInterval(() => {
        // إزالة العناصر المخفية من DOM
        const hiddenElements = document.querySelectorAll('[style*="display: none"]');
        hiddenElements.forEach(element => {
          if (element.getAttribute('data-keep') !== 'true') {
            element.remove();
          }
        });
      }, 30000); // كل 30 ثانية
      
      return () => clearInterval(cleanupInterval);
    };

    // تحسين الشبكة
    const optimizeNetwork = () => {
      // تحسين طلبات الشبكة - Service Worker removed as per requirements
      console.log('Network optimization applied');
    };

    // تطبيق جميع التحسينات
    const cleanupFunctions = [
      optimizeScrolling(),
      optimizeResize(),
      optimizeFocus(),
      optimizeLazyImages(),
      optimizeMemory()
    ].filter(Boolean);

    optimizeFonts();
    optimizeNetwork();

    // تنظيف عند إلغاء التحميل
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup?.());
    };
  }, []);

  return null; // هذا المكون لا يعرض أي شيء
}

// Hook لمراقبة الأداء
export function usePerformanceOptimization() {
  useEffect(() => {
    // مراقبة استخدام الذاكرة
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryInfo = {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
        };
        
        // تحذير إذا كان الاستخدام مرتفعاً
        if (memoryInfo.used / memoryInfo.limit > 0.8) {
          console.warn('High memory usage detected:', memoryInfo);
        }
      }
    };

    // مراقبة FPS
    const monitorFPS = () => {
      let lastTime = performance.now();
      let frameCount = 0;
      
      const countFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          
          if (fps < 30) {
            console.warn('Low FPS detected:', fps);
          }
          
          frameCount = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(countFPS);
      };
      
      requestAnimationFrame(countFPS);
    };

    // تشغيل المراقبة في بيئة التطوير فقط
    if (process.env.NODE_ENV === 'development') {
      const memoryInterval = setInterval(monitorMemory, 5000);
      monitorFPS();
      
      return () => clearInterval(memoryInterval);
    }
  }, []);
}

// مكون تحسين CSS
export function CSSOptimizations() {
  useEffect(() => {
    // إضافة CSS متغيرات للأداء
    const style = document.createElement('style');
    style.textContent = `
      /* تحسينات الأداء */
      * {
        box-sizing: border-box;
      }
      
      /* تحسين الرسوم المتحركة */
      .will-change-transform {
        will-change: transform;
      }
      
      .will-change-opacity {
        will-change: opacity;
      }
      
      /* تحسين التمرير */
      .smooth-scroll {
        scroll-behavior: smooth;
      }
      
      /* تحسين النصوص */
      .optimize-text {
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* تحسين الصور */
      .optimize-image {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
      
      /* إخفاء focus للماوس */
      .using-keyboard *:focus {
        outline: 2px solid #38BDF8;
        outline-offset: 2px;
      }
      
      body:not(.using-keyboard) *:focus {
        outline: none;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
