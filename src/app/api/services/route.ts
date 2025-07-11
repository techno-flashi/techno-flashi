import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase, fixObjectEncoding } from '@/lib/supabase';
import { Service } from '@/types';

// GET - جلب جميع الخدمات مع إمكانية الفلترة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    console.log('Fetching services from database with status:', status);

    let query = supabase
      .from('services')
      .select('*');

    // تطبيق الفلاتر
    if (status) {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    // ترتيب النتائج
    query = query.order('display_order', { ascending: true })
                 .order('created_at', { ascending: false });

    // تحديد عدد النتائج
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch services', details: error.message },
        { status: 500 }
      );
    }

    console.log(`API Services fetched from database: ${data?.length || 0}`);

    // إصلاح encoding النص العربي
    const fixedData = data?.map(service => fixObjectEncoding(service)) || [];

    return NextResponse.json({
      services: fixedData as Service[],
      count: fixedData?.length || 0
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - إنشاء خدمة جديدة
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/services - Creating new service');

    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    // التحقق من البيانات المطلوبة
    if (!body.name || !body.description) {
      console.log('Validation failed: Missing name or description');
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // إعداد البيانات للإدراج
    const serviceData = {
      name: body.name,
      description: body.description,
      short_description: body.short_description || null,
      category: body.category || 'general',
      icon_url: body.icon_url || null,
      image_url: body.image_url || null,
      pricing_type: body.pricing_type || 'custom',
      pricing_amount: body.pricing_amount || null,
      pricing_currency: body.pricing_currency || 'USD',
      status: body.status || 'active',
      featured: body.featured || false,
      cta_text: body.cta_text || 'تعرف أكثر',
      cta_link: body.cta_link || null,
      display_order: body.display_order || 0,
      tags: body.tags || [],
      features: body.features || []
    };

    console.log('Service data to insert:', JSON.stringify(serviceData, null, 2));

    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      console.error('Database error creating service:', error);

      // تحديد نوع الخطأ لإعطاء رسالة أوضح
      let errorMessage = 'Failed to create service';
      if (error.message.includes('permission')) {
        errorMessage = 'Permission denied. Please check authentication.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'Service with this name already exists.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Invalid data provided.';
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: error.message,
          code: error.code || 'UNKNOWN_ERROR'
        },
        { status: 500 }
      );
    }

    // إعادة التحقق من صفحات الخدمات لتحديث المحتوى فوراً
    try {
      revalidatePath('/services');
      revalidatePath('/');
      console.log('✅ Pages revalidated successfully');
    } catch (revalidateError) {
      console.error('⚠️ Revalidation error:', revalidateError);
      // لا نوقف العملية، فقط نسجل الخطأ
    }

    return NextResponse.json({
      message: 'Service created successfully',
      service: data as Service
    }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
