'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AITool } from '@/types';

interface AIToolPageClientProps {
  tool: AITool;
  children: React.ReactNode;
}

export function AIToolPageClient({ tool, children }: AIToolPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Force a clean state when the tool changes
    // This ensures proper page transitions between different AI tools
    const handleRouteChange = () => {
      setIsLoading(false);

      // Clear any potential cached states or side effects
      if (typeof window !== 'undefined') {
        // Scroll to top when navigating to a new tool
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Force browser to refresh any cached content
        // This helps with the tool switching bug
        if (document.readyState === 'complete') {
          // Clear any potential stale data
          const event = new CustomEvent('ai-tool-changed', {
            detail: { toolId: tool.id, slug: tool.slug }
          });
          window.dispatchEvent(event);
        }
      }
    };

    handleRouteChange();
  }, [tool.id, tool.slug, pathname]); // Re-run when tool or path changes

  useEffect(() => {
    // Handle navigation events to ensure proper page transitions
    const handleBeforeUnload = () => {
      setIsLoading(true);
    };

    const handlePopState = () => {
      setIsLoading(true);
      // Small delay to allow Next.js to handle the route change
      setTimeout(() => setIsLoading(false), 100);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    // Prefetch related tool pages for better navigation performance
    const prefetchRelatedTools = async () => {
      try {
        // This helps with faster navigation between tools
        router.prefetch('/ai-tools');
      } catch (error) {
        // Silently handle prefetch errors
        console.debug('Prefetch error:', error);
      }
    };

    prefetchRelatedTools();
  }, [router]);

  return (
    <div key={`ai-tool-${tool.id}-${tool.slug}`} className="ai-tool-page">
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary z-50 animate-pulse" />
      )}
      {children}
    </div>
  );
}
