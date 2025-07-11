'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to ensure DOM is ready before executing scripts
 * Helps prevent "Cannot read properties of null (reading 'parentNode')" errors
 */
export function useDOMReady() {
  const [isDOMReady, setIsDOMReady] = useState(false);

  useEffect(() => {
    // Check if DOM is already ready
    if (document.readyState === 'complete') {
      setIsDOMReady(true);
      return;
    }

    // Wait for DOM to be ready
    const handleDOMContentLoaded = () => {
      setIsDOMReady(true);
    };

    const handleLoad = () => {
      setIsDOMReady(true);
    };

    // Add event listeners
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    window.addEventListener('load', handleLoad);

    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return isDOMReady;
}

/**
 * Hook to safely execute ad scripts after DOM is ready
 */
export function useAdScript(adCode: string | null, dependencies: any[] = []) {
  const isDOMReady = useDOMReady();
  const [scriptExecuted, setScriptExecuted] = useState(false);

  useEffect(() => {
    if (!isDOMReady || !adCode || scriptExecuted) {
      return;
    }

    // Add a small delay to ensure all DOM elements are rendered
    const timer = setTimeout(() => {
      try {
        // Create a temporary container to safely execute the script
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = adCode;
        
        // Execute any scripts in the ad code
        const scripts = tempDiv.querySelectorAll('script');
        scripts.forEach((script) => {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
          } else {
            newScript.textContent = script.textContent;
          }
          document.head.appendChild(newScript);
        });

        setScriptExecuted(true);
      } catch (error) {
        console.warn('Error executing ad script:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isDOMReady, adCode, scriptExecuted, ...dependencies]);

  return { isDOMReady, scriptExecuted };
}
