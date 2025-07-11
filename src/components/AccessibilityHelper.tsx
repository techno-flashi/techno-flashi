'use client';

import { useEffect, useState } from 'react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  suggestion: string;
}

interface AccessibilityHelperProps {
  enabled?: boolean;
  showReport?: boolean;
}

export function AccessibilityHelper({ 
  enabled = process.env.NODE_ENV === 'development',
  showReport = false 
}: AccessibilityHelperProps) {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const checkAccessibility = () => {
      const foundIssues: AccessibilityIssue[] = [];

      // Check for images without alt text
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          foundIssues.push({
            type: 'error',
            message: `صورة بدون نص بديل`,
            element: `img[${index}]`,
            suggestion: 'أضف خاصية alt أو aria-label للصورة'
          });
        }
      });

      // Check for buttons without accessible names
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button, index) => {
        const hasText = button.textContent?.trim();
        const hasAriaLabel = button.getAttribute('aria-label');
        const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
        
        if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
          foundIssues.push({
            type: 'error',
            message: `زر بدون اسم يمكن الوصول إليه`,
            element: `button[${index}]`,
            suggestion: 'أضف نص أو aria-label أو aria-labelledby للزر'
          });
        }
      });

      // Check for links without accessible names
      const links = document.querySelectorAll('a');
      links.forEach((link, index) => {
        const hasText = link.textContent?.trim();
        const hasAriaLabel = link.getAttribute('aria-label');
        
        if (!hasText && !hasAriaLabel) {
          foundIssues.push({
            type: 'error',
            message: `رابط بدون نص وصفي`,
            element: `a[${index}]`,
            suggestion: 'أضف نص وصفي أو aria-label للرابط'
          });
        }
      });

      // Check for form inputs without labels
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach((input, index) => {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.getAttribute('aria-label');
        const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
        
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
          foundIssues.push({
            type: 'warning',
            message: `حقل إدخال بدون تسمية`,
            element: `${input.tagName.toLowerCase()}[${index}]`,
            suggestion: 'أضف label أو aria-label أو aria-labelledby للحقل'
          });
        }
      });

      // Check for headings hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      headings.forEach((heading, index) => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        
        if (currentLevel > previousLevel + 1) {
          foundIssues.push({
            type: 'warning',
            message: `تسلسل العناوين غير صحيح`,
            element: `${heading.tagName.toLowerCase()}[${index}]`,
            suggestion: 'تأكد من التسلسل المنطقي للعناوين (h1, h2, h3...)'
          });
        }
        
        previousLevel = currentLevel;
      });

      // Check for color contrast (basic check)
      const elementsWithText = document.querySelectorAll('p, span, div, a, button, h1, h2, h3, h4, h5, h6');
      elementsWithText.forEach((element, index) => {
        const styles = window.getComputedStyle(element);
        const backgroundColor = styles.backgroundColor;
        const color = styles.color;
        
        // Simple check for very low contrast (this is a basic implementation)
        if (backgroundColor === 'rgb(255, 255, 255)' && color === 'rgb(255, 255, 255)') {
          foundIssues.push({
            type: 'error',
            message: `تباين ألوان ضعيف`,
            element: `${element.tagName.toLowerCase()}[${index}]`,
            suggestion: 'تأكد من وجود تباين كافي بين لون النص ولون الخلفية'
          });
        }
      });

      // Check for touch target sizes on mobile
      if (window.innerWidth <= 768) {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        interactiveElements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const minSize = 44; // WCAG recommendation
          
          if (rect.width < minSize || rect.height < minSize) {
            foundIssues.push({
              type: 'warning',
              message: `هدف لمس صغير (${Math.round(rect.width)}×${Math.round(rect.height)}px)`,
              element: `${element.tagName.toLowerCase()}[${index}]`,
              suggestion: `اجعل الهدف على الأقل ${minSize}×${minSize}px للاستخدام السهل على الموبايل`
            });
          }
        });
      }

      setIssues(foundIssues);
    };

    // Run initial check
    checkAccessibility();

    // Run check when DOM changes
    const observer = new MutationObserver(checkAccessibility);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['alt', 'aria-label', 'aria-labelledby']
    });

    return () => observer.disconnect();
  }, [enabled]);

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'info':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const getIssueColor = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!enabled) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        aria-label={isVisible ? "إخفاء تقرير إمكانية الوصول" : "عرض تقرير إمكانية الوصول"}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {issues.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {issues.length}
          </span>
        )}
      </button>

      {/* Accessibility report panel */}
      {isVisible && (
        <div className="fixed top-16 left-4 z-40 bg-dark-card border border-gray-700 rounded-lg p-4 shadow-xl max-w-md max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-sm">تقرير إمكانية الوصول</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="إغلاق التقرير"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {issues.length === 0 ? (
            <div className="text-green-400 text-sm flex items-center">
              <span className="mr-2">✅</span>
              لم يتم العثور على مشاكل في إمكانية الوصول
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <div key={index} className="border border-gray-600 rounded-lg p-3">
                  <div className={`font-medium text-sm ${getIssueColor(issue.type)} flex items-center mb-1`}>
                    <span className="mr-2">{getIssueIcon(issue.type)}</span>
                    {issue.message}
                  </div>
                  {issue.element && (
                    <div className="text-xs text-gray-400 mb-2 font-mono">
                      {issue.element}
                    </div>
                  )}
                  <div className="text-xs text-gray-300">
                    {issue.suggestion}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400">
            <div>المجموع: {issues.length} مشكلة</div>
            <div>🔴 أخطاء: {issues.filter(i => i.type === 'error').length}</div>
            <div>🟡 تحذيرات: {issues.filter(i => i.type === 'warning').length}</div>
          </div>
        </div>
      )}
    </>
  );
}

// Hook لفحص إمكانية الوصول
export function useAccessibilityCheck() {
  const [issueCount, setIssueCount] = useState(0);

  useEffect(() => {
    // This would integrate with the AccessibilityHelper component
    // to provide issue count to other components
  }, []);

  return { issueCount };
}
