// أدوات فحص الأمان
import { NextRequest } from 'next/server';

// فحص الطلبات المشبوهة
export function detectSuspiciousRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  
  // قائمة User Agents المشبوهة
  const suspiciousUserAgents = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python',
    'postman', 'insomnia', 'httpie'
  ];
  
  // فحص User Agent
  const isSuspiciousUA = suspiciousUserAgents.some(agent => 
    userAgent.toLowerCase().includes(agent)
  );
  
  // فحص عدم وجود Referer للطلبات الحساسة
  const isPostRequest = request.method === 'POST';
  const hasNoReferer = !referer;
  
  return isSuspiciousUA || (isPostRequest && hasNoReferer);
}

// فحص محتوى الطلب للكشف عن محاولات الحقن
export function detectInjectionAttempt(content: string): boolean {
  const injectionPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /<iframe\b[^>]*>/gi,
    /<object\b[^>]*>/gi,
    /<embed\b[^>]*>/gi,
    /data:text\/html/gi,
    /vbscript:/gi
  ];
  
  return injectionPatterns.some(pattern => pattern.test(content));
}

// فحص طول المحتوى
export function validateContentLength(content: string, maxLength: number = 50000): boolean {
  return content.length <= maxLength;
}

// فحص تكرار الأحرف (للكشف عن spam)
export function detectSpam(content: string): boolean {
  // فحص تكرار الأحرف
  const charCounts: { [key: string]: number } = {};
  for (const char of content) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }
  
  // إذا كان أي حرف يتكرر أكثر من 50% من المحتوى
  const maxRepeat = Math.max(...Object.values(charCounts));
  const spamThreshold = content.length * 0.5;
  
  return maxRepeat > spamThreshold;
}

// فحص عناوين IP المحظورة
const blockedIPs = new Set<string>([
  // يمكن إضافة IPs محظورة هنا
]);

export function isBlockedIP(ip: string): boolean {
  return blockedIPs.has(ip);
}

// فحص شامل للأمان
export function performSecurityCheck(request: NextRequest, content?: string): {
  passed: boolean;
  reason?: string;
} {
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  // فحص IP محظور
  if (isBlockedIP(clientIP)) {
    return { passed: false, reason: 'IP محظور' };
  }
  
  // فحص الطلبات المشبوهة
  if (detectSuspiciousRequest(request)) {
    return { passed: false, reason: 'طلب مشبوه' };
  }
  
  // فحص المحتوى إذا تم توفيره
  if (content) {
    if (!validateContentLength(content)) {
      return { passed: false, reason: 'المحتوى طويل جداً' };
    }
    
    if (detectInjectionAttempt(content)) {
      return { passed: false, reason: 'محاولة حقن كود' };
    }
    
    if (detectSpam(content)) {
      return { passed: false, reason: 'محتوى spam' };
    }
  }
  
  return { passed: true };
}

// تسجيل محاولات الاختراق
export function logSecurityIncident(
  type: string,
  ip: string,
  userAgent: string,
  details: any
) {
  console.warn('🚨 Security Incident:', {
    type,
    ip,
    userAgent,
    details,
    timestamp: new Date().toISOString()
  });
  
  // يمكن إضافة إرسال تنبيه أو حفظ في قاعدة البيانات
}
