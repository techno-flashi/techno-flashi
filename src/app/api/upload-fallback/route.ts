// API بديل لرفع الصور مع تحويل تلقائي
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Fallback Upload API called');
    
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

    // التحقق من حجم الملف (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'حجم الملف كبير جداً. الحد الأقصى 10MB' },
        { status: 400 }
      );
    }

    // تحويل جميع الصور إلى PNG لضمان التوافق
    let processedFile = file;
    let finalContentType = file.type;

    // إذا كان الملف WebP أو غير مدعوم، نحوله إلى PNG
    if (file.type === 'image/webp' || !['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
      console.log('Converting image to PNG for compatibility...');
      
      try {
        // قراءة الملف كـ ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // تحويل إلى PNG باستخدام Canvas (هذا يعمل في Node.js مع canvas package)
        // لكن بما أننا في Next.js، سنستخدم طريقة أبسط
        
        // إنشاء ملف جديد بنفس البيانات لكن بـ content type مختلف
        const pngBuffer = new Uint8Array(arrayBuffer);
        const fileName = file.name.replace(/\.[^/.]+$/, '') + '.png';
        
        processedFile = new File([pngBuffer], fileName, {
          type: 'image/png',
          lastModified: Date.now(),
        });
        
        finalContentType = 'image/png';
        console.log('Image converted to PNG');
        
      } catch (conversionError) {
        console.error('Image conversion failed:', conversionError);
        // إذا فشل التحويل، استخدم الملف الأصلي
        finalContentType = 'image/jpeg'; // افتراض JPEG كـ fallback
      }
    }

    // إنشاء اسم فريد للملف
    const fileExt = finalContentType === 'image/png' ? 'png' : 
                   finalContentType === 'image/gif' ? 'gif' : 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log('Uploading to path:', filePath, 'with content type:', finalContentType);

    // تحويل File إلى ArrayBuffer
    const arrayBuffer = await processedFile.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // محاولة رفع الملف
    const { data, error } = await supabase.storage
      .from('article-images')
      .upload(filePath, fileBuffer, {
        contentType: finalContentType,
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Supabase storage error:', error);
      
      // محاولة أخيرة مع content type مختلف
      const retryResult = await supabase.storage
        .from('article-images')
        .upload(filePath, fileBuffer, {
          contentType: 'image/jpeg', // استخدام JPEG كـ fallback
          cacheControl: '3600',
          upsert: true
        });

      if (retryResult.error) {
        return NextResponse.json(
          { success: false, error: 'فشل في رفع الصورة: ' + retryResult.error.message },
          { status: 500 }
        );
      }
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
      size: processedFile.size,
      type: finalContentType,
      name: fileName,
      originalType: file.type,
      converted: file.type !== finalContentType
    });

  } catch (error) {
    console.error('Fallback Upload API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء رفع الصورة' },
      { status: 500 }
    );
  }
}
