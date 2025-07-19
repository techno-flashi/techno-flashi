'use client';

import { useEffect, useState, useRef } from 'react';
import { getAdvancedAds, trackAdEvent, type AdvancedAd } from '@/lib/advanced-ads';

interface AdvancedAdRendererProps {
  position: 'header' | 'sidebar' | 'footer' | 'in-content' | 'popup' | 'floating' | 'sticky';
  currentPage?: string;
  containerId?: string;
  maxAds?: number;
  className?: string;
}

export default function AdvancedAdRenderer({ 
  position, 
  currentPage = '/', 
  containerId,
  maxAds = 3,
  className = ''
}: AdvancedAdRendererProps) {
  const [ads, setAds] = useState<AdvancedAd[]>([]);
  const [loadedAds, setLoadedAds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load ads based on position and filters
  useEffect(() => {
    const loadAds = async () => {
      try {
        setIsLoading(true);
        const fetchedAds = await getAdvancedAds({
          enabled: true,
          position,
          target_page: currentPage
        });

        // Apply device filtering
        const deviceType = getDeviceType();
        const filteredAds = fetchedAds.filter(ad => 
          ad.target_devices.includes(deviceType)
        ).slice(0, maxAds);

        setAds(filteredAds);
      } catch (error) {
        console.error('Error loading advanced ads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAds();
  }, [position, currentPage, maxAds]);

  // Set up intersection observer for impression tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const adId = entry.target.getAttribute('data-ad-id');
            if (adId && !loadedAds.has(adId)) {
              setLoadedAds(prev => new Set(prev).add(adId));
              
              // Track impression
              trackAdEvent({
                ad_id: adId,
                event_type: 'impression',
                event_data: {
                  position,
                  visible_percentage: entry.intersectionRatio * 100
                },
                page_url: currentPage,
                page_title: document.title,
                device_type: getDeviceType(),
                browser: getBrowser(),
                user_agent: navigator.userAgent,
                currency: 'USD'
              });
            }
          }
        });
      },
      { threshold: 0.5 } // Track when 50% visible
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [currentPage, position, loadedAds]);

  // Observe ad elements when they're rendered
  useEffect(() => {
    if (!observerRef.current || !containerRef.current) return;

    const adElements = containerRef.current.querySelectorAll('[data-ad-id]');
    adElements.forEach(element => {
      observerRef.current?.observe(element);
    });

    return () => {
      adElements.forEach(element => {
        observerRef.current?.unobserve(element);
      });
    };
  }, [ads]);

  const handleAdClick = (ad: AdvancedAd, event: React.MouseEvent) => {
    // Track click event
    trackAdEvent({
      ad_id: ad.id,
      event_type: 'click',
      event_data: {
        position,
        click_coordinates: { x: event.clientX, y: event.clientY }
      },
      page_url: currentPage,
      page_title: document.title,
      device_type: getDeviceType(),
      browser: getBrowser(),
      user_agent: navigator.userAgent,
      currency: 'USD'
    });

    // Handle click URL
    if (ad.click_url) {
      window.open(ad.click_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAdHover = (ad: AdvancedAd) => {
    trackAdEvent({
      ad_id: ad.id,
      event_type: 'hover',
      event_data: { position },
      page_url: currentPage,
      page_title: document.title,
      device_type: getDeviceType(),
      browser: getBrowser(),
      user_agent: navigator.userAgent,
      currency: 'USD'
    });
  };

  const renderAdContent = (ad: AdvancedAd) => {
    const deviceType = getDeviceType();
    let htmlContent = ad.html_content || '';
    
    // Use responsive content if available
    if (deviceType === 'mobile' && ad.mobile_html) {
      htmlContent = ad.mobile_html;
    } else if (deviceType === 'tablet' && ad.tablet_html) {
      htmlContent = ad.tablet_html;
    }

    // Generate unique ID for this ad instance
    const adInstanceId = `ad-${ad.id}-${Date.now()}`;
    
    // Replace placeholder IDs in content
    htmlContent = htmlContent.replace(/{{id}}/g, adInstanceId);

    return (
      <div
        key={ad.id}
        data-ad-id={ad.id}
        data-ad-name={ad.name}
        data-ad-position={position}
        className={`advanced-ad-container ${ad.ad_type}-ad ${className}`}
        style={{
          zIndex: ad.z_index,
          animationDuration: `${ad.animation_duration}ms`,
          ...(ad.animation_type && {
            animation: `${ad.animation_type} ${ad.animation_duration}ms ease-in-out`
          })
        }}
        onClick={(e) => handleAdClick(ad, e)}
        onMouseEnter={() => handleAdHover(ad)}
      >
        {/* CSS Content */}
        {ad.css_content && (
          <style dangerouslySetInnerHTML={{ __html: ad.css_content }} />
        )}
        
        {/* HTML Content */}
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        
        {/* JavaScript Content */}
        {ad.javascript_content && (
          <script dangerouslySetInnerHTML={{ __html: ad.javascript_content }} />
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`advanced-ad-loading ${className}`}>
        <div className="ad-skeleton">
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
        <style jsx>{`
          .ad-skeleton {
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .skeleton-line {
            height: 20px;
            background: #e0e0e0;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          .skeleton-line.short {
            width: 60%;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`advanced-ad-renderer ${position}-ads ${className}`}
      data-position={position}
      data-ad-count={ads.length}
    >
      {ads.map(renderAdContent)}
      
      {/* Global Ad Styles */}
      <style jsx global>{`
        .advanced-ad-container {
          position: relative;
          margin: 10px 0;
          transition: all 0.3s ease;
        }
        
        .advanced-ad-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .floating-ads {
          position: fixed;
          z-index: 9999;
        }
        
        .sticky-ads {
          position: sticky;
          top: 20px;
          z-index: 1000;
        }
        
        .popup-ads {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10000;
        }
        
        @media (max-width: 768px) {
          .advanced-ad-container {
            margin: 5px 0;
          }
        }
        
        /* Animation classes */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-30px,0); }
          70% { transform: translate3d(0,-15px,0); }
          90% { transform: translate3d(0,-4px,0); }
        }
      `}</style>
    </div>
  );
}

// Utility functions
function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
}

// Export utility components
export function AdPlaceholder({ position, className = '' }: { position: string; className?: string }) {
  return (
    <div className={`ad-placeholder ${className}`} data-position={position}>
      <div className="placeholder-content">
        <div className="placeholder-icon">📢</div>
        <div className="placeholder-text">Advertisement</div>
      </div>
      <style jsx>{`
        .ad-placeholder {
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          margin: 10px 0;
        }
        .placeholder-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .placeholder-text {
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
