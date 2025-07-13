import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return new NextResponse("Ad ID is required", { status: 400 });
  }

  try {
    // جلب الإعلان الحالي
    const { data: currentAd, error: fetchError } = await supabase
      .from('advertisements')
      .select('click_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Error fetching ad:", fetchError);
      throw fetchError;
    }

    // تحديث عدد النقرات
    const { error: updateError } = await supabase
      .from('advertisements')
      .update({
        click_count: (currentAd?.click_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error("Error incrementing click count:", updateError);
      throw updateError;
    }

    console.log('Click recorded successfully for ad:', id);

    return NextResponse.json({ message: "Click tracked successfully" });
  } catch (error: any) {
    return new NextResponse(`Error tracking click: ${error.message}`, {
      status: 500,
    });
  }
}
