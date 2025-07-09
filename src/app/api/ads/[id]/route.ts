import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: ad, error } = await supabase
      .from('ads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch ad', details: error.message },
        { status: 500 }
      );
    }

    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ad });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log('Updating ad:', id, body);

    const { data: ad, error } = await supabase
      .from('ads')
      .update({
        title: body.title,
        description: body.description,
        image_url: body.image_url,
        link_url: body.link_url,
        ad_code: body.ad_code,
        placement: body.placement,
        type: body.type,
        status: body.status,
        priority: body.priority,
        is_active: body.is_active,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        target_blank: body.target_blank,
        width: body.width,
        height: body.height,
        animation_delay: body.animation_delay,
        sponsor_name: body.sponsor_name,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update ad', details: error.message },
        { status: 500 }
      );
    }

    console.log('Ad updated successfully:', ad.id);

    return NextResponse.json({ ad });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Deleting ad:', id);

    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete ad', details: error.message },
        { status: 500 }
      );
    }

    console.log('Ad deleted successfully:', id);

    return NextResponse.json({ message: 'Ad deleted successfully' });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
