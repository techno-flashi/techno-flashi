import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

    return NextResponse.json({
      services: data as Service[],
      count: data?.length || 0
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
    const body = await request.json();

    // التحقق من البيانات المطلوبة
    if (!body.name || !body.description) {
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

    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create service', details: error.message },
        { status: 500 }
      );
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
