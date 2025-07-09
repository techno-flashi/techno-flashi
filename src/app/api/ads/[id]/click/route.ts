import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Recording click for ad:', id);

    // تحديث عدد النقرات
    const { data: ad, error } = await supabase
      .from('ads')
      .update({
        click_count: supabase.sql`click_count + 1`,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('click_count, link_url, target_blank')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to record click', details: error.message },
        { status: 500 }
      );
    }

    console.log('Click recorded successfully. New count:', ad.click_count);

    return NextResponse.json({
      message: 'Click recorded successfully',
      click_count: ad.click_count,
      link_url: ad.link_url,
      target_blank: ad.target_blank
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
