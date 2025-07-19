'use client';

import { useEffect, useState } from 'react';
import { getCodeInjections, type CodeInjection } from '@/lib/supabase-ads';

interface ClientCodeInjectionProps {
  position: 'head_start' | 'head_end' | 'body_start' | 'footer';
  currentPage?: string;
  refreshInterval?: number;
}

export function ClientCodeInjection({ 
  position, 
  currentPage = '/', 
  refreshInterval = 30000 // 30 seconds
}: ClientCodeInjectionProps) {
  const [injections, setInjections] = useState<CodeInjection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInjections = async () => {
      try {
        const data = await getCodeInjections(position, currentPage);
        setInjections(data);
      } catch (error) {
        console.error('Error loading client code injections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInjections();

    // Set up refresh interval if specified
    if (refreshInterval > 0) {
      const interval = setInterval(loadInjections, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [position, currentPage, refreshInterval]);

  if (isLoading || injections.length === 0) {
    return null;
  }

  return (
    <>
      {injections.map((injection) => (
        <div
          key={injection.id}
          data-injection-id={injection.id}
          data-injection-name={injection.name}
          data-injection-position={injection.position}
          dangerouslySetInnerHTML={{ __html: injection.code }}
        />
      ))}
    </>
  );
}

// Hook for managing code injections
export function useCodeInjections(position: string, currentPage: string = '/') {
  const [injections, setInjections] = useState<CodeInjection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInjections = async () => {
      try {
        setIsLoading(true);
        const data = await getCodeInjections(position, currentPage);
        setInjections(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load code injections');
      } finally {
        setIsLoading(false);
      }
    };

    loadInjections();
  }, [position, currentPage]);

  return { injections, isLoading, error };
}

// Utility component for debugging injections
export function CodeInjectionDebugger({ position, currentPage }: {
  position?: string;
  currentPage?: string;
}) {
  const [allInjections, setAllInjections] = useState<CodeInjection[]>([]);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const data = await getCodeInjections(position, currentPage);
        setAllInjections(data);
      } catch (error) {
        console.error('Error loading injections for debug:', error);
      }
    };

    loadAll();
  }, [position, currentPage]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-green-400 p-4 rounded-lg text-xs font-mono max-w-sm z-50">
      <div className="font-bold mb-2">Code Injections Debug</div>
      <div>Position: {position || 'all'}</div>
      <div>Page: {currentPage || '/'}</div>
      <div>Count: {allInjections.length}</div>
      {allInjections.map((injection) => (
        <div key={injection.id} className="mt-1 p-1 bg-gray-800 rounded">
          <div className="text-yellow-400">{injection.name}</div>
          <div className="text-gray-400">{injection.position}</div>
        </div>
      ))}
    </div>
  );
}
