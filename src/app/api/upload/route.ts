// API لرفع الصور - محسن ومُصحح
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Upload API called');

    // التحقق من Content-Type
    const contentType = request.headers.get('content-type');
    console.log('📋 Request Content-Type:', contentType);

    if (!contentType?.includes('multipart/form-data')) {
      console.error('❌ Invalid Content-Type. Expected multipart/form-data, got:', contentType);
      return NextResponse.json(
        { success: false, error: 'نوع المحتوى غير صحيح. يجب أن يكون multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    console.log('📁 Form data parsed. Folder:', folder);
    
    if (!file) {
      console.error('❌ No file found in form data');
      return NextResponse.json(
        { success: false, error: 'لم يتم العثور على ملف في البيانات المرسلة' },
        { status: 400 }
      );
    }

    console.log('📄 File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // التحقق من أن الملف هو صورة
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const isValidImage = allowedTypes.includes(file.type) || file.type.startsWith('image/');

    if (!isValidImage) {
      console.error('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, error: `نوع الملف غير مدعوم: ${file.type}. الأنواع المدعومة: JPEG, PNG, WebP, GIF` },
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

    try {
      // تحويل File إلى ArrayBuffer
      console.log('🔄 Converting file to buffer...');
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);
      console.log('✅ File converted to buffer. Size:', fileBuffer.length, 'bytes');

      // تحديد نوع المحتوى بناءً على امتداد الملف إذا لم يكن محدد
      let contentType = file.type;
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

      // رفع الملف إلى Supabase Storage
      console.log('📤 Uploading to Supabase Storage...');
      const uploadResult = await supabase.storage
        .from('article-images')
        .upload(filePath, fileBuffer, {
          contentType: contentType,
          cacheControl: '3600',
          upsert: true // السماح بالكتابة فوق الملف إذا كان موجود
        });

      if (uploadResult.error) {
        console.error('❌ Supabase storage error:', uploadResult.error);
        return NextResponse.json(
          {
            success: false,
            error: `فشل في رفع الصورة: ${uploadResult.error.message}`,
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

    } catch (bufferError) {
      console.error('❌ File processing error:', bufferError);
      return NextResponse.json(
        { success: false, error: 'فشل في معالجة الملف: ' + bufferError },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Upload API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'حدث خطأ غير متوقع أثناء رفع الصورة',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
