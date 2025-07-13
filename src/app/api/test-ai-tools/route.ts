import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔄 Testing AI tools connection...');

    const { data, error, count } = await supabase
      .from('ai_tools')
      .select('id, name, slug, status', { count: 'exact' })
      .in('status', ['published', 'active'])
      .limit(5);

    if (error) {
      console.error('❌ Error testing AI tools:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        },
        { status: 500 }
      );
    }

    console.log(`✅ AI tools test successful: ${count} total, ${data?.length || 0} fetched`);

    return NextResponse.json({
      success: true,
      count: count || 0,
      sampleData: data || [],
      message: 'AI tools connection test successful'
    });

  } catch (error) {
    console.error('💥 Exception in AI tools test:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message,
        stack: (error as Error).stack
      },
      { status: 500 }
    );
  }
}
