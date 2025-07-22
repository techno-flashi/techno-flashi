import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fix broken internal URLs - SEO audit fix for "Internal No Response"
  const brokenUrls: Record<string, string> = {
    '/broken-link': '/',
    '/malformed-url': '/',
    '/timeout-url': '/',
    '/no-response': '/',
    // Add specific broken URLs as discovered
  };

  // Check if current path is a known broken URL
  if (brokenUrls[pathname]) {
    return NextResponse.redirect(new URL(brokenUrls[pathname], request.url));
  }

  // Fix malformed URLs that cause no response
  if (pathname.includes('//') || pathname.includes('%20%20') || pathname.length > 200) {
    try {
      const cleanPath = pathname.replace(/\/+/g, '/').substring(0, 100);
      if (cleanPath !== pathname && cleanPath.length > 1) {
        return NextResponse.redirect(new URL(cleanPath, request.url));
      }
    } catch {
      // If URL is completely malformed, redirect to homepage
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // معالجة الروابط العربية في أدوات الذكاء الاصطناعي
  if (pathname.startsWith('/ai-tools/')) {
    const slug = pathname.replace('/ai-tools/', '');
    
    // فك تشفير الـ slug للتعامل مع الأحرف العربية
    try {
      const decodedSlug = decodeURIComponent(slug);
      
      // إذا كان الـ slug مختلف بعد فك التشفير، أعد التوجيه
      if (decodedSlug !== slug && decodedSlug.length > 0) {
        const newUrl = new URL(request.url);
        newUrl.pathname = `/ai-tools/${encodeURIComponent(decodedSlug)}`;
        return NextResponse.redirect(newUrl);
      }
    } catch (error) {
      // في حالة خطأ في فك التشفير، أعد التوجيه لصفحة الأدوات الرئيسية
      console.error('Error decoding AI tool slug:', error);
      const newUrl = new URL(request.url);
      newUrl.pathname = '/ai-tools';
      newUrl.searchParams.set('error', 'invalid-slug');
      return NextResponse.redirect(newUrl);
    }
  }

  // معالجة الروابط العربية في المقالات
  if (pathname.startsWith('/articles/')) {
    const slug = pathname.replace('/articles/', '');
    
    try {
      const decodedSlug = decodeURIComponent(slug);
      
      if (decodedSlug !== slug && decodedSlug.length > 0) {
        const newUrl = new URL(request.url);
        newUrl.pathname = `/articles/${encodeURIComponent(decodedSlug)}`;
        return NextResponse.redirect(newUrl);
      }
    } catch (error) {
      console.error('Error decoding article slug:', error);
      const newUrl = new URL(request.url);
      newUrl.pathname = '/articles';
      newUrl.searchParams.set('error', 'invalid-slug');
      return NextResponse.redirect(newUrl);
    }
  }

  // إضافة headers للأمان ودعم اللغة العربية - SEO audit fixes
  const response = NextResponse.next();

  // إضافة header للغة العربية
  response.headers.set('Content-Language', 'ar');

  // إضافة headers للأمان - Complete SEO audit security fixes + Monetag CSP fix
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // CSP configured for admin-controlled ads only - Clean system
  response.headers.set('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
    "https://www.googletagmanager.com " +
    "https://www.google-analytics.com " +
    "https://cdn.jsdelivr.net " +
    "https://unpkg.com " +
    "https://pagead2.googlesyndication.com " +
    "https://googleads.g.doubleclick.net " +
    "https://tpc.googlesyndication.com " +
    "https://securepubads.g.doubleclick.net " +
    "https://connect.facebook.net " +
    "https://fonts.googleapis.com " +
    "https://fonts.gstatic.com " +
    "https://www.youtube.com " +
    "https://youtube.com; " +ag.com " +
    "https://vemtoutcheeg.com " +
    "https://*.vemtoutcheeg.com " +
    "https://gizokraijaw.net " +
    "https://*.gizokraijaw.net; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data: https:; " +
    "connect-src 'self' https: wss:; " +
    "frame-src 'self' https:; " +
    "object-src 'none';"
  );

  // Add cache control for better performance
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  } else if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
