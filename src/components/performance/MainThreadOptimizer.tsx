'use client';

import { useEffect } from 'react';

// --- Helper Functions ---

/**
 * Schedules a callback to run when the browser is idle or with a fallback.
 * Uses the Scheduler API if available for prioritization.
 */
const scheduleWork = (callback: () => void, priority: 'user-visible' | 'background' = 'user-visible') => {
  if (typeof window === 'undefined') return;

  if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
    (window as any).scheduler.postTask(callback, { priority }).catch(() => {
      // Fallback for browsers that don't support priority
      (window as any).scheduler.postTask(callback);
    });
  } else if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0); // Fallback for older browsers
  }
};

/**
 * Defers non-critical scripts to avoid blocking the main thread.
 */
const optimizeScriptEvaluation = () => {
  const nonCriticalPatterns = [
    'analytics', 'gtag', 'facebook', 'twitter', 'linkedin',
    'pinterest', 'ads', 'adsense', 'doubleclick', 'ezojs', 'gatekeeperconsent'
  ];
  document.querySelectorAll('script[src]').forEach(script => {
    const src = script.getAttribute('src') || '';
    const isNonCritical = nonCriticalPatterns.some(pattern => src.toLowerCase().includes(pattern));
    if (isNonCritical && !script.hasAttribute('defer') && !script.hasAttribute('async')) {
      script.setAttribute('defer', '');
      console.log(`Deferred non-critical script: ${src}`);
    }
  });
};

/**
 * Batches DOM style updates to reduce layout thrashing.
 * Applies `will-change` to hint browser about upcoming transformations.
 */
const optimizeStyleAndLayout = () => {
  const updates: (() => void)[] = [];
  document.querySelectorAll('[style*="transform"], [style*="opacity"]').forEach(element => {
    updates.push(() => {
      (element as HTMLElement).style.willChange = 'transform, opacity';
    });
  });

  if (updates.length > 0) {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  }
};

/**
 * Wraps images without dimensions in an aspect-ratio container to prevent layout shifts.
 */
const optimizeImageLoading = () => {
  document.querySelectorAll('img:not([width]):not([height])').forEach(imgElement => {
    const img = imgElement as HTMLImageElement;
    // **THE FIX IS HERE**: Check for `img.parentNode` to ensure it's not null.
    // Also check if the element has already been wrapped.
    if (img.parentNode && !img.parentElement?.classList.contains('aspect-ratio-container')) {
      const container = document.createElement('div');
      container.className = 'aspect-ratio-container';
      
      const aspectRatio = img.naturalWidth && img.naturalHeight ? `${img.naturalWidth}/${img.naturalHeight}` : '16/9';
      container.style.cssText = `position: relative; width: 100%; aspect-ratio: ${aspectRatio}; overflow: hidden;`;
      
      // Now it's safe to use img.parentNode
      img.parentNode.insertBefore(container, img);
      container.appendChild(img);

      img.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;`;
    }
  });
};


/**
 * Asynchronously loads non-critical CSS to prevent render-blocking.
 */
const deferNonCriticalCSS = () => {
  const nonCriticalPatterns = ['font-awesome', 'bootstrap', 'material-icons', 'animate.css', 'aos.css'];
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isNonCritical = nonCriticalPatterns.some(pattern => href.toLowerCase().includes(pattern));
    if (isNonCritical) {
      link.setAttribute('media', 'print');
      link.setAttribute('onload', "this.media='all'");
      console.log(`Deferred non-critical CSS: ${href}`);
    }
  });
};

/**
 * Modifies @font-face rules to include `font-display: swap`.
 */
const optimizeFontLoading = () => {
  document.querySelectorAll('style').forEach(style => {
    if (style.textContent?.includes('@font-face')) {
      const content = style.textContent;
      if (!content.includes('font-display')) {
        style.textContent = content.replace(/(@font-face\s*{)/g, '$1 font-display: swap;');
      }
    }
  });
};

/**
 * Main Thread Optimizer Component
 * Applies various optimizations to reduce main thread work.
 */
export function MainThreadOptimizer() {
  useEffect(() => {
    const runAllOptimizations = () => {
      console.log('🚀 Running main thread optimizations...');
      // High priority - immediate impact on rendering
      scheduleWork(optimizeScriptEvaluation, 'user-visible');
      scheduleWork(optimizeStyleAndLayout, 'user-visible');
      
      // Normal priority - important for user experience
      scheduleWork(optimizeImageLoading, 'user-visible');
      scheduleWork(deferNonCriticalCSS, 'user-visible');

      // Low priority - can run in the background
      scheduleWork(optimizeFontLoading, 'background');
    };

    if (document.readyState === 'complete') {
      runAllOptimizations();
    } else {
      window.addEventListener('load', runAllOptimizations, { once: true });
    }

    return () => {
      window.removeEventListener('load', runAllOptimizations);
    };
  }, []);

  return null; // This component does not render anything
}

export default MainThreadOptimizer;