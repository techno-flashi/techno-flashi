import { NextResponse } from 'next/server';
import { getAllArticlesForSSG, getAllAIToolsForSSG } from '@/lib/ssg';

export async function GET() {
  try {
    console.log('🔄 Testing SSG build functions...');

    const startTime = Date.now();

    // اختبار جلب المقالات
    const articlesStartTime = Date.now();
    const articles = await getAllArticlesForSSG();
    const articlesEndTime = Date.now();

    // اختبار جلب أدوات AI
    const aiToolsStartTime = Date.now();
    const aiTools = await getAllAIToolsForSSG();
    const aiToolsEndTime = Date.now();

    const endTime = Date.now();

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      totalTime: endTime - startTime,
      articles: {
        count: articles.length,
        time: articlesEndTime - articlesStartTime,
        success: articles.length > 0,
        sampleTitles: articles.slice(0, 3).map(a => a.title)
      },
      aiTools: {
        count: aiTools.length,
        time: aiToolsEndTime - aiToolsStartTime,
        success: aiTools.length > 0,
        sampleNames: aiTools.slice(0, 3).map(t => t.name)
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    };

    console.log('✅ SSG build test completed:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('💥 Exception in SSG build test:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message,
        stack: (error as Error).stack,
        timestamp: new Date().toISOString(),
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      },
      { status: 500 }
    );
  }
}
