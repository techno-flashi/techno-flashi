// Middleware لحماية الصفحات الإدارية والأمان
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { performSecurityCheck, logSecurityIncident } from '@/lib/security-check';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // فحص الأمان للطلبات
  const securityCheck = performSecurityCheck(req);
  if (!securityCheck.passed) {
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    logSecurityIncident(
      'blocked_request',
      clientIP,
      userAgent,
      { reason: securityCheck.reason, path: req.nextUrl.pathname }
    );

    return NextResponse.json(
      { error: 'طلب غير مصرح به' },
      { status: 403 }
    );
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // التحقق من حالة المصادقة
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // إذا كان المستخدم يحاول الوصول لصفحة إدارية
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // إذا لم يكن مسجل دخول، إعادة توجيه لصفحة تسجيل الدخول
    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // إذا كان المستخدم مسجل دخول ويحاول الوصول لصفحة تسجيل الدخول
  if (req.nextUrl.pathname === '/login' && session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/admin';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// تحديد المسارات التي يجب تطبيق middleware عليها
export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
  ],
};
