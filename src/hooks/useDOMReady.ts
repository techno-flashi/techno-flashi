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


