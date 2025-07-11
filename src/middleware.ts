import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // إضافة headers للأمان ودعم اللغة العربية
  const response = NextResponse.next();
  
  // إضافة header للغة العربية
  response.headers.set('Content-Language', 'ar');
  
  // إضافة headers للأمان
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
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
