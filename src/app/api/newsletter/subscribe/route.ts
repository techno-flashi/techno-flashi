// API endpoint للاشتراك في النشرة البريدية
import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter, validateEmail } from '@/lib/newsletterService';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { sanitizeText } from '@/lib/sanitize';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting للحماية من الإرسال المتكرر
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(`newsletter-${clientIP}`, 3, 300); // 3 طلبات كل 5 دقائق

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً.'
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    const body = await request.json();
    const { email, name, source } = body;

    // التحقق من وجود البريد الإلكتروني
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'البريد الإلكتروني مطلوب'
        },
        { status: 400 }
      );
    }

    // تنظيف البيانات
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name ? sanitizeText(name) : undefined;
    const cleanSource = source ? sanitizeText(source) : 'website';

    // التحقق من صحة البريد الإلكتروني
    if (!validateEmail(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: 'البريد الإلكتروني غير صحيح'
        },
        { status: 400 }
      );
    }

    // الحصول على معلومات الطلب
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // محاولة الاشتراك
    const result = await subscribeToNewsletter(
      {
        email: cleanEmail,
        name: cleanName,
        source: cleanSource,
        preferences: {
          language: 'ar',
          topics: ['tech', 'ai', 'programming']
        }
      },
      ipAddress,
      userAgent
    );

    // إرجاع النتيجة مع headers الـ rate limiting
    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
      headers: getRateLimitHeaders(rateLimitResult)
    });

  } catch (error) {
    console.error('خطأ في API الاشتراك:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.' 
      },
      { status: 500 }
    );
  }
}

// معالجة طلبات GET (للتحقق من حالة الخدمة)
export async function GET() {
  return NextResponse.json({
    service: 'Newsletter Subscription API',
    status: 'active',
    version: '1.0.0'
  });
}
