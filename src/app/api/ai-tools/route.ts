// API لإدارة أدوات الذكاء الاصطناعي
import { NextRequest, NextResponse } from 'next/server';
import { supabase, fixObjectEncoding } from '@/lib/supabase';

// GET - جلب جميع أدوات الذكاء الاصطناعي
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/ai-tools');
    
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');

    let query = supabase
      .from('ai_tools')
      .select('*');

    // إذا لم يتم تحديد status، استخدم كلا من published و active
    if (statusParam) {
      query = query.eq('status', statusParam);
    } else {
      query = query.in('status', ['published', 'active']);
    }

    query = query
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch AI tools', details: error.message },
        { status: 500 }
      );
    }

    console.log(`API AI Tools fetched from database: ${data?.length || 0}`);

    // إصلاح encoding النص العربي
    const fixedData = data?.map(tool => fixObjectEncoding(tool)) || [];

    return NextResponse.json({
      tools: fixedData,
      count: fixedData?.length || 0
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - إنشاء أداة ذكاء اصطناعي جديدة
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/ai-tools - Creating new AI tool');
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    // التحقق من البيانات المطلوبة
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    // إعداد البيانات للإدراج
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

    console.log('AI Tool data to insert:', JSON.stringify(toolData, null, 2));

    const { data, error } = await supabase
      .from('ai_tools')
      .insert([toolData])
      .select()
      .single();

    if (error) {
      console.error('Database error creating AI tool:', error);
      
      let errorMessage = 'Failed to create AI tool';
      if (error.message.includes('duplicate')) {
        errorMessage = 'AI tool with this slug already exists.';
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

    console.log('AI Tool created successfully:', data.id);

    // إصلاح encoding النص العربي
    const fixedData = fixObjectEncoding(data);

    return NextResponse.json({
      message: 'AI tool created successfully',
      tool: fixedData
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
