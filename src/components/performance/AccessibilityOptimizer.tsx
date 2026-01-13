'use client';

import { useEffect } from 'react';

/**
 * Accessibility Optimizer Component
 * Fixes color contrast ratios and other accessibility issues
 */
export function AccessibilityOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fix color contrast ratios
    const fixColorContrast = () => {
      // Fix email input contrast (mentioned in report)
      const emailInputs = document.querySelectorAll('input[type="email"]');
      emailInputs.forEach(input => {
        const computedStyle = window.getComputedStyle(input);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;
        
        // If contrast is too low, apply better colors
        if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
          (input as HTMLElement).style.backgroundColor = '#ffffff';
          (input as HTMLElement).style.color = '#1f2937';
          (input as HTMLElement).style.border = '1px solid #d1d5db';
        }
      });

      // Fix footer links contrast
      const footerLinks = document.querySelectorAll('footer a');
      footerLinks.forEach(link => {
        const computedStyle = window.getComputedStyle(link);
        const color = computedStyle.color;
        
        // Ensure sufficient contrast for footer links
        if (color === 'rgb(156, 163, 175)' || color === '#9ca3af') {
          (link as HTMLElement).style.color = '#374151'; // Better contrast
        }
      });

      // Fix any low contrast text
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        // Check for common low contrast combinations
        if (color === 'rgb(156, 163, 175)' && backgroundColor === 'rgb(255, 255, 255)') {
          (element as HTMLElement).style.color = '#4b5563'; // Better contrast
        }
      });
    };

    // Fix javascript:void(0) links
    const fixJavaScriptVoidLinks = () => {
      const voidLinks = document.querySelectorAll('a[href="javascript:void(0)"], a[href="javascript:void(0);"]');
      voidLinks.forEach(link => {
        const htmlLink = link as HTMLAnchorElement;

        // Replace with proper button or add proper href
        if (htmlLink.onclick || htmlLink.hasAttribute('onclick')) {
          // Convert to button if it has click handlers
          const button = document.createElement('button');
          button.innerHTML = htmlLink.innerHTML;
          button.className = htmlLink.className;
          button.setAttribute('type', 'button');

          // Copy event listeners (basic approach)
          if (htmlLink.onclick) {
            button.onclick = htmlLink.onclick;
          }

          // Replace the link with button
          htmlLink.parentNode?.replaceChild(button, htmlLink);
          console.log('Converted javascript:void(0) link to button');
        } else {
          // Add proper href or remove
          htmlLink.setAttribute('href', '#');
          htmlLink.setAttribute('role', 'button');
          console.log('Fixed javascript:void(0) link');
        }
      });
    };

    // Add missing alt attributes to images
    const fixImageAltText = () => {
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach((img, index) => {
        const src = img.getAttribute('src') || '';
        const title = img.getAttribute('title') || '';
        
        // Generate meaningful alt text
        let altText = title;
        if (!altText) {
          if (src.includes('logo')) {
            altText = 'شعار الموقع';
          } else if (src.includes('article') || src.includes('post')) {
            altText = 'صورة المقال';
          } else if (src.includes('tool') || src.includes('ai')) {
            altText = 'أداة ذكاء اصطناعي';
          } else {
            altText = `صورة ${index + 1}`;
          }
        }
        
        img.setAttribute('alt', altText);
        console.log(`Added alt text: ${altText}`);
      });
    };

    // Fix missing form labels
    const fixFormLabels = () => {
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      inputs.forEach((input, index) => {
        const type = input.getAttribute('type') || 'text';
        const placeholder = input.getAttribute('placeholder') || '';
        const name = input.getAttribute('name') || '';
        
        // Check if there's a label already
        const existingLabel = document.querySelector(`label[for="${input.id}"]`);
        if (!existingLabel && !placeholder) {
          // Add aria-label based on input type
          let label = '';
          switch (type) {
            case 'email':
              label = 'البريد الإلكتروني';
              break;
            case 'password':
              label = 'كلمة المرور';
              break;
            case 'search':
              label = 'البحث';
              break;
            case 'text':
              label = name ? `حقل ${name}` : `حقل نص ${index + 1}`;
              break;
            default:
              label = `حقل ${type} ${index + 1}`;
          }
          
          input.setAttribute('aria-label', label);
          console.log(`Added aria-label: ${label}`);
        }
      });
    };

    // Fix missing button labels
    const fixButtonLabels = () => {
      const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      buttons.forEach((button, index) => {
        const text = button.textContent?.trim();
        const title = button.getAttribute('title');
        
        if (!text && !title) {
          // Check for icon buttons
          const hasIcon = button.querySelector('svg, i, .icon');
          if (hasIcon) {
            button.setAttribute('aria-label', `زر ${index + 1}`);
            console.log(`Added aria-label to icon button: زر ${index + 1}`);
          }
        }
      });
    };

    // Add focus indicators
    const addFocusIndicators = () => {
      const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      
      focusableElements.forEach(element => {
        // Add focus styles if not present
        const computedStyle = window.getComputedStyle(element, ':focus');
        if (!computedStyle.outline || computedStyle.outline === 'none') {
          (element as HTMLElement).style.setProperty(
            'outline', 
            '2px solid #3b82f6', 
            'important'
          );
          (element as HTMLElement).style.setProperty(
            'outline-offset', 
            '2px', 
            'important'
          );
        }
      });
    };

    // Run all accessibility fixes
    const runAccessibilityFixes = () => {
      fixColorContrast();
      fixJavaScriptVoidLinks();
      fixImageAltText();
      fixFormLabels();
      fixButtonLabels();
      addFocusIndicators();
    };

    // Run fixes after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runAccessibilityFixes);
    } else {
      runAccessibilityFixes();
    }

    // Run fixes again after a delay to catch dynamically loaded content
    const timer = setTimeout(runAccessibilityFixes, 2000);

    return () => {
      document.removeEventListener('DOMContentLoaded', runAccessibilityFixes);
      clearTimeout(timer);
    };
  }, []);

  return null;
}

/**
 * SEO Link Optimizer
 * Fixes SEO-related link issues
 */
export function SEOLinkOptimizer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fixSEOLinks = () => {
      // Fix empty href attributes
      const emptyLinks = document.querySelectorAll('a[href=""], a:not([href])');
      emptyLinks.forEach(link => {
        link.setAttribute('href', '#');
        link.setAttribute('role', 'button');
        console.log('Fixed empty href link');
      });

      // Add rel="noopener" to external links
      const externalLinks = document.querySelectorAll('a[target="_blank"]:not([rel*="noopener"])');
      externalLinks.forEach(link => {
        const currentRel = link.getAttribute('rel') || '';
        link.setAttribute('rel', `${currentRel} noopener noreferrer`.trim());
        console.log('Added noopener to external link');
      });

      // Fix relative URLs
      const relativeLinks = document.querySelectorAll('a[href^="//"]:not([href^="//www."])');
      relativeLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href?.startsWith('//')) {
          link.setAttribute('href', `https:${href}`);
          console.log('Fixed protocol-relative URL');
        }
      });
    };

    fixSEOLinks();

    // Run again after delay for dynamic content
    const timer = setTimeout(fixSEOLinks, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

/**
 * Main Performance and Accessibility Optimizer
 */
export function PerformanceAccessibilityOptimizer() {
  return (
    <>
      <AccessibilityOptimizer />
      <SEOLinkOptimizer />
    </>
  );
}

export default AccessibilityOptimizer;
