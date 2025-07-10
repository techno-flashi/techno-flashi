'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { pageview } from '@/lib/gtag';
import { Suspense } from 'react';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}
