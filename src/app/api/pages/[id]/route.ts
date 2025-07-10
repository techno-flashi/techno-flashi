// API لإدارة صفحة واحدة
import { NextRequest, NextResponse } from 'next/server';
import { supabase, fixObjectEncoding } from '@/lib/supabase';
import { createAuthenticatedHandler } from '@/lib/auth-middleware';
import { sanitizeHtml, sanitizeText, validateInput } from '@/lib/sanitize';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// جلب صفحة واحدة
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('site_pages')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)  // فقط الصفحات النشطة للعامة
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'الصفحة غير موجودة' },
        { status: 404 }
      );
    }

    // إصلاح encoding النص العربي
    const fixedData = fixObjectEncoding(data);

    return NextResponse.json({
      success: true,
      data: fixedData
    });

  } catch (error) {
    console.error('خطأ في جلب الصفحة:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// تحديث صفحة - محمي بالمصادقة
export const PUT = createAuthenticatedHandler(async (request: NextRequest, { params }: RouteParams, user: any) => {
  try {
    const { id } = await params;

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(`update-page-${clientIP}`, 10, 300); // 10 طلبات كل 5 دقائق

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'تم تجاوز الحد الأقصى للطلبات' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    const body = await request.json();
    const { title_ar, content_ar, meta_description, meta_keywords, is_active, display_order } = body;

    // التحقق من صحة البيانات
    if (!validateInput(title_ar, 'text') || !validateInput(content_ar, 'html')) {
      return NextResponse.json(
        { success: false, message: 'البيانات المدخلة غير صحيحة' },
        { status: 400 }
      );
    }

    // تنظيف البيانات
    const cleanTitle = sanitizeText(title_ar);
    const cleanContent = sanitizeHtml(content_ar);
    const cleanMetaDescription = meta_description ? sanitizeText(meta_description) : null;
    const cleanMetaKeywords = meta_keywords ? sanitizeText(meta_keywords) : null;

    // تحديث الصفحة
    const { data, error } = await supabase
      .from('site_pages')
      .update({
        title_ar: cleanTitle,
        content_ar: cleanContent,
        meta_description: cleanMetaDescription,
        meta_keywords: cleanMetaKeywords,
        is_active: is_active !== undefined ? is_active : true,
        display_order: display_order || 0
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('خطأ في تحديث الصفحة:', error);
      return NextResponse.json(
        { success: false, message: 'فشل في تحديث الصفحة' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'الصفحة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الصفحة بنجاح',
      data
    });

  } catch (error) {
    console.error('خطأ في تحديث الصفحة:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
});

// حذف صفحة - محمي بالمصادقة
export const DELETE = createAuthenticatedHandler(async (request: NextRequest, { params }: RouteParams, user: any) => {
  try {
    const { id } = await params;

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(`delete-page-${clientIP}`, 3, 300); // 3 طلبات كل 5 دقائق

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'تم تجاوز الحد الأقصى للطلبات' },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    const { data, error } = await supabase
      .from('site_pages')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('خطأ في حذف الصفحة:', error);
      return NextResponse.json(
        { success: false, message: 'فشل في حذف الصفحة' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'الصفحة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف الصفحة بنجاح'
    }, {
      headers: getRateLimitHeaders(rateLimitResult)
    });

  } catch (error) {
    console.error('خطأ في حذف الصفحة:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
});
