import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Service } from '@/types';

// GET - جلب خدمة واحدة بالمعرف
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch service', details: error.message },
        { status: 500 }
      );
    }

    console.log(`API Service fetched: ${data.name}`);

    return NextResponse.json({
      service: data as Service
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - تحديث خدمة
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // إعداد البيانات للتحديث
    const updateData = {
      name: body.name,
      description: body.description,
      short_description: body.short_description,
      category: body.category,
      icon_url: body.icon_url,
      image_url: body.image_url,
      pricing_type: body.pricing_type,
      pricing_amount: body.pricing_amount,
      pricing_currency: body.pricing_currency,
      status: body.status,
      featured: body.featured,
      cta_text: body.cta_text,
      cta_link: body.cta_link,
      display_order: body.display_order,
      tags: body.tags,
      features: body.features,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update service', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Service updated successfully',
      service: data as Service
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - حذف خدمة
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete service', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
