'use client';

import { useState, useEffect } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * مكون لتجنب مشاكل Server-Side Rendering
 * يعرض المحتوى فقط بعد تحميل الصفحة في المتصفح
 */
export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * مكون خاص للمحتوى الذي يعتمد على التاريخ والوقت
 */
export function TimeBasedContent({ 
  children, 
  fallback = null 
}: NoSSRProps) {
  return (
    <NoSSR fallback={fallback}>
      {children}
    </NoSSR>
  );
}

/**
 * مكون خاص للمحتوى التفاعلي
 */
export function InteractiveContent({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-800 rounded h-8 w-32"></div> 
}: NoSSRProps) {
  return (
    <NoSSR fallback={fallback}>
      {children}
    </NoSSR>
  );
}
