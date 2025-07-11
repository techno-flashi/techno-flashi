'use client';

import { useEffect, useRef } from 'react';
import { useDOMReady } from '@/hooks/useDOMReady';

interface SafeAdScriptProps {
  adCode: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Safe component for rendering ad scripts that prevents DOM manipulation errors
 */
export default function SafeAdScript({ 
  adCode, 
  className = '', 
  fallback = null 
}: SafeAdScriptProps) {
  const isDOMReady = useDOMReady();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptExecutedRef = useRef(false);

  useEffect(() => {
    if (!isDOMReady || !adCode || scriptExecutedRef.current || !containerRef.current) {
      return;
    }

    // Add a small delay to ensure the container is fully rendered
    const timer = setTimeout(() => {
      try {
        const container = containerRef.current;
        if (!container) return;

        // Clear any existing content
        container.innerHTML = '';

        // Create a safe wrapper for the ad code
        const adWrapper = document.createElement('div');
        adWrapper.className = 'ad-content-wrapper';
        
        // Set the ad code
        adWrapper.innerHTML = adCode;

        // Handle any scripts in the ad code
        const scripts = adWrapper.querySelectorAll('script');
        scripts.forEach((oldScript) => {
          const newScript = document.createElement('script');
          
          // Copy attributes
          Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });

          // Copy content
          if (oldScript.src) {
            newScript.src = oldScript.src;
          } else {
            newScript.textContent = oldScript.textContent;
          }

          // Replace the old script with the new one
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });

        // Append to container
        container.appendChild(adWrapper);
        scriptExecutedRef.current = true;

      } catch (error) {
        console.warn('Error rendering ad script:', error);
        
        // Show fallback on error
        if (containerRef.current && fallback) {
          containerRef.current.innerHTML = '';
          // Note: We can't directly render React components here,
          // so we'll just show a simple error message
          containerRef.current.innerHTML = '<div class="text-gray-500 text-sm">إعلان غير متاح</div>';
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isDOMReady, adCode, fallback]);

  // Show loading state while DOM is not ready
  if (!isDOMReady) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
        <div className="h-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`safe-ad-container ${className}`}
      style={{ minHeight: '20px' }}
    />
  );
}
