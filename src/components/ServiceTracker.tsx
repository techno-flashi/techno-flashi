'use client';

import { useEffect } from 'react';
import { trackServiceView } from '@/lib/gtag';

interface ServiceTrackerProps {
  serviceName: string;
  serviceId: string;
}

export default function ServiceTracker({ serviceName, serviceId }: ServiceTrackerProps) {
  useEffect(() => {
    // تتبع مشاهدة الخدمة
    trackServiceView(serviceName);
    
    // تتبع وقت البقاء في الصفحة
    const startTime = Date.now();
    
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) { // إذا قضى أكثر من 5 ثوان
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'service_engagement', {
            event_category: 'engagement',
            event_label: serviceName,
            value: timeSpent,
          });
        }
      }
    };
  }, [serviceName, serviceId]);

  return null; // هذا المكون لا يعرض شيئاً، فقط يتتبع
}
