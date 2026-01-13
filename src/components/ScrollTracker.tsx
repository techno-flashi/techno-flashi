'use client';

import { useEffect } from 'react';
import { trackPageScroll } from '@/lib/gtag';

export default function ScrollTracker() {
  useEffect(() => {
    let scrollPercentages: Set<number> = new Set();
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
      
      // تتبع التمرير عند نقاط معينة
      const milestones = [25, 50, 75, 90, 100];
      
      for (const milestone of milestones) {
        if (scrollPercentage >= milestone && !scrollPercentages.has(milestone)) {
          scrollPercentages.add(milestone);
          trackPageScroll(milestone);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
}
