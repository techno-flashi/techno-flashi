'use client';

import { useEffect, useRef } from 'react';

interface DirectMonetagAdProps {
  zoneId: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function DirectMonetagAd({ zoneId, className = '', style = {} }: DirectMonetagAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const loadScript = () => {
      try {
        // Create script element
        const script = document.createElement('script');
        script.innerHTML = `
          (function(d,z,s){
            s.src='https://'+d+'/400/'+z;
            try{
              (document.body||document.documentElement).appendChild(s)
            }catch(e){
              console.error('Monetag script error:', e);
            }
          })('vemtoutcheeg.com',${zoneId},document.createElement('script'));
        `;
        
        // Add to body
        document.body.appendChild(script);
        scriptLoadedRef.current = true;
        
        console.log(`Monetag ad loaded for zone: ${zoneId}`);
      } catch (error) {
        console.error('Failed to load Monetag script:', error);
      }
    };

    // Load script after a short delay
    const timer = setTimeout(loadScript, 1000);
    
    return () => clearTimeout(timer);
  }, [zoneId]);

  return (
    <div 
      ref={containerRef}
      className={`monetag-ad-container ${className}`}
      data-zone-id={zoneId}
      style={{
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        margin: '10px 0',
        position: 'relative',
        ...style
      }}
    >
      {/* Ad placeholder */}
      <div className="text-center p-4">
        <div className="text-sm text-gray-500 mb-2">إعلان Monetag</div>
        <div className="text-xs text-gray-400">Zone ID: {zoneId}</div>
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
          borderRadius: '2px'
        }}
      >
        إعلان
      </div>
    </div>
  );
}

// Pre-configured Monetag ads
export function MonetagAd1({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <DirectMonetagAd zoneId="9593378" className={className} style={style} />;
}

export function MonetagAd2({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <DirectMonetagAd zoneId="9593331" className={className} style={style} />;
}

// Simple banner ad
export function MonetagBanner({ className }: { className?: string }) {
  return (
    <MonetagAd1 
      className={className}
      style={{
        minHeight: '90px',
        maxHeight: '120px',
        width: '100%'
      }}
    />
  );
}

// Sidebar ad
export function MonetagSidebar({ className }: { className?: string }) {
  return (
    <MonetagAd2 
      className={className}
      style={{
        minHeight: '250px',
        maxHeight: '300px',
        width: '100%'
      }}
    />
  );
}

// In-content ad
export function MonetagInContent({ className }: { className?: string }) {
  return (
    <MonetagAd1 
      className={className}
      style={{
        minHeight: '200px',
        maxHeight: '250px',
        width: '100%',
        margin: '20px 0'
      }}
    />
  );
}

// Test component to verify ads are working
export function MonetagTest() {
  useEffect(() => {
    // Check if Monetag meta tag exists
    const metaTag = document.querySelector('meta[name="monetag"]');
    console.log('Monetag meta tag:', metaTag ? 'Found' : 'Not found');
    
    // Check if scripts are loaded
    const scripts = document.querySelectorAll('script');
    const monetagScripts = Array.from(scripts).filter(script => 
      script.innerHTML.includes('vemtoutcheeg.com')
    );
    console.log('Monetag scripts found:', monetagScripts.length);
    
    // Log current page
    console.log('Current page:', window.location.pathname);
  }, []);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
      <h3 className="font-bold text-yellow-900 mb-2">اختبار Monetag</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-yellow-800">إعلان 1 (Zone: 9593378):</h4>
          <MonetagAd1 />
        </div>
        <div>
          <h4 className="font-medium text-yellow-800">إعلان 2 (Zone: 9593331):</h4>
          <MonetagAd2 />
        </div>
      </div>
      <div className="mt-4 text-sm text-yellow-700">
        افتح Developer Tools (F12) وتحقق من Console للرسائل.
      </div>
    </div>
  );
}
