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
    // هذا هو التصحيح: استدعاء الدالة 'increment_ad_click'
    const { error } = await supabase.rpc('increment_ad_click', { ad_id: id });

    if (error) {
      console.error("Error incrementing click count:", error);
      throw error;
    }

    console.log('Click recorded successfully for ad:', id);

    return NextResponse.json({ message: "Click tracked successfully" });
  } catch (error: any) {
    return new NextResponse(`Error tracking click: ${error.message}`, {
      status: 500,
    });
  }
}
