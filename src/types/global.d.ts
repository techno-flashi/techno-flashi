// Global type declarations for external libraries and APIs

declare global {
  interface Window {
    // AdSense API
    adsbygoogle: any[];
    
    // ID5 API
    id5?: {
      init: () => void;
      getId: () => Promise<any>;
      refreshId: () => void;
    };
    
    // Google Analytics
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    
    // Ezoic
    ezstandalone?: any;
    ezoicSiteSpeed?: any;
    
    // Other ad-related APIs
    googletag?: any;
    __tcfapi?: any;
  }
}

export {};
