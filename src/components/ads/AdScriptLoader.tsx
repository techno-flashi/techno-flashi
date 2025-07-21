'use client';

import { useEffect, useState } from 'react';
import { getCodeInjections, type CodeInjection } from '@/lib/supabase-ads';

interface AdScriptLoaderProps {
  position: 'head_start' | 'head_end' | 'body_start' | 'footer';
  currentPage?: string;
}

export default function AdScriptLoader({ position, currentPage = '/' }: AdScriptLoaderProps) {
  const [injections, setInjections] = useState<CodeInjection[]>([]);
  const [loadedScripts, setLoadedScripts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadInjections = async () => {
      try {
        const data = await getCodeInjections(position, currentPage);
        setInjections(data);
      } catch (error) {
        console.error('Error loading ad injections:', error);
      }
    };

    loadInjections();
  }, [position, currentPage]);

  useEffect(() => {
    injections.forEach((injection) => {
      if (loadedScripts.has(injection.id)) return;

      try {
        // Create a unique script element for each injection
        const scriptElement = document.createElement('script');
        scriptElement.setAttribute('data-injection-id', injection.id);
        scriptElement.setAttribute('data-injection-name', injection.name);
        scriptElement.setAttribute('data-injection-position', injection.position);

        // Handle different types of code
        if (injection.code.includes('<script')) {
          // Extract JavaScript from script tags
          const scriptContent = injection.code.replace(/<\/?script[^>]*>/g, '');
          scriptElement.innerHTML = scriptContent;
        } else if (injection.code.trim().startsWith('(function') || injection.code.trim().startsWith('!function')) {
          // Direct JavaScript function
          scriptElement.innerHTML = injection.code;
        } else {
          // HTML content - create a div instead
          const divElement = document.createElement('div');
          divElement.setAttribute('data-injection-id', injection.id);
          divElement.setAttribute('data-injection-name', injection.name);
          divElement.setAttribute('data-injection-position', injection.position);
          divElement.innerHTML = injection.code;
          
          // Append to appropriate location
          if (position === 'head_start' || position === 'head_end') {
            document.head.appendChild(divElement);
          } else {
            document.body.appendChild(divElement);
          }
          
          setLoadedScripts(prev => new Set(prev).add(injection.id));
          return;
        }

        // Append script to appropriate location
        if (position === 'head_start' || position === 'head_end') {
          document.head.appendChild(scriptElement);
        } else {
          document.body.appendChild(scriptElement);
        }

        // Mark as loaded
        setLoadedScripts(prev => new Set(prev).add(injection.id));
        
        console.log(`✅ Ad script loaded: ${injection.name} (${injection.position})`);
        
        // Dispatch custom event for tracking
        window.dispatchEvent(new CustomEvent('adScriptLoaded', {
          detail: {
            id: injection.id,
            name: injection.name,
            position: injection.position
          }
        }));

      } catch (error) {
        console.error(`❌ Error loading ad script ${injection.name}:`, error);
      }
    });
  }, [injections, loadedScripts, position]);

  // This component doesn't render anything visible
  return null;
}

// Hook for tracking loaded ad scripts
export function useAdScriptTracker() {
  const [loadedAds, setLoadedAds] = useState<Array<{
    id: string;
    name: string;
    position: string;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    const handleAdScriptLoaded = (event: CustomEvent) => {
      setLoadedAds(prev => [...prev, {
        ...event.detail,
        timestamp: Date.now()
      }]);
    };

    window.addEventListener('adScriptLoaded', handleAdScriptLoaded as EventListener);
    
    return () => {
      window.removeEventListener('adScriptLoaded', handleAdScriptLoaded as EventListener);
    };
  }, []);

  return loadedAds;
}

// Debug component for development
export function AdScriptDebugger() {
  const loadedAds = useAdScriptTracker();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black text-green-400 p-4 rounded-lg text-xs font-mono max-w-sm z-50 max-h-96 overflow-y-auto">
      <div className="font-bold mb-2">🎯 Ad Scripts Debug</div>
      <div className="mb-2">Loaded: {loadedAds.length}</div>
      {loadedAds.map((ad, index) => (
        <div key={index} className="mb-2 p-2 bg-gray-800 rounded">
          <div className="text-yellow-400">{ad.name}</div>
          <div className="text-gray-400">{ad.position}</div>
          <div className="text-blue-400">{new Date(ad.timestamp).toLocaleTimeString()}</div>
        </div>
      ))}
    </div>
  );
}

// Verification component for ad networks
export function AdNetworkVerifier({ 
  networkName, 
  verificationFunction 
}: { 
  networkName: string;
  verificationFunction: () => boolean;
}) {
  const [isVerified, setIsVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const checkVerification = () => {
      if (verificationFunction()) {
        setIsVerified(true);
        console.log(`✅ ${networkName} verified successfully`);
        return;
      }

      if (attempts < 3) {
        setAttempts(prev => prev + 1);
        setTimeout(checkVerification, 2000);
      } else {
        console.warn(`⚠️ ${networkName} verification failed after 3 attempts`);
      }
    };

    // Start checking after a short delay
    setTimeout(checkVerification, 2000);
  }, [networkName, verificationFunction, attempts]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 p-2 rounded text-xs ${
      isVerified ? 'bg-green-600 text-white' : 'bg-yellow-600 text-black'
    }`}>
      {networkName}: {isVerified ? '✅ Verified' : `⏳ Checking... (${attempts}/10)`}
    </div>
  );
}

// Pre-built verifiers for common ad networks
export function MonetagVerifier() {
  return (
    <AdNetworkVerifier
      networkName="Monetag"
      verificationFunction={() => {
        // Check if Monetag scripts are loaded
        const scripts = document.querySelectorAll('script[data-injection-name*="monetag" i], script[data-injection-name*="Monetag"]');
        return scripts.length > 0;
      }}
    />
  );
}

export function GoogleAnalyticsVerifier() {
  return (
    <AdNetworkVerifier
      networkName="Google Analytics"
      verificationFunction={() => {
        return typeof (window as any).gtag === 'function' || typeof (window as any).ga === 'function';
      }}
    />
  );
}

export function MetaPixelVerifier() {
  return (
    <AdNetworkVerifier
      networkName="Meta Pixel"
      verificationFunction={() => {
        return typeof (window as any).fbq === 'function';
      }}
    />
  );
}
