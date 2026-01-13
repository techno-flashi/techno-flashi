// نظام cache بسيط في الذاكرة
interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache: Map<string, CacheItem> = new Map();

  set(key: string, data: any, ttlSeconds: number = 60): void { // Reduced default TTL to 1 minute
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // التحقق من انتهاء الصلاحية
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // تنظيف البيانات المنتهية الصلاحية
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, item] of entries) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new SimpleCache();

// تنظيف دوري كل دقيقة للاستجابة السريعة
if (typeof window === 'undefined') { // server-side only
  setInterval(() => {
    cache.cleanup();
  }, 1 * 60 * 1000); // Cleanup every minute
}

// مساعد للاستعلامات المخزنة مؤقتاً
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttlSeconds: number = 60 // Reduced default TTL to 1 minute
): Promise<T> {
  // محاولة الحصول من الكاش
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  // تنفيذ الاستعلام وحفظه
  const result = await queryFn();
  cache.set(key, result, ttlSeconds);
  
  return result;
}
