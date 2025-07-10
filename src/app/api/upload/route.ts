// API لرفع الصور - مبسط وموثوق
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Upload API called');

    // محاولة قراءة FormData مباشرة بدون تحقق من Content-Type
    let formData: FormData;
    try {
      formData = await request.formData();
      console.log('✅ FormData parsed successfully');
    } catch (formError) {
      console.error('❌ Failed to parse FormData:', formError);
      return NextResponse.json(
        { success: false, error: 'فشل في قراءة بيانات النموذج' },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    console.log('📁 Form data parsed. Folder:', folder);
    
    if (!file || !(file instanceof File)) {
      console.error('❌ No valid file found in form data');
      return NextResponse.json(
        { success: false, error: 'لم يتم العثور على ملف صالح في البيانات المرسلة' },
        { status: 400 }
      );
    }

    console.log('📄 File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // التحقق البسيط من نوع الملف
    if (!file.type.startsWith('image/') && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, error: `نوع الملف غير مدعوم: ${file.type}. يرجى رفع صورة` },
        { status: 400 }
      );
    }

    console.log('✅ Image file type validated:', file.type);

    // التحقق من حجم الملف (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size, 'bytes. Max:', maxSize);
      return NextResponse.json(
        { success: false, error: `حجم الملف كبير جداً: ${(file.size / 1024 / 1024).toFixed(2)}MB. الحد الأقصى: 10MB` },
        { status: 400 }
      );
    }

    // إنشاء اسم فريد للملف
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2);
    const fileName = `${timestamp}-${randomStr}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log('📤 Uploading to path:', filePath);

    // تحويل File إلى ArrayBuffer بطريقة آمنة
    let fileBuffer: Uint8Array;
    let contentType: string;

    try {
      console.log('🔄 Converting file to buffer...');
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = new Uint8Array(arrayBuffer);
      console.log('✅ File converted to buffer. Size:', fileBuffer.length, 'bytes');

      // تحديد نوع المحتوى
      contentType = file.type;
      if (!contentType || contentType === 'application/octet-stream') {
        const ext = fileExt.toLowerCase();
        const typeMap: { [key: string]: string } = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'webp': 'image/webp',
          'gif': 'image/gif'
        };
        contentType = typeMap[ext] || 'image/jpeg';
        console.log('🔧 Content type corrected to:', contentType);
      }
    } catch (bufferError) {
      console.error('❌ File processing error:', bufferError);
      return NextResponse.json(
        { success: false, error: 'فشل في معالجة الملف' },
        { status: 500 }
      );
    }

    // رفع الملف إلى Supabase Storage
    try {
      console.log('📤 Uploading to Supabase Storage...');
      console.log('📋 Upload details:', { filePath, contentType, size: fileBuffer.length });

      const uploadResult = await supabase.storage
        .from('article-images')
        .upload(filePath, fileBuffer, {
          contentType: contentType,
          cacheControl: '3600',
          upsert: true
        });

      if (uploadResult.error) {
        console.error('❌ Supabase storage error:', uploadResult.error);
        return NextResponse.json(
          {
            success: false,
            error: `فشل في رفع الصورة إلى التخزين: ${uploadResult.error.message}`,
            details: {
              errorCode: uploadResult.error.name,
              filePath: filePath,
              contentType: contentType,
              fileSize: file.size
            }
          },
          { status: 500 }
        );
      }

      console.log('✅ Upload successful:', uploadResult.data);

      // الحصول على الرابط العام للصورة
      const { data: urlData } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      console.log('🔗 Public URL generated:', urlData.publicUrl);

      return NextResponse.json({
        success: true,
        url: urlData.publicUrl,
        path: filePath,
        size: file.size,
        type: contentType,
        name: fileName,
        originalName: file.name
      });

    } catch (uploadError) {
      console.error('❌ Upload process error:', uploadError);
      return NextResponse.json(
        {
          success: false,
          error: 'فشل في عملية الرفع',
          details: uploadError instanceof Error ? uploadError.message : String(uploadError)
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Upload API critical error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ حرج في API الرفع',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
