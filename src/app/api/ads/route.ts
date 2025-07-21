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
      query = query.eq('ad_type', type);
    }

    if (placement) {
      query = query.eq('position', placement);
    }

    if (isActive !== null) {
      query = query.eq('enabled', isActive === 'true');
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
    if (!body.title || !body.position) {
      return NextResponse.json(
        { error: 'Title and position are required' },
        { status: 400 }
      );
    }

    const { data: ad, error } = await supabase
      .from('ads')
      .insert([{
        title: body.title,
        description: body.content || body.description,
        image_url: body.image_url,
        click_url: body.target_url || body.link_url,
        video_url: body.video_url,
        css_content: body.custom_css,
        javascript_content: body.custom_js,
        position: body.position || body.placement,
        ad_type: body.type || 'text',
        priority: body.priority || 1,
        enabled: body.is_active !== false,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        max_impressions: body.max_views || null,
        max_clicks: body.max_clicks || null
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
