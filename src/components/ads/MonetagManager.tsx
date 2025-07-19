'use client';

import { useEffect, useState } from 'react';

// Monetag Ad configuration types
export interface MonetagAdConfig {
  id: string;
  name: string;
  position: 'header' | 'sidebar' | 'footer' | 'in-content' | 'popup';
  enabled: boolean;
  pages: string[]; // Which pages to show on
  script?: string;
  html?: string;
  delay?: number; // Delay in seconds before showing
  zoneId?: string;
}

// Default Monetag configurations
const DEFAULT_MONETAG_CONFIGS: MonetagAdConfig[] = [
  {
    id: 'monetag-banner-1',
    name: 'Monetag Banner 1',
    position: 'header',
    enabled: true,
    pages: ['/', '/articles', '/ai-tools'],
    zoneId: '9593378',
    script: `(function(d,z,s){s.src='https://'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('vemtoutcheeg.com',9593378,document.createElement('script'))`,
  },
  {
    id: 'monetag-banner-2',
    name: 'Monetag Banner 2',
    position: 'sidebar',
    enabled: true,
    pages: ['/articles', '/ai-tools'],
    zoneId: '9593331',
    script: `(function(d,z,s){s.src='https://'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('vemtoutcheeg.com',9593331,document.createElement('script'))`,
  },
  {
    id: 'monetag-in-content',
    name: 'Monetag In-Content',
    position: 'in-content',
    enabled: true,
    pages: ['/articles', '/ai-tools'],
    delay: 2, // Show after 2 seconds
    html: `<div id="monetag-in-content-placeholder" style="min-height: 200px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 20px 0;"><span style="color: #6c757d;">إعلان Monetag</span></div>`
  }
];

interface MonetagManagerProps {
  position: 'header' | 'sidebar' | 'footer' | 'in-content' | 'popup';
  currentPage: string;
  className?: string;
  showDebug?: boolean;
}

export default function MonetagManager({ 
  position, 
  currentPage, 
  className = '',
  showDebug = false 
}: MonetagManagerProps) {
  const [adConfigs, setAdConfigs] = useState<MonetagAdConfig[]>(DEFAULT_MONETAG_CONFIGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get ads for current position and page
  const relevantAds = adConfigs.filter(ad => 
    ad.position === position && 
    ad.enabled && 
    (ad.pages.includes(currentPage) || ad.pages.includes('*'))
  );

  useEffect(() => {
    // Load ad configurations from localStorage
    const savedConfigs = localStorage.getItem('monetagAdConfigs');
    if (savedConfigs) {
      try {
        setAdConfigs(JSON.parse(savedConfigs));
      } catch (e) {
        console.warn('Failed to load Monetag ad configs:', e);
        setError('Failed to load ad configuration');
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || relevantAds.length === 0) return;

    const firstAd = relevantAds[0];
    
    if (firstAd.delay) {
      const timer = setTimeout(() => {
        setShowAd(true);
        loadMonetagScript(firstAd);
      }, firstAd.delay * 1000);
      
      return () => clearTimeout(timer);
    } else {
      setShowAd(true);
      loadMonetagScript(firstAd);
    }
  }, [isLoaded, relevantAds]);

  const loadMonetagScript = async (ad: MonetagAdConfig) => {
    if (!ad.script || scriptLoaded) return;

    try {
      // Check if Monetag script is already loaded
      const existingScript = document.querySelector(`script[data-monetag-id="${ad.id}"]`);
      if (existingScript) {
        setScriptLoaded(true);
        return;
      }

      // Create and load script
      const script = document.createElement('script');
      script.setAttribute('data-monetag-id', ad.id);
      script.innerHTML = ad.script;
      
      // Add to appropriate location
      if (position === 'header') {
        document.head.appendChild(script);
      } else {
        document.body.appendChild(script);
      }
      
      setScriptLoaded(true);
      
      // Track ad load
      trackMonetagEvent(ad.id, 'load');
      
    } catch (error) {
      console.error('Failed to load Monetag script:', error);
      setError('Failed to load ad script');
    }
  };

  // Don't show ads on admin pages
  if (currentPage.startsWith('/admin') || currentPage.startsWith('/api') || currentPage === '/login') {
    return null;
  }

  if (!isLoaded || !showAd || relevantAds.length === 0) {
    return showDebug ? (
      <div className={`monetag-debug ${className}`} style={{ 
        padding: '10px', 
        background: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '4px',
        margin: '10px 0'
      }}>
        <small>Debug: No Monetag ads for position "{position}" on page "{currentPage}"</small>
      </div>
    ) : null;
  }

  const ad = relevantAds[0];

  return (
    <div 
      className={`monetag-container monetag-${position} ${className}`}
      data-monetag-id={ad.id}
      data-zone-id={ad.zoneId}
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
        overflow: 'hidden'
      }}
      onClick={() => trackMonetagEvent(ad.id, 'click')}
    >
      {/* Ad content */}
      <div className="monetag-content w-full h-full">
        {ad.html ? (
          <div dangerouslySetInnerHTML={{ __html: ad.html }} />
        ) : (
          <div className="monetag-placeholder text-center p-4">
            <div className="text-sm text-gray-500 mb-2">إعلان Monetag</div>
            <div 
              id={`monetag-${ad.id}`}
              className="monetag-zone"
              data-zone={ad.zoneId}
              style={{ minHeight: '50px' }}
            >
              {scriptLoaded ? (
                <div className="text-xs text-gray-400">تم تحميل الإعلان</div>
              ) : (
                <div className="text-xs text-gray-400">جاري تحميل الإعلان...</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Ad label for transparency */}
      <div 
        className="monetag-label"
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

      {/* Error display */}
      {error && showDebug && (
        <div 
          className="monetag-error"
          style={{
            position: 'absolute',
            bottom: '2px',
            left: '2px',
            fontSize: '10px',
            color: '#dc3545',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '1px 4px',
            borderRadius: '2px'
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

// Hook for managing Monetag configurations
export function useMonetagManager() {
  const [adConfigs, setAdConfigs] = useState<MonetagAdConfig[]>(DEFAULT_MONETAG_CONFIGS);

  const updateAdConfig = (id: string, updates: Partial<MonetagAdConfig>) => {
    setAdConfigs(prev => 
      prev.map(ad => 
        ad.id === id ? { ...ad, ...updates } : ad
      )
    );
  };

  const toggleAd = (id: string) => {
    updateAdConfig(id, { enabled: !adConfigs.find(ad => ad.id === id)?.enabled });
  };

  const saveConfigs = () => {
    localStorage.setItem('monetagAdConfigs', JSON.stringify(adConfigs));
  };

  return {
    adConfigs,
    updateAdConfig,
    toggleAd,
    saveConfigs
  };
}

// Performance tracking for Monetag ads
export function trackMonetagEvent(adId: string, event: 'load' | 'view' | 'click') {
  try {
    const timestamp = new Date().toISOString();
    const performanceData = {
      adId,
      event,
      timestamp,
      page: window.location.pathname,
      userAgent: navigator.userAgent.substring(0, 100)
    };
    
    // Store in localStorage
    const existingData = JSON.parse(localStorage.getItem('monetagPerformance') || '[]');
    existingData.push(performanceData);
    
    // Keep only last 50 entries
    if (existingData.length > 50) {
      existingData.splice(0, existingData.length - 50);
    }
    
    localStorage.setItem('monetagPerformance', JSON.stringify(existingData));
    
    // Log for debugging
    console.log('Monetag event tracked:', performanceData);
  } catch (error) {
    console.warn('Failed to track Monetag performance:', error);
  }
}

// Utility to check Monetag script status
export function checkMonetagStatus(): {
  scriptsLoaded: boolean;
  metaTagPresent: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check meta tag
  const metaTag = document.querySelector('meta[name="monetag"]');
  const metaTagPresent = !!metaTag;
  
  if (!metaTagPresent) {
    errors.push('Monetag meta tag not found');
  }
  
  // Check scripts
  const scripts = document.querySelectorAll('script[data-monetag-id]');
  const scriptsLoaded = scripts.length > 0;
  
  if (!scriptsLoaded) {
    errors.push('No Monetag scripts loaded');
  }
  
  return {
    scriptsLoaded,
    metaTagPresent,
    errors
  };
}
