'use client';

import { useEffect } from 'react';

interface AccessibilityFixerProps {
  enabled?: boolean;
  autoFix?: boolean;
}

export function AccessibilityFixer({ 
  enabled = process.env.NODE_ENV === 'development',
  autoFix = false 
}: AccessibilityFixerProps) {
  useEffect(() => {
    if (!enabled) return;

    const fixAccessibilityIssues = () => {
      // إصلاح الصور بدون alt text
      const fixImages = () => {
        const images = document.querySelectorAll('img:not([alt]):not([aria-label])');
        images.forEach((img, index) => {
          const imgElement = img as HTMLImageElement;
          if (autoFix) {
            // إضافة alt text تلقائياً
            const src = imgElement.src;
            const filename = src.split('/').pop()?.split('.')[0] || 'صورة';
            imgElement.alt = `صورة: ${filename}`;
            console.log(`تم إصلاح: إضافة alt text للصورة ${index + 1}`);
          } else {
            console.warn(`صورة بدون alt text: ${imgElement.src}`);
          }
        });
      };

      // إصلاح الأزرار بدون أسماء يمكن الوصول إليها
      const fixButtons = () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button, index) => {
          const hasText = button.textContent?.trim();
          const hasAriaLabel = button.getAttribute('aria-label');
          const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
          
          if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
            if (autoFix) {
              // إضافة aria-label تلقائياً
              const buttonType = button.type || 'button';
              button.setAttribute('aria-label', `زر ${buttonType} ${index + 1}`);
              console.log(`تم إصلاح: إضافة aria-label للزر ${index + 1}`);
            } else {
              console.warn(`زر بدون اسم يمكن الوصول إليه:`, button);
            }
          }
        });
      };

      // إصلاح الروابط بدون أسماء يمكن الوصول إليها
      const fixLinks = () => {
        const links = document.querySelectorAll('a');
        links.forEach((link, index) => {
          const hasText = link.textContent?.trim();
          const hasAriaLabel = link.getAttribute('aria-label');
          
          if (!hasText && !hasAriaLabel) {
            if (autoFix) {
              const href = link.href;
              const linkText = href ? `رابط إلى ${href}` : `رابط ${index + 1}`;
              link.setAttribute('aria-label', linkText);
              console.log(`تم إصلاح: إضافة aria-label للرابط ${index + 1}`);
            } else {
              console.warn(`رابط بدون نص وصفي:`, link);
            }
          }
        });
      };

      // إصلاح حقول الإدخال بدون تسميات
      const fixInputs = () => {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach((input, index) => {
          const inputElement = input as HTMLInputElement;
          const id = inputElement.id;
          const hasLabel = id && document.querySelector(`label[for="${id}"]`);
          const hasAriaLabel = inputElement.getAttribute('aria-label');
          const hasAriaLabelledBy = inputElement.getAttribute('aria-labelledby');
          const placeholder = inputElement.placeholder;
          
          if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
            if (autoFix) {
              // إضافة aria-label بناءً على placeholder أو نوع الحقل
              let labelText = placeholder || `حقل ${inputElement.type || inputElement.tagName.toLowerCase()}`;
              inputElement.setAttribute('aria-label', labelText);
              console.log(`تم إصلاح: إضافة aria-label للحقل ${index + 1}`);
            } else {
              console.warn(`حقل إدخال بدون تسمية:`, inputElement);
            }
          }
        });
      };

      // إصلاح تسلسل العناوين
      const fixHeadings = () => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        let issues: { element: HTMLElement; currentLevel: number; expectedLevel: number }[] = [];
        
        headings.forEach((heading) => {
          const currentLevel = parseInt(heading.tagName.charAt(1));
          
          if (currentLevel > previousLevel + 1) {
            issues.push({
              element: heading as HTMLElement,
              currentLevel,
              expectedLevel: previousLevel + 1
            });
          }
          
          previousLevel = currentLevel;
        });

        if (issues.length > 0) {
          if (autoFix) {
            issues.forEach((issue, index) => {
              const newTagName = `h${issue.expectedLevel}`;
              const newElement = document.createElement(newTagName);
              newElement.innerHTML = issue.element.innerHTML;
              newElement.className = issue.element.className;
              
              // نسخ جميع الخصائص
              Array.from(issue.element.attributes).forEach(attr => {
                if (attr.name !== 'class') {
                  newElement.setAttribute(attr.name, attr.value);
                }
              });
              
              issue.element.parentNode?.replaceChild(newElement, issue.element);
              console.log(`تم إصلاح: تغيير ${issue.element.tagName} إلى ${newTagName}`);
            });
          } else {
            issues.forEach((issue) => {
              console.warn(`تسلسل عناوين غير صحيح: ${issue.element.tagName} يجب أن يكون h${issue.expectedLevel}`);
            });
          }
        }
      };

      // إصلاح أحجام أهداف اللمس
      const fixTouchTargets = () => {
        if (window.innerWidth <= 768) {
          const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
          interactiveElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const minSize = 44;
            
            if (rect.width < minSize || rect.height < minSize) {
              if (autoFix) {
                const el = element as HTMLElement;
                el.style.minWidth = `${minSize}px`;
                el.style.minHeight = `${minSize}px`;
                el.style.padding = el.style.padding || '8px';
                console.log(`تم إصلاح: تحسين حجم هدف اللمس للعنصر ${index + 1}`);
              } else {
                console.warn(`هدف لمس صغير: ${Math.round(rect.width)}×${Math.round(rect.height)}px`);
              }
            }
          });
        }
      };

      // إضافة خصائص ARIA المفقودة
      const addMissingAriaAttributes = () => {
        // إضافة role للعناصر التفاعلية
        const interactiveElements = document.querySelectorAll('div[onclick], span[onclick]');
        interactiveElements.forEach((element) => {
          if (!element.getAttribute('role')) {
            if (autoFix) {
              element.setAttribute('role', 'button');
              element.setAttribute('tabindex', '0');
              console.log('تم إصلاح: إضافة role="button" لعنصر تفاعلي');
            }
          }
        });

        // إضافة aria-expanded للقوائم المنسدلة
        const dropdowns = document.querySelectorAll('[data-dropdown], .dropdown-toggle');
        dropdowns.forEach((dropdown) => {
          if (!dropdown.getAttribute('aria-expanded')) {
            if (autoFix) {
              dropdown.setAttribute('aria-expanded', 'false');
              console.log('تم إصلاح: إضافة aria-expanded للقائمة المنسدلة');
            }
          }
        });
      };

      // تشغيل جميع الإصلاحات
      fixImages();
      fixButtons();
      fixLinks();
      fixInputs();
      fixHeadings();
      fixTouchTargets();
      addMissingAriaAttributes();
    };

    // تشغيل الفحص الأولي
    fixAccessibilityIssues();

    // مراقبة التغييرات في DOM
    const observer = new MutationObserver(() => {
      setTimeout(fixAccessibilityIssues, 100); // تأخير قصير للسماح بتحديث DOM
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['alt', 'aria-label', 'aria-labelledby', 'role']
    });

    return () => observer.disconnect();
  }, [enabled, autoFix]);

  return null;
}

// Hook لاستخدام إصلاح إمكانية الوصول
export function useAccessibilityFixer(autoFix = false) {
  useEffect(() => {
    // يمكن استخدام هذا Hook في المكونات الفردية
    const fixCurrentComponent = () => {
      // إصلاحات محددة للمكون الحالي
    };

    if (process.env.NODE_ENV === 'development') {
      fixCurrentComponent();
    }
  }, [autoFix]);
}

// مكون لعرض تقرير إمكانية الوصول
export function AccessibilityReport() {
  useEffect(() => {
    const generateReport = () => {
      const issues = {
        images: document.querySelectorAll('img:not([alt]):not([aria-label])').length,
        buttons: Array.from(document.querySelectorAll('button')).filter(btn => 
          !btn.textContent?.trim() && !btn.getAttribute('aria-label') && !btn.getAttribute('aria-labelledby')
        ).length,
        links: Array.from(document.querySelectorAll('a')).filter(link => 
          !link.textContent?.trim() && !link.getAttribute('aria-label')
        ).length,
        inputs: Array.from(document.querySelectorAll('input, select, textarea')).filter(input => {
          const id = input.id;
          const hasLabel = id && document.querySelector(`label[for="${id}"]`);
          const hasAriaLabel = input.getAttribute('aria-label');
          const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
          return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy;
        }).length
      };

      console.log('تقرير إمكانية الوصول:', issues);
      return issues;
    };

    if (process.env.NODE_ENV === 'development') {
      setTimeout(generateReport, 1000);
    }
  }, []);

  return null;
}
