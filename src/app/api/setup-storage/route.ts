// API لإعداد Supabase Storage
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Setting up Supabase Storage...');

    // إنشاء bucket للصور إذا لم يكن موجوداً
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json(
        { success: false, error: 'Failed to list buckets: ' + listError.message },
        { status: 500 }
      );
    }

    console.log('Existing buckets:', buckets?.map(b => b.name));

    const bucketExists = buckets?.some(bucket => bucket.name === 'article-images');

    if (!bucketExists) {
      console.log('Creating article-images bucket...');
      
      const { data: bucket, error: createError } = await supabase.storage.createBucket('article-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return NextResponse.json(
          { success: false, error: 'Failed to create bucket: ' + createError.message },
          { status: 500 }
        );
      }

      console.log('Bucket created successfully:', bucket);
    } else {
      console.log('Bucket already exists');
    }

    // اختبار رفع ملف تجريبي
    const testFile = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]); // PNG header
    const testPath = 'test/test-image.png';

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(testPath, testFile, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error testing upload:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to test upload: ' + uploadError.message },
        { status: 500 }
      );
    }

    console.log('Test upload successful:', uploadData);

    // حذف الملف التجريبي
    await supabase.storage.from('article-images').remove([testPath]);

    return NextResponse.json({
      success: true,
      message: 'Storage setup completed successfully',
      bucketExists: bucketExists,
      testUpload: 'successful'
    });

  } catch (error) {
    console.error('Setup storage error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}
