'use client';

import { useState, useEffect } from 'react';

interface SafeDateDisplayProps {
  date: string | null | undefined;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  fallback?: string;
  className?: string;
}

/**
 * مكون آمن لعرض التواريخ مع معالجة القيم الفارغة والخاطئة
 * يمنع ظهور تاريخ 1970 (Unix Epoch) عند وجود قيم null أو غير صحيحة
 * يحل مشكلة Hydration mismatch بين الخادم والعميل
 */
export default function SafeDateDisplay({
  date,
  locale = 'ar-EG',
  options = { year: 'numeric', month: 'long', day: 'numeric' },
  fallback = 'تاريخ غير محدد',
  className = ''
}: SafeDateDisplayProps) {
  const [isClient, setIsClient] = useState(false);
  const [formattedDate, setFormattedDate] = useState(fallback);

  // التحقق من صحة التاريخ
  const isValidDate = (dateValue: any): boolean => {
    if (!dateValue) return false;
    if (typeof dateValue === 'string' && dateValue.trim() === '') return false;

    const parsedDate = new Date(dateValue);
    const timestamp = parsedDate.getTime();

    // التحقق من أن التاريخ صحيح وليس Unix Epoch
    return !isNaN(timestamp) &&
           parsedDate.getFullYear() > 1970 &&
           parsedDate.getFullYear() < 2100; // نطاق معقول للتواريخ
  };

  // تنسيق التاريخ بأمان مع تنسيق ثابت لتجنب مشاكل Hydration
  const formatDate = (): string => {
    if (!isValidDate(date)) {
      return fallback;
    }

    try {
      const parsedDate = new Date(date!);

      // استخدام تنسيق ثابت لتجنب اختلافات المنطقة الزمنية
      if (locale === 'ar-SA' || locale === 'ar-EG' || locale.startsWith('ar')) {
        // تنسيق عربي مبسط وثابت
        const day = parsedDate.getDate();
        const month = parsedDate.getMonth() + 1;
        const year = parsedDate.getFullYear();

        const arabicMonths = [
          'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
          'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];

        return `${day} ${arabicMonths[month - 1]} ${year}`;
      }

      // للغات الأخرى، استخدم التنسيق الافتراضي
      return parsedDate.toLocaleDateString(locale, options);
    } catch (error) {
      console.warn('Error formatting date:', error, 'Date value:', date);
      return fallback;
    }
  };

  useEffect(() => {
    // تأكد من أن هذا يعمل فقط على العميل
    setIsClient(true);
    setFormattedDate(formatDate());
  }, [date, locale, JSON.stringify(options)]);

  // أثناء SSR أو قبل hydration، اعرض fallback
  if (!isClient) {
    return (
      <span className={className}>
        {fallback}
      </span>
    );
  }

  return (
    <span className={className}>
      {formattedDate}
    </span>
  );
}

/**
 * Hook لمعالجة التواريخ بأمان
 */
export function useSafeDate(date: string | null | undefined) {
  const isValid = (dateValue: any): boolean => {
    if (!dateValue) return false;
    if (typeof dateValue === 'string' && dateValue.trim() === '') return false;
    
    const parsedDate = new Date(dateValue);
    const timestamp = parsedDate.getTime();
    
    return !isNaN(timestamp) && 
           parsedDate.getFullYear() > 1970 && 
           parsedDate.getFullYear() < 2100;
  };

  const format = (
    locale: string = 'ar-EG',
    options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  ): string => {
    if (!isValid(date)) {
      return 'تاريخ غير محدد';
    }

    try {
      const parsedDate = new Date(date!);

      // استخدام نفس منطق التنسيق الثابت
      if (locale === 'ar-SA' || locale === 'ar-EG' || locale.startsWith('ar')) {
        const day = parsedDate.getDate();
        const month = parsedDate.getMonth() + 1;
        const year = parsedDate.getFullYear();

        const arabicMonths = [
          'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
          'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];

        return `${day} ${arabicMonths[month - 1]} ${year}`;
      }

      return parsedDate.toLocaleDateString(locale, options);
    } catch (error) {
      return 'تاريخ غير محدد';
    }
  };

  const getDate = (): Date | null => {
    if (!isValid(date)) {
      return null;
    }
    return new Date(date!);
  };

  return {
    isValid: isValid(date),
    format,
    getDate,
    original: date
  };
}
