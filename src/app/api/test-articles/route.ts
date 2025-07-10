// API لاختبار جلب المقالات
import { NextRequest, NextResponse } from 'next/server';
import { supabase, fixObjectEncoding } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing articles fetch...');
    
    // جلب جميع المقالات بدون فلترة
    const { data: allArticles, error: allError } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Error fetching all articles:', allError);
      return NextResponse.json({
        success: false,
        error: allError.message,
        allArticles: 0,
        publishedArticles: 0
      });
    }

    // جلب المقالات المنشورة فقط
    const { data: publishedArticles, error: publishedError } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (publishedError) {
      console.error('❌ Error fetching published articles:', publishedError);
      return NextResponse.json({
        success: false,
        error: publishedError.message,
        allArticles: allArticles?.length || 0,
        publishedArticles: 0
      });
    }

    console.log('✅ Articles test results:');
    console.log('- Total articles:', allArticles?.length || 0);
    console.log('- Published articles:', publishedArticles?.length || 0);

    // إصلاح encoding النص العربي
    const fixedPublished = publishedArticles?.map(article => fixObjectEncoding(article)) || [];

    return NextResponse.json({
      success: true,
      allArticles: allArticles?.length || 0,
      publishedArticles: publishedArticles?.length || 0,
      sampleArticles: fixedPublished.slice(0, 3).map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
        published_at: article.published_at,
        created_at: article.created_at,
        excerpt: article.excerpt?.substring(0, 100) + '...'
      })),
      latestCreated: allArticles?.slice(0, 5).map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
        created_at: article.created_at
      }))
    });

  } catch (error) {
    console.error('❌ Test articles API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
