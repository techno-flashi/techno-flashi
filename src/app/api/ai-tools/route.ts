// API لإدارة أدوات الذكاء الاصطناعي
// مسار الملف: src/app/api/ai-tools/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase, fixObjectEncoding } from '@/lib/supabase';

/**
 * @description جلب قائمة بأدوات الذكاء الاصطناعي مع خيارات للفلترة والترتيب
 * @param {NextRequest} request - الطلب الوارد مع إمكانية وجود searchParams
 * @returns {NextResponse} - قائمة بالأدوات أو رسالة خطأ
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');

    // تحسين الأداء: اطلب فقط الأعمدة التي تحتاجها لعرض القائمة
    // تجنب استخدام '*' في الاستعلامات الكبيرة
    const columnsToSelect = 'id, name, slug, description, category, logo_url, pricing, rating, featured, created_at';

    let query = supabase
      .from('ai_tools')
      .select(columnsToSelect);

    // تطبيق الفلاتر أولاً
    if (statusParam) {
      query = query.eq('status', statusParam);
    } else {
      // إذا لم يتم تحديد status، استخدم كلا من published و active كوضع افتراضي
      query = query.in('status', ['published', 'active']);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    // تطبيق الترتيب والحد
    query = query
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase GET error:', error);
      return NextResponse.json(
        { message: 'Failed to fetch AI tools', details: error.message },
        { status: 500 }
      );
    }

    // إصلاح encoding النص العربي إذا لزم الأمر
    const fixedData = data?.map(tool => fixObjectEncoding(tool)) || [];

    return NextResponse.json({
      tools: fixedData,
      count: fixedData.length
    });

  } catch (error) {
    console.error('API GET Handler error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * @description إنشاء أداة ذكاء اصطناعي جديدة
 * @param {NextRequest} request - الطلب الوارد الذي يحتوي على بيانات الأداة في body
 * @returns {NextResponse} - رسالة نجاح مع بيانات الأداة الجديدة أو رسالة خطأ
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // التحقق من البيانات المطلوبة (يمكن استخدام zod هنا لمزيد من القوة)
    if (!body.name || !body.description) {
      return NextResponse.json(
        { message: 'Name and description are required fields' },
        { status: 400 }
      );
    }

    // إعداد البيانات للإدراج مع قيم افتراضية قوية
    const toolData = {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
      description: body.description,
      category: body.category || 'general',
      website_url: body.website_url || null,
      logo_url: body.logo_url || null,
      pricing: body.pricing || 'free',
      rating: body.rating || 0,
      features: body.features || [],
      status: body.status || 'active',
      featured: body.featured || false,
      tags: body.tags || [],
      pros: body.pros || [],
      cons: body.cons || [],
      use_cases: body.use_cases || []
    };

    const { data, error } = await supabase
      .from('ai_tools')
      .insert(toolData) // Supabase يتوقع مصفوفة
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error);
      
      let errorMessage = 'Failed to create AI tool';
      if (error.code === '23505') { // رمز الخطأ لتكرار القيمة الفريدة (unique constraint)
        errorMessage = 'An AI tool with this slug already exists.';
      }
      
      return NextResponse.json(
        { 
          message: errorMessage, 
          details: error.message,
        },
        { status: 409 } // 409 Conflict هو رمز أفضل لحالة التكرار
      );
    }

    // إصلاح encoding النص العربي
    const fixedData = fixObjectEncoding(data);

    // إعادة التحقق من الصفحات لتحديث المحتوى فوراً (Cache Invalidation)
    try {
      revalidatePath('/ai-tools');
      revalidatePath('/');
      console.log('✅ Pages revalidated successfully: /ai-tools, /');
    } catch (revalidateError) {
      console.error('⚠️ Page revalidation failed:', revalidateError);
    }

    return NextResponse.json({
      message: 'AI tool created successfully',
      tool: fixedData
    }, { status: 201 }); // 201 Created هو الرمز الأنسب لإنشاء مورد جديد

  } catch (error) {
    console.error('API POST Handler error:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
