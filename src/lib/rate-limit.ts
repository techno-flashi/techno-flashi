// نظام Rate Limiting بسيط
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // دقيقة واحدة
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  // تنظيف البيانات القديمة
  if (store[key] && now > store[key].resetTime) {
    delete store[key];
  }

  // إنشاء أو تحديث العداد
  if (!store[key]) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs
    };
    return {
      success: true,
      remaining: limit - 1,
      resetTime: store[key].resetTime
    };
  }

  // التحقق من الحد الأقصى
  if (store[key].count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: store[key].resetTime
    };
  }

  // زيادة العداد
  store[key].count++;
  
  return {
    success: true,
    remaining: limit - store[key].count,
    resetTime: store[key].resetTime
  };
}

export function getRateLimitHeaders(result: ReturnType<typeof rateLimit>) {
  return {
    'X-RateLimit-Limit': '10',
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
  };
}
