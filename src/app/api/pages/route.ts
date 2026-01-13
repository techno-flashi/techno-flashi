// API لإدارة الصفحات الثابتة
import { NextRequest, NextResponse } from 'next/server';
import { supabase, fixObjectEncoding } from '@/lib/supabase';
import { createAuthenticatedHandler } from '@/lib/auth-middleware';
import { sanitizeHtml, sanitizeText, validateInput } from '@/lib/sanitize';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// جلب جميع الصفحات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';

    let query = supabase
      .from('site_pages')
      .select('*')
      .order('display_order', { ascending: true });

    // إذا لم يطلب المستخدم الصفحات غير النشطة، فلتر فقط النشطة
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('خطأ في جلب الصفحات:', error);
      return NextResponse.json(
        { success: false, message: 'فشل في جلب الصفحات' },
        { status: 500 }
      );
    }

    // إصلاح encoding النص العربي
    const fixedData = data?.map(page => fixObjectEncoding(page)) || [];

    return NextResponse.json({
      success: true,
      data: fixedData
    });

  } catch (error) {
    console.error('خطأ في API الصفحات:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// إنشاء صفحة جديدة - محمي بالمصادقة
export const POST = createAuthenticatedHandler(async (request: NextRequest, context: any, user: any) => {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(`create-page-${clientIP}`, 5, 300); // 5 طلبات كل 5 دقائق

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
    const { page_key, title_ar, content_ar, meta_description, meta_keywords, display_order } = body;

    // التحقق من صحة البيانات
    if (!validateInput(page_key, 'text') || !validateInput(title_ar, 'text') || !validateInput(content_ar, 'html')) {
      return NextResponse.json(
        { success: false, message: 'البيانات المدخلة غير صحيحة' },
        { status: 400 }
      );
    }

    // تنظيف البيانات
    const cleanPageKey = sanitizeText(page_key);
    const cleanTitle = sanitizeText(title_ar);
    const cleanContent = sanitizeHtml(content_ar);
    const cleanMetaDescription = meta_description ? sanitizeText(meta_description) : null;
    const cleanMetaKeywords = meta_keywords ? sanitizeText(meta_keywords) : null;

    // التحقق من عدم وجود page_key مكرر
    const { data: existingPage } = await supabase
      .from('site_pages')
      .select('id')
      .eq('page_key', cleanPageKey)
      .single();

    if (existingPage) {
      return NextResponse.json(
        { success: false, message: 'مفتاح الصفحة موجود بالفعل' },
        { status: 400 }
      );
    }

    // إنشاء الصفحة الجديدة
    const { data, error } = await supabase
      .from('site_pages')
      .insert([{
        page_key: cleanPageKey,
        title_ar: cleanTitle,
        content_ar: cleanContent,
        meta_description: cleanMetaDescription,
        meta_keywords: cleanMetaKeywords,
        display_order: display_order || 0,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      console.error('خطأ في إنشاء الصفحة:', error);
      return NextResponse.json(
        { success: false, message: 'فشل في إنشاء الصفحة' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الصفحة بنجاح',
      data
    }, {
      headers: getRateLimitHeaders(rateLimitResult)
    });

  } catch (error) {
    console.error('خطأ في إنشاء الصفحة:', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
});
