// دوال مساعدة للتعامل مع التواريخ بطريقة آمنة لتجنب مشاكل hydration

/**
 * إنشاء timestamp فريد بطريقة آمنة
 */
export function createSafeTimestamp(): number {
  return Date.now();
}

/**
 * إنشاء معرف فريد بطريقة آمنة
 */
export function createSafeId(prefix: string = 'id'): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().substring(0, 8)}`;
  }
  // fallback للبيئات التي لا تدعم crypto.randomUUID
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * إنشاء اسم ملف فريد
 */
export function createUniqueFileName(originalName: string, folder: string = ''): string {
  const timestamp = createSafeTimestamp();
  const randomId = createSafeId('file').split('-')[1];
  const fileExtension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  
  const fileName = `${timestamp}-${randomId}.${fileExtension}`;
  return folder ? `${folder}/${fileName}` : fileName;
}

/**
 * تنسيق التاريخ للعرض (آمن للـ SSR)
 */
export function formatDateSafe(date: string | Date, locale: string = 'ar-SA'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // التحقق من صحة التاريخ
    if (isNaN(dateObj.getTime())) {
      return 'تاريخ غير صحيح';
    }
    
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'تاريخ غير محدد';
  }
}

/**
 * حساب الوقت النسبي (آمن للـ SSR)
 */
export function getRelativeTimeSafe(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 0) return 'في المستقبل';
    if (diffInSeconds < 60) return 'منذ لحظات';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 2592000) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    if (diffInSeconds < 31536000) return `منذ ${Math.floor(diffInSeconds / 2592000)} شهر`;
    return `منذ ${Math.floor(diffInSeconds / 31536000)} سنة`;
  } catch (error) {
    console.warn('Error calculating relative time:', error);
    return 'منذ فترة';
  }
}

/**
 * الحصول على السنة الحالية (آمن للـ SSR)
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * إنشاء ISO string للتاريخ الحالي
 */
export function getCurrentISOString(): string {
  return new Date().toISOString();
}

/**
 * حساب وقت القراءة المقدر
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * تحويل التاريخ إلى slug آمن
 */
export function dateToSlug(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * التحقق من صحة التاريخ
 */
export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * إنشاء تاريخ انتهاء صلاحية (للكاش مثلاً)
 */
export function createExpiryDate(daysFromNow: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
}

/**
 * تحويل timestamp إلى تاريخ قابل للقراءة
 */
export function timestampToReadable(timestamp: number, locale: string = 'ar-SA'): string {
  return formatDateSafe(new Date(timestamp), locale);
}
