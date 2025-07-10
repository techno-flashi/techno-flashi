// API بسيط جداً لرفع الصور - خطة احتياطية
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Simple Upload API called');
    console.log('📋 Request headers:', Object.fromEntries(request.headers.entries()));

    // محاولة قراءة FormData
    let formData: FormData;
    try {
      formData = await request.formData();
      console.log('✅ FormData parsed successfully');
      console.log('📋 FormData keys:', Array.from(formData.keys()));
    } catch (formError) {
      console.error('❌ Failed to parse FormData:', formError);
      console.error('❌ FormData error details:', {
        name: formError instanceof Error ? formError.name : 'Unknown',
        message: formError instanceof Error ? formError.message : String(formError),
        stack: formError instanceof Error ? formError.stack : undefined
      });
      return NextResponse.json(
        { success: false, error: 'فشل في قراءة بيانات النموذج', details: formError instanceof Error ? formError.message : String(formError) },
        { status: 400 }
      );
    }
    
    // الحصول على الملف
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'لم يتم العثور على ملف صالح' },
        { status: 400 }
      );
    }
    
    // إنشاء اسم فريد للملف
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2);
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${timestamp}-${randomStr}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    
    try {
      // تحويل الملف إلى ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);
      
      // تحديد نوع المحتوى
      let contentType = file.type;
      if (!contentType || contentType === 'application/octet-stream') {
        const typeMap: Record<string, string> = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'webp': 'image/webp',
          'gif': 'image/gif'
        };
        contentType = typeMap[fileExt] || 'image/jpeg';
      }
      
      // رفع الملف إلى Supabase
      const { data, error } = await supabaseServer.storage
        .from('article-images')
        .upload(filePath, fileBuffer, {
          contentType: contentType,
          upsert: true
        });
      
      if (error) {
        console.error('❌ Upload error:', error);
        return NextResponse.json(
          { success: false, error: `فشل في رفع الصورة: ${error.message}` },
          { status: 500 }
        );
      }
      
      // الحصول على الرابط العام
      const { data: urlData } = supabaseServer.storage
        .from('article-images')
        .getPublicUrl(filePath);
      
      return NextResponse.json({
        success: true,
        url: urlData.publicUrl,
        path: filePath,
        name: fileName
      });
      
    } catch (error) {
      console.error('❌ File processing error:', error);
      return NextResponse.json(
        { success: false, error: 'فشل في معالجة الملف' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ Critical error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}
