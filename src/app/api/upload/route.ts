// API لرفع الصور
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'لم يتم العثور على ملف' },
        { status: 400 }
      );
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'نوع الملف غير مدعوم. يرجى استخدام JPEG, PNG, WebP, أو GIF' },
        { status: 400 }
      );
    }

    // التحقق من حجم الملف (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'حجم الملف كبير جداً. الحد الأقصى 10MB' },
        { status: 400 }
      );
    }

    // إنشاء اسم فريد للملف
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log('Uploading to path:', filePath);

    // تحويل File إلى ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // رفع الملف إلى Supabase Storage
    const { data, error } = await supabase.storage
      .from('article-images')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json(
        { success: false, error: 'فشل في رفع الصورة: ' + error.message },
        { status: 500 }
      );
    }

    console.log('Upload successful:', data);

    // الحصول على الرابط العام للصورة
    const { data: urlData } = supabase.storage
      .from('article-images')
      .getPublicUrl(filePath);

    console.log('Public URL:', urlData.publicUrl);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      size: file.size,
      type: file.type,
      name: fileName
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء رفع الصورة' },
      { status: 500 }
    );
  }
}
