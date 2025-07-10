// API لاختبار Supabase Storage
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🧪 Testing Supabase Storage connection...');
    
    // اختبار الاتصال بـ Storage
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Failed to list buckets:', listError);
      return NextResponse.json({
        success: false,
        error: 'فشل في الاتصال بـ Storage',
        details: listError.message
      }, { status: 500 });
    }
    
    console.log('✅ Buckets found:', buckets?.map(b => b.name));
    
    // التحقق من وجود bucket المطلوب
    const articleImagesBucket = buckets?.find(b => b.name === 'article-images');
    
    if (!articleImagesBucket) {
      console.log('⚠️ article-images bucket not found, attempting to create...');
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('article-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        console.error('❌ Failed to create bucket:', createError);
        return NextResponse.json({
          success: false,
          error: 'فشل في إنشاء bucket',
          details: createError.message
        }, { status: 500 });
      }
      
      console.log('✅ Bucket created successfully');
    }
    
    // اختبار رفع ملف تجريبي
    const testData = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]); // PNG header
    const testPath = `test/test-${Date.now()}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(testPath, testData, {
        contentType: 'image/png',
        upsert: true
      });
    
    if (uploadError) {
      console.error('❌ Test upload failed:', uploadError);
      return NextResponse.json({
        success: false,
        error: 'فشل في اختبار الرفع',
        details: uploadError.message
      }, { status: 500 });
    }
    
    console.log('✅ Test upload successful');
    
    // حذف الملف التجريبي
    await supabase.storage.from('article-images').remove([testPath]);
    
    return NextResponse.json({
      success: true,
      message: 'Supabase Storage يعمل بشكل صحيح',
      buckets: buckets?.map(b => b.name),
      articleImagesBucketExists: !!articleImagesBucket,
      testUpload: 'successful'
    });
    
  } catch (error) {
    console.error('❌ Critical storage test error:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ حرج في اختبار Storage',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // اختبار رفع ملف حقيقي
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'لم يتم العثور على ملف للاختبار'
      }, { status: 400 });
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);
    const testPath = `test/real-test-${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('article-images')
      .upload(testPath, fileBuffer, {
        contentType: file.type,
        upsert: true
      });
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'فشل في رفع الملف التجريبي',
        details: error.message
      }, { status: 500 });
    }
    
    const { data: urlData } = supabase.storage
      .from('article-images')
      .getPublicUrl(testPath);
    
    // حذف الملف التجريبي بعد 10 ثوان
    setTimeout(async () => {
      await supabase.storage.from('article-images').remove([testPath]);
    }, 10000);
    
    return NextResponse.json({
      success: true,
      message: 'تم رفع الملف التجريبي بنجاح',
      url: urlData.publicUrl,
      path: testPath,
      fileSize: file.size,
      fileType: file.type
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'خطأ في اختبار رفع الملف',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
