'use client';

import { useEffect, useState, useRef } from 'react';
import { getAdvancedAds, type AdvancedAd } from '@/lib/advanced-ads';

interface AnimatedAdRendererProps {
  position: 'header' | 'sidebar' | 'footer' | 'in-content';
  currentPage?: string;
  className?: string;
  maxAds?: number;
  showDebug?: boolean;
}

/**
 * Animated Ad Renderer - Displays animated advertisements from the ads table
 * Supports all animation types: scrolling, fade, typewriter, bouncing, gradient, sliding
 */
export default function AnimatedAdRenderer({ 
  position, 
  currentPage = '*', 
  className = '',
  maxAds = 1,
  showDebug = false 
}: AnimatedAdRendererProps) {
  const [ads, setAds] = useState<AdvancedAd[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const styleInjectedRef = useRef<Set<string>>(new Set());

  // Load ads from Supabase
  useEffect(() => {
    const loadAds = async () => {
      try {
        setIsLoaded(false);
        const fetchedAds = await getAdvancedAds({
          enabled: true,
          position,
          network: 'affiliate' // Get Hostinger affiliate ads
        });

        // Filter ads based on targeting
        const filteredAds = fetchedAds.filter(ad => {
          // Check page targeting
          if (ad.target_pages && ad.target_pages.length > 0) {
            const targetPages = Array.isArray(ad.target_pages) ? ad.target_pages : [ad.target_pages];
            if (!targetPages.includes('*') && !targetPages.includes(currentPage)) {
              return false;
            }
          }

          // Check device targeting
          const deviceType = getDeviceType();
          if (ad.target_devices && ad.target_devices.length > 0) {
            const targetDevices = Array.isArray(ad.target_devices) ? ad.target_devices : [ad.target_devices];
            if (!targetDevices.includes(deviceType)) {
              return false;
            }
          }

          return true;
        }).slice(0, maxAds);

        setAds(filteredAds);
        setIsLoaded(true);
        
        if (showDebug) {
          console.log(`🎬 Loaded ${filteredAds.length} animated ads for position: ${position}, page: ${currentPage}`);
        }
      } catch (err) {
        console.error('Error loading animated ads:', err);
        setError('Failed to load animated ads');
        setIsLoaded(true);
      }
    };

    loadAds();
  }, [currentPage, position, maxAds, showDebug]);

  // Inject CSS styles for animations
  useEffect(() => {
    if (!isLoaded || ads.length === 0) return;

    ads.forEach(ad => {
      if (ad.css_content && !styleInjectedRef.current.has(ad.id)) {
        const styleElement = document.createElement('style');
        styleElement.id = `animated-ad-style-${ad.id}`;
        styleElement.textContent = ad.css_content;
        document.head.appendChild(styleElement);
        styleInjectedRef.current.add(ad.id);

        if (showDebug) {
          console.log(`💄 Injected CSS for ad: ${ad.name}`);
        }
      }
    });

    // Cleanup function
    return () => {
      ads.forEach(ad => {
        const styleElement = document.getElementById(`animated-ad-style-${ad.id}`);
        if (styleElement) {
          styleElement.remove();
          styleInjectedRef.current.delete(ad.id);
        }
      });
    };
  }, [ads, isLoaded, showDebug]);

  // Rotate ads if multiple ads available
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % ads.length);
    }, 10000); // Change ad every 10 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  // Execute JavaScript for current ad
  useEffect(() => {
    if (!isLoaded || ads.length === 0) return;

    const currentAd = ads[currentAdIndex];
    if (currentAd?.javascript_content) {
      try {
        // Create a safe execution context
        const script = new Function(currentAd.javascript_content);
        script();
        
        if (showDebug) {
          console.log(`⚡ Executed JavaScript for ad: ${currentAd.name}`);
        }
      } catch (error) {
        console.error(`Error executing JavaScript for ad ${currentAd.name}:`, error);
      }
    }
  }, [currentAdIndex, ads, isLoaded, showDebug]);

  // Get device type for targeting
  const getDeviceType = (): string => {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  // Handle ad click
  const handleAdClick = () => {
    if (ads.length === 0) return;
    
    const currentAd = ads[currentAdIndex];
    if (showDebug) {
      console.log(`🖱️ Ad clicked: ${currentAd.name}`);
    }
    
    // Track click if needed
    // trackAdClick(currentAd.id);
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className={`animated-ad-loading ${className}`}>
        <div className="animate-pulse bg-gray-200 rounded-lg" style={{
          height: position === 'header' ? '60px' : 
                  position === 'sidebar' ? '250px' : 
                  position === 'footer' ? '60px' : '120px'
        }} />
      </div>
    );
  }

  // Error state
  if (error) {
    if (showDebug) {
      return (
        <div className={`animated-ad-error ${className} p-4 bg-red-50 border border-red-200 rounded-lg`}>
          <div className="text-red-600 text-sm">❌ {error}</div>
        </div>
      );
    }
    return null;
  }

  // No ads state
  if (ads.length === 0) {
    if (showDebug) {
      return (
        <div className={`animated-ad-empty ${className} p-4 bg-yellow-50 border border-yellow-200 rounded-lg`}>
          <div className="text-yellow-600 text-sm">
            ⚠️ No animated ads found for position: {position}
          </div>
        </div>
      );
    }
    return null;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div 
      ref={containerRef}
      className={`animated-ad-container animated-ad-${position} ${className}`}
      data-ad-id={currentAd.id}
      data-ad-name={currentAd.name}
      data-animation-type={currentAd.animation_type}
      onClick={handleAdClick}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {/* Animated Ad Content */}
      <div 
        className="animated-ad-content w-full h-full"
        dangerouslySetInnerHTML={{ __html: currentAd.html_content || '' }}
      />
      
      {/* Ad Label */}
      <div 
        className="animated-ad-label"
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.8)',
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: '2px 6px',
          borderRadius: '4px',
          zIndex: 1000,
          fontFamily: 'Cairo, Inter, sans-serif',
          backdropFilter: 'blur(4px)'
        }}
      >
        إعلان
      </div>

      {/* Multiple ads indicator */}
      {ads.length > 1 && (
        <div 
          className="animated-ad-indicator"
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '4px',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.8)',
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: '2px 6px',
            borderRadius: '4px',
            zIndex: 1000,
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(4px)'
          }}
        >
          {currentAdIndex + 1}/{ads.length}
        </div>
      )}

      {/* Debug info */}
      {showDebug && (
        <div 
          className="animated-ad-debug"
          style={{
            position: 'absolute',
            top: '20px',
            left: '4px',
            fontSize: '9px',
            color: 'rgba(255,255,255,0.9)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '4px 8px',
            borderRadius: '4px',
            zIndex: 1000,
            fontFamily: 'monospace',
            maxWidth: '200px',
            wordBreak: 'break-all'
          }}
        >
          <div>🎬 {currentAd.name}</div>
          <div>📍 {currentAd.position}</div>
          <div>🎭 {currentAd.animation_type}</div>
          <div>⏱️ {currentAd.animation_duration}ms</div>
        </div>
      )}
    </div>
  );
}

// Convenience components for different positions
export function HeaderAnimatedAd(props: Omit<AnimatedAdRendererProps, 'position'>) {
  return <AnimatedAdRenderer {...props} position="header" />;
}

export function SidebarAnimatedAd(props: Omit<AnimatedAdRendererProps, 'position'>) {
  return <AnimatedAdRenderer {...props} position="sidebar" />;
}

export function FooterAnimatedAd(props: Omit<AnimatedAdRendererProps, 'position'>) {
  return <AnimatedAdRenderer {...props} position="footer" />;
}

export function InContentAnimatedAd(props: Omit<AnimatedAdRendererProps, 'position'>) {
  return <AnimatedAdRenderer {...props} position="in-content" />;
}
