'use client';

import { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// مكون خاص للتاريخ الحالي
export function CurrentYear() {
  return (
    <ClientOnly fallback="2025">
      {new Date().getFullYear()}
    </ClientOnly>
  );
}

// مكون خاص للتاريخ المنسق
interface FormattedDateProps {
  date: string | Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  fallback?: string;
}

export function FormattedDate({ 
  date, 
  locale = 'ar-SA', 
  options = { year: 'numeric', month: 'long', day: 'numeric' },
  fallback = 'تاريخ غير محدد'
}: FormattedDateProps) {
  return (
    <ClientOnly fallback={fallback}>
      {new Date(date).toLocaleDateString(locale, options)}
    </ClientOnly>
  );
}

// مكون خاص للوقت النسبي
interface RelativeTimeProps {
  date: string | Date;
  fallback?: string;
}

export function RelativeTime({ date, fallback = 'منذ فترة' }: RelativeTimeProps) {
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'منذ لحظات';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 2592000) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    if (diffInSeconds < 31536000) return `منذ ${Math.floor(diffInSeconds / 2592000)} شهر`;
    return `منذ ${Math.floor(diffInSeconds / 31536000)} سنة`;
  };

  return (
    <ClientOnly fallback={fallback}>
      {getRelativeTime(new Date(date))}
    </ClientOnly>
  );
}
