import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // معاملات الاستعلام
    const type = searchParams.get('type');
    const placement = searchParams.get('placement');
    const status = searchParams.get('status');
    const isActive = searchParams.get('is_active');
    const limit = searchParams.get('limit');

    console.log('Fetching ads with params:', { type, placement, status, isActive, limit });

    // بناء الاستعلام
    let query = supabase
      .from('ads')
      .select('*');

    // تطبيق الفلاتر
    if (type) {
      query = query.eq('type', type);
    }

    if (placement) {
      query = query.eq('placement', placement);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    // ترتيب حسب الأولوية ثم تاريخ الإنشاء
    query = query.order('priority', { ascending: true });
    query = query.order('created_at', { ascending: false });

    // تطبيق الحد
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: ads, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch ads', details: error.message },
        { status: 500 }
      );
    }

    console.log(`Fetched ${ads?.length || 0} ads from database`);

    return NextResponse.json({
      ads: ads || [],
      count: ads?.length || 0
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/ads - Creating new ad');
    const body = await request.json();

    console.log('Creating new ad:', body);

    // التحقق من البيانات المطلوبة
    if (!body.title || !body.placement) {
      return NextResponse.json(
        { error: 'Title and placement are required' },
        { status: 400 }
      );
    }

    const { data: ad, error } = await supabase
      .from('ads')
      .insert([{
        title: body.title,
        description: body.description,
        image_url: body.image_url,
        link_url: body.link_url,
        ad_code: body.ad_code,
        placement: body.placement,
        type: body.type || 'banner',
        status: body.status || 'active',
        priority: body.priority || 0,
        is_active: body.is_active !== false,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        target_blank: body.target_blank !== false,
        width: body.width,
        height: body.height,
        animation_delay: body.animation_delay || 0,
        sponsor_name: body.sponsor_name
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error creating ad:', error);

      // تحديد نوع الخطأ لإعطاء رسالة أوضح
      let errorMessage = 'Failed to create ad';
      if (error.message.includes('permission')) {
        errorMessage = 'Permission denied. Please check authentication.';
      } else if (error.message.includes('duplicate')) {
        errorMessage = 'Ad with this title already exists.';
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

    console.log('Ad created successfully:', ad.id);

    return NextResponse.json({ ad }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
