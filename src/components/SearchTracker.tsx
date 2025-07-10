'use client';

import { useEffect } from 'react';
import { trackSearch } from '@/lib/gtag';

interface SearchTrackerProps {
  searchTerm: string;
  resultsCount: number;
}

export default function SearchTracker({ searchTerm, resultsCount }: SearchTrackerProps) {
  useEffect(() => {
    if (searchTerm && searchTerm.length > 2) {
      // تتبع البحث
      trackSearch(searchTerm);
      
      // تتبع نتائج البحث
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'search_results', {
          event_category: 'search',
          event_label: searchTerm,
          value: resultsCount,
        });
      }
    }
  }, [searchTerm, resultsCount]);

  return null;
}
