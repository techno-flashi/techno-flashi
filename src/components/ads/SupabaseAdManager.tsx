'use client';

import { useEffect, useState, useRef } from 'react';
import { getAdsForPage, trackAdPerformance, type SupabaseAd } from '@/lib/supabase-ads';

interface SupabaseAdManagerProps {
  position: 'header' | 'sidebar' | 'footer' | 'in-content' | 'popup';
  currentPage: string;
  className?: string;
  showDebug?: boolean;
}

export default function SupabaseAdManager({ 
  position, 
  currentPage, 
  className = '',
  showDebug = false 
}: SupabaseAdManagerProps) {
  const [ads, setAds] = useState<SupabaseAd[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const scriptLoadedRef = useRef<Set<string>>(new Set());

  // Load ads from Supabase
  useEffect(() => {
    const loadAds = async () => {
      try {
        const fetchedAds = await getAdsForPage(currentPage, position);
        setAds(fetchedAds);
        setIsLoaded(true);
        
        if (fetchedAds.length > 0) {
          console.log(`Loaded ${fetchedAds.length} ads for position: ${position}, page: ${currentPage}`);
        }
      } catch (err) {
        console.error('Error loading ads:', err);
        setError('Failed to load ads');
        setIsLoaded(true);
      }
    };

    loadAds();
  }, [currentPage, position]);

  // Load ad script
  useEffect(() => {
    if (!isLoaded || ads.length === 0) return;

    const currentAd = ads[currentAdIndex];
    if (!currentAd || scriptLoadedRef.current.has(currentAd.id)) return;

    const loadAdScript = async () => {
      try {
        // Add delay if specified
        if (currentAd.delay_seconds && currentAd.delay_seconds > 0) {
          await new Promise(resolve => setTimeout(resolve, currentAd.delay_seconds! * 1000));
        }

        // Create and execute script
        const script = document.createElement('script');
        script.innerHTML = currentAd.script_code;
        script.setAttribute('data-ad-id', currentAd.id);
        
        // Add to body
        document.body.appendChild(script);
        scriptLoadedRef.current.add(currentAd.id);
        
        // Track ad load
        await trackAdPerformance(currentAd.id, 'load', currentPage);
        
        console.log(`Ad loaded: ${currentAd.name} (${currentAd.id})`);
        
        // Track view after 1 second
        setTimeout(async () => {
          await trackAdPerformance(currentAd.id, 'view', currentPage);
        }, 1000);
        
      } catch (error) {
        console.error('Failed to load ad script:', error);
        setError(`Failed to load ad: ${currentAd.name}`);
      }
    };

    loadAdScript();
  }, [isLoaded, ads, currentAdIndex, currentPage]);

  // Handle ad click
  const handleAdClick = async () => {
    if (ads.length > 0) {
      const currentAd = ads[currentAdIndex];
      await trackAdPerformance(currentAd.id, 'click', currentPage);
      console.log(`Ad clicked: ${currentAd.name}`);
    }
  };

  // Rotate ads if multiple available
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % ads.length);
    }, 30000); // Rotate every 30 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  // Don't show on admin pages
  if (currentPage.startsWith('/admin') || currentPage.startsWith('/api')) {
    return null;
  }

  // Debug logging
  if (showDebug) {
    console.log(`SupabaseAdManager: position=${position}, currentPage=${currentPage}, ads=${ads.length}, isLoaded=${isLoaded}`);
  }

  if (!isLoaded) {
    return showDebug ? (
      <div className={`supabase-ad-loading ${className}`} style={{ 
        padding: '10px', 
        background: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <small>Loading ads...</small>
      </div>
    ) : null;
  }

  if (error) {
    return showDebug ? (
      <div className={`supabase-ad-error ${className}`} style={{ 
        padding: '10px', 
        background: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <small>Error: {error}</small>
      </div>
    ) : null;
  }

  if (ads.length === 0) {
    return showDebug ? (
      <div className={`supabase-ad-empty ${className}`} style={{ 
        padding: '10px', 
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <small>No ads available for position: {position}</small>
      </div>
    ) : null;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div 
      className={`supabase-ad-container supabase-ad-${position} ${className}`}
      data-ad-id={currentAd.id}
      data-ad-name={currentAd.name}
      data-zone-id={currentAd.zone_id}
      onClick={handleAdClick}
      style={{
        minHeight: position === 'header' ? '90px' : 
                  position === 'sidebar' ? '250px' : 
                  position === 'footer' ? '90px' : '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        margin: position === 'in-content' ? '20px 0' : '10px 0',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
    >
      {/* Ad content */}
      <div className="supabase-ad-content w-full h-full">
        {currentAd.html_code ? (
          <div dangerouslySetInnerHTML={{ __html: currentAd.html_code }} />
        ) : (
          <div className="supabase-ad-placeholder text-center p-4">
            <div className="text-sm text-gray-500 mb-2">{currentAd.name}</div>
            <div className="text-xs text-gray-400">
              {currentAd.type.toUpperCase()} - Zone: {currentAd.zone_id}
            </div>
            {ads.length > 1 && (
              <div className="text-xs text-gray-400 mt-1">
                Ad {currentAdIndex + 1} of {ads.length}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Ad label */}
      <div 
        style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          fontSize: '10px',
          color: '#6c757d',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '1px 4px',
          borderRadius: '2px',
          zIndex: 10
        }}
      >
        إعلان
      </div>

      {/* Debug info */}
      {showDebug && (
        <div 
          style={{
            position: 'absolute',
            bottom: '2px',
            left: '2px',
            fontSize: '10px',
            color: '#007bff',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '1px 4px',
            borderRadius: '2px',
            zIndex: 10
          }}
        >
          ID: {currentAd.id.substring(0, 8)}
        </div>
      )}
    </div>
  );
}

// Pre-configured components for easy use
export function SupabaseHeaderAd({ currentPage, className }: { currentPage: string; className?: string }) {
  return <SupabaseAdManager position="header" currentPage={currentPage} className={className} />;
}

export function SupabaseSidebarAd({ currentPage, className }: { currentPage: string; className?: string }) {
  return <SupabaseAdManager position="sidebar" currentPage={currentPage} className={className} />;
}

export function SupabaseInContentAd({ currentPage, className }: { currentPage: string; className?: string }) {
  return <SupabaseAdManager position="in-content" currentPage={currentPage} className={className} />;
}

export function SupabaseFooterAd({ currentPage, className }: { currentPage: string; className?: string }) {
  return <SupabaseAdManager position="footer" currentPage={currentPage} className={className} />;
}

// Hook for managing ads
export function useSupabaseAds(currentPage: string, position: string) {
  const [ads, setAds] = useState<SupabaseAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAds = async () => {
      try {
        setIsLoading(true);
        const fetchedAds = await getAdsForPage(currentPage, position);
        setAds(fetchedAds);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ads');
      } finally {
        setIsLoading(false);
      }
    };

    loadAds();
  }, [currentPage, position]);

  return { ads, isLoading, error };
}
