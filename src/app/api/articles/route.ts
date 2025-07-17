// API لإدارة المقالات
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase, fixObjectEncoding } from '@/lib/supabase';
import { Article } from '@/types';

// GET - جلب جميع المقالات
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/articles');
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');
    
    let query = supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        published_at,
        created_at,
        reading_time,
        author,
        tags,
        featured
      `)
      .eq('status', status)
      .order('published_at', { ascending: false });

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    } else {
      // تحديد حد افتراضي لتحسين الأداء
      query = query.limit(20);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch articles', details: error.message },
        { status: 500 }
      );
    }

    console.log(`API Articles fetched from database: ${data?.length || 0}`);

    // إصلاح encoding النص العربي
    const fixedData = data?.map(article => fixObjectEncoding(article)) || [];

    return NextResponse.json({
      articles: fixedData as any[],
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

// POST - إنشاء مقال جديد
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/articles - Creating new article');
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    // التحقق من البيانات المطلوبة
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // إعداد البيانات للإدراج
    const articleData = {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
      excerpt: body.excerpt || null,
      content: body.content,
      featured_image_url: body.featured_image_url || null,
      status: body.status || 'draft',
      published_at: body.status === 'published' ? new Date().toISOString() : null,
      author_name: body.author_name || 'TechnoFlash',
      reading_time: body.reading_time || 5,
      tags: body.tags || [],
      category: body.category || 'تقنية',
      featured: body.featured || false,
      meta_title: body.meta_title || body.title,
      meta_description: body.meta_description || body.excerpt,
      meta_keywords: body.meta_keywords || []
    };

    console.log('Article data to insert:', JSON.stringify(articleData, null, 2));

    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();

    if (error) {
      console.error('Database error creating article:', error);
      
      let errorMessage = 'Failed to create article';
      if (error.message.includes('duplicate')) {
        errorMessage = 'Article with this slug already exists.';
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

    console.log('Article created successfully:', data.id);

    // إعادة التحقق من صفحات المقالات لتحديث المحتوى فوراً
    try {
      revalidatePath('/articles');
      revalidatePath('/');
      console.log('✅ Pages revalidated successfully');
    } catch (revalidateError) {
      console.error('⚠️ Revalidation error:', revalidateError);
      // لا نوقف العملية، فقط نسجل الخطأ
    }

    // إصلاح encoding النص العربي
    const fixedData = fixObjectEncoding(data);

    return NextResponse.json({
      message: 'Article created successfully',
      article: fixedData as Article
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
