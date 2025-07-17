'use client';

import { useEffect, useState } from 'react';
import { devCacheUtils, clientCacheUtils } from '@/lib/cache-invalidation';

interface CacheManagerProps {
  enabled?: boolean;
  showDebugInfo?: boolean;
}

/**
 * Cache Manager Component
 * Provides cache management utilities for development and production
 */
export function CacheManager({ enabled = false, showDebugInfo = false }: CacheManagerProps) {
  const [cacheStatus, setCacheStatus] = useState<string>('Unknown');
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Check cache status on mount
    checkCacheStatus();

    // Set up periodic cache status checks
    const interval = setInterval(checkCacheStatus, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [enabled]);

  const checkCacheStatus = async () => {
    if (typeof window === 'undefined') return;

    try {
      let totalItems = 0;

      // Count service worker cache items
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          totalItems += keys.length;
        }
      }

      // Count localStorage items
      if ('localStorage' in window) {
        totalItems += localStorage.length;
      }

      setCacheStatus(`${totalItems} cached items`);
    } catch (error) {
      setCacheStatus('Error checking cache');
      console.error('Cache status check failed:', error);
    }
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    
    try {
      await clientCacheUtils.clearBrowserCache();
      await checkCacheStatus();
      
      // Show success message
      if (showDebugInfo) {
        console.log('✅ Cache cleared successfully');
      }
      
      // Optional: Reload page after cache clear
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleForceReload = () => {
    clientCacheUtils.forceReload();
  };

  const handleLogCacheStatus = () => {
    devCacheUtils.logCacheStatus();
  };

  // Don't render anything if not enabled
  if (!enabled) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm"
      style={{ fontSize: '12px' }}
    >
      <div className="mb-2">
        <strong>Cache Manager</strong>
      </div>
      
      <div className="mb-2 text-gray-300">
        Status: {cacheStatus}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleClearCache}
          disabled={isClearing}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 px-3 py-1 rounded text-xs transition-colors"
        >
          {isClearing ? 'Clearing...' : 'Clear All Cache'}
        </button>

        <button
          onClick={handleForceReload}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs transition-colors"
        >
          Force Reload
        </button>

        {showDebugInfo && (
          <button
            onClick={handleLogCacheStatus}
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs transition-colors"
          >
            Log Cache Status
          </button>
        )}
      </div>

      {showDebugInfo && (
        <div className="mt-2 text-xs text-gray-400">
          <div>SW: {navigator.serviceWorker ? '✅' : '❌'}</div>
          <div>Cache API: {'caches' in window ? '✅' : '❌'}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Auto Cache Invalidator
 * Automatically clears cache when new deployments are detected
 */
export function AutoCacheInvalidator() {
  useEffect(() => {
    // Check for new deployments by comparing build timestamps
    const checkForUpdates = async () => {
      try {
        // Try to fetch a timestamp or version endpoint
        const response = await fetch('/api/version', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const currentVersion = localStorage.getItem('app-version');
          
          if (currentVersion && currentVersion !== data.version) {
            console.log('🔄 New deployment detected, clearing cache...');
            await clientCacheUtils.clearBrowserCache();
            localStorage.setItem('app-version', data.version);
            
            // Optionally reload the page
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else if (!currentVersion) {
            localStorage.setItem('app-version', data.version);
          }
        }
      } catch (error) {
        // Silently fail - version endpoint might not exist
        console.debug('Version check failed:', error);
      }
    };

    // Check on mount
    checkForUpdates();

    // Check periodically (every 5 minutes)
    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}

/**
 * Service Worker Cache Updater
 * Forces service worker to update and clear old caches
 */
export function ServiceWorkerUpdater() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const updateServiceWorker = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        
        for (const registration of registrations) {
          // Force update
          await registration.update();
          
          // Listen for new service worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 New service worker available, clearing cache...');
                  
                  // Clear cache and reload
                  clientCacheUtils.clearBrowserCache().then(() => {
                    window.location.reload();
                  });
                }
              });
            }
          });
        }
      } catch (error) {
        console.error('Service worker update failed:', error);
      }
    };

    updateServiceWorker();
  }, []);

  return null;
}

export default CacheManager;
