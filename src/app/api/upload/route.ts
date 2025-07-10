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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.log('File type not allowed:', file.type);
      return NextResponse.json(
        { success: false, error: `نوع الملف غير مدعوم: ${file.type}. يرجى استخدام JPEG, PNG, WebP, أو GIF` },
        { status: 400 }
      );
    }

    console.log('File type accepted:', file.type);

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

    // التحقق من وجود bucket وإنشاؤه إذا لم يكن موجود
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (!listError) {
      const bucketExists = buckets?.some(bucket => bucket.name === 'article-images');

      if (!bucketExists) {
        console.log('Creating article-images bucket...');
        const { error: createError } = await supabase.storage.createBucket('article-images', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
          fileSizeLimit: 10485760 // 10MB
        });

        if (createError) {
          console.error('Failed to create bucket:', createError);
        } else {
          console.log('Bucket created successfully');
        }
      }
    }

    // تحويل File إلى ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // رفع الملف إلى Supabase Storage
    let uploadResult = await supabase.storage
      .from('article-images')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    // إذا فشل الرفع، جرب إنشاء bucket جديد ومحاولة مرة أخرى
    if (uploadResult.error) {
      console.log('First upload failed, trying to create bucket and retry...');

      // محاولة إنشاء bucket مرة أخرى
      await supabase.storage.createBucket('article-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760
      });

      // محاولة الرفع مرة أخرى
      uploadResult = await supabase.storage
        .from('article-images')
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true // السماح بالكتابة فوق الملف إذا كان موجود
        });
    }

    if (uploadResult.error) {
      console.error('Supabase storage error after retry:', uploadResult.error);
      return NextResponse.json(
        { success: false, error: 'فشل في رفع الصورة: ' + uploadResult.error.message },
        { status: 500 }
      );
    }

    const { data, error } = uploadResult;

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
