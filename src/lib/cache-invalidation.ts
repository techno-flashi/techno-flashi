// Cache Invalidation Utilities for TechnoFlash
// Comprehensive cache clearing for immediate updates

import { cache } from './cache';

/**
 * Clear all application-level caches
 */
export function clearApplicationCache(): void {
  try {
    cache.clear();
    console.log('✅ Application cache cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing application cache:', error);
  }
}

/**
 * Clear specific cache keys by pattern
 */
export function clearCacheByPattern(pattern: string): void {
  try {
    // This would need to be implemented in the cache class
    // For now, we'll clear all cache
    cache.clear();
    console.log(`✅ Cache cleared for pattern: ${pattern}`);
  } catch (error) {
    console.error(`❌ Error clearing cache for pattern ${pattern}:`, error);
  }
}

/**
 * Client-side cache clearing utilities
 */
export const clientCacheUtils = {
  /**
   * Clear browser cache programmatically
   */
  clearBrowserCache: async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    try {
      // Clear service worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Service Worker caches cleared');
      }

      // Clear localStorage
      if ('localStorage' in window) {
        localStorage.clear();
        console.log('✅ localStorage cleared');
      }

      // Clear sessionStorage
      if ('sessionStorage' in window) {
        sessionStorage.clear();
        console.log('✅ sessionStorage cleared');
      }

      // Force service worker update
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.update();
          console.log('✅ Service Worker updated');
        }
      }

    } catch (error) {
      console.error('❌ Error clearing browser cache:', error);
    }
  },

  /**
   * Force page reload with cache bypass
   */
  forceReload: (): void => {
    if (typeof window === 'undefined') return;
    
    // Force reload bypassing cache
    window.location.reload();
  },

  /**
   * Send message to service worker to clear cache
   */
  clearServiceWorkerCache: async (): Promise<void> => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration.active) {
        const messageChannel = new MessageChannel();
        
        return new Promise((resolve) => {
          messageChannel.port1.onmessage = (event) => {
            if (event.data.success) {
              console.log('✅ Service Worker cache cleared via message');
              resolve();
            }
          };

          registration.active?.postMessage(
            { type: 'CLEAR_CACHE' },
            [messageChannel.port2]
          );
        });
      }
    } catch (error) {
      console.error('❌ Error clearing service worker cache:', error);
    }
  }
};

/**
 * Development utilities for cache management
 */
export const devCacheUtils = {
  /**
   * Log current cache status
   */
  logCacheStatus: async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    console.group('🔍 Cache Status');
    
    try {
      // Service Worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log('Service Worker Caches:', cacheNames);
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          console.log(`  ${cacheName}: ${keys.length} items`);
        }
      }

      // localStorage
      if ('localStorage' in window) {
        console.log('localStorage items:', localStorage.length);
      }

      // sessionStorage
      if ('sessionStorage' in window) {
        console.log('sessionStorage items:', sessionStorage.length);
      }

    } catch (error) {
      console.error('Error checking cache status:', error);
    }
    
    console.groupEnd();
  },

  /**
   * Clear all caches and reload
   */
  clearAllAndReload: async (): Promise<void> => {
    console.log('🧹 Clearing all caches and reloading...');
    
    clearApplicationCache();
    await clientCacheUtils.clearBrowserCache();
    
    // Wait a bit for cleanup to complete
    setTimeout(() => {
      clientCacheUtils.forceReload();
    }, 1000);
  }
};

/**
 * Cache invalidation for specific content types
 */
export const contentCacheUtils = {
  /**
   * Invalidate article-related caches
   */
  invalidateArticleCache: (articleSlug?: string): void => {
    clearCacheByPattern('articles');
    if (articleSlug) {
      clearCacheByPattern(`article-${articleSlug}`);
    }
  },

  /**
   * Invalidate AI tools caches
   */
  invalidateAIToolsCache: (toolSlug?: string): void => {
    clearCacheByPattern('ai-tools');
    if (toolSlug) {
      clearCacheByPattern(`ai-tool-${toolSlug}`);
    }
  },

  /**
   * Invalidate homepage cache
   */
  invalidateHomepageCache: (): void => {
    clearCacheByPattern('homepage');
    clearCacheByPattern('latest-articles');
    clearCacheByPattern('featured-tools');
  }
};

// Export all utilities
export default {
  clearApplicationCache,
  clearCacheByPattern,
  client: clientCacheUtils,
  dev: devCacheUtils,
  content: contentCacheUtils
};
