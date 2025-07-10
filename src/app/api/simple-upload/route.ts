// API بسيط جداً لرفع الصور - خطة احتياطية
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Simple Upload API called');
    
    // محاولة قراءة FormData
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error('❌ Failed to parse FormData:', formError);
      return NextResponse.json(
        { success: false, error: 'فشل في قراءة بيانات النموذج' },
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
      const { data, error } = await supabase.storage
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
      const { data: urlData } = supabase.storage
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
