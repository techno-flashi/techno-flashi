import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adId, position, timestamp } = body;

    if (!adId) {
      return NextResponse.json(
        { error: 'Ad ID is required' },
        { status: 400 }
      );
    }

    // تسجيل النقرة في جدول إحصائيات الإعلانات (إذا كان موجوداً)
    // يمكن إنشاء جدول ad_clicks لتتبع النقرات
    const { error: clickError } = await supabase
      .from('ad_clicks')
      .insert([{
        ad_id: adId,
        position: position,
        clicked_at: timestamp || new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      }]);

    // حتى لو فشل تسجيل النقرة، نعيد نجاح العملية
    // لأن المهم هو عدم إعاقة تجربة المستخدم
    if (clickError) {
      console.error('Error logging ad click:', clickError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in ad click API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
