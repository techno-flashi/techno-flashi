// أداة تشخيص شاملة لفحص مشاكل الصور
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// قراءة متغيرات البيئة من .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  }
}

loadEnvFile();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zgktrwpladrkhhemhnni.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Supabase key not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugImages() {
  console.log('🔍 بدء تشخيص مشاكل الصور...\n');

  try {
    // 1. فحص المقالات وصورها المميزة
    console.log('📄 فحص المقالات وصورها المميزة:');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, slug, featured_image_url, status')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5);

    if (articlesError) {
      console.error('❌ خطأ في جلب المقالات:', articlesError);
      return;
    }

    console.log(`✅ تم العثور على ${articles?.length || 0} مقال منشور\n`);

    for (const article of articles || []) {
      console.log(`📰 المقال: "${article.title}"`);
      console.log(`   🆔 ID: ${article.id}`);
      console.log(`   🔗 Slug: ${article.slug}`);
      console.log(`   🖼️ Featured Image: ${article.featured_image_url || 'غير محدد'}`);
      
      // فحص صور المقال
      const { data: articleImages, error: imagesError } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', article.id)
        .order('display_order', { ascending: true });

      if (imagesError) {
        console.log(`   ❌ خطأ في جلب صور المقال: ${imagesError.message}`);
      } else {
        console.log(`   📸 عدد الصور المرفقة: ${articleImages?.length || 0}`);
        
        if (articleImages && articleImages.length > 0) {
          articleImages.forEach((img, index) => {
            console.log(`     ${index + 1}. ${img.image_url}`);
            console.log(`        Caption: ${img.caption || 'بدون تسمية'}`);
            console.log(`        Order: ${img.display_order}`);
            console.log(`        Path: ${img.image_path || 'غير محدد'}`);
          });
        }
      }
      console.log('');
    }

    // 2. فحص جدول article_images بشكل عام
    console.log('📊 إحصائيات جدول article_images:');
    const { data: allImages, error: allImagesError } = await supabase
      .from('article_images')
      .select('article_id, image_url, image_path, created_at')
      .order('created_at', { ascending: false });

    if (allImagesError) {
      console.error('❌ خطأ في جلب جميع الصور:', allImagesError);
    } else {
      console.log(`✅ إجمالي الصور في قاعدة البيانات: ${allImages?.length || 0}`);
      
      // تجميع الصور حسب المقال
      const imagesByArticle = {};
      allImages?.forEach(img => {
        if (!imagesByArticle[img.article_id]) {
          imagesByArticle[img.article_id] = [];
        }
        imagesByArticle[img.article_id].push(img);
      });

      console.log(`📈 عدد المقالات التي تحتوي على صور: ${Object.keys(imagesByArticle).length}`);
      
      // عرض أحدث الصور
      console.log('\n🆕 أحدث 5 صور مرفوعة:');
      allImages?.slice(0, 5).forEach((img, index) => {
        console.log(`${index + 1}. ${img.image_url}`);
        console.log(`   Article ID: ${img.article_id}`);
        console.log(`   Path: ${img.image_path || 'غير محدد'}`);
        console.log(`   تاريخ الرفع: ${new Date(img.created_at).toLocaleString('ar-EG')}`);
      });
    }

    // 3. فحص مسارات التخزين
    console.log('\n💾 فحص مسارات التخزين:');
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('article-images')
      .list('articles', { limit: 10 });

    if (storageError) {
      console.error('❌ خطأ في الوصول للتخزين:', storageError);
    } else {
      console.log(`✅ ملفات في مجلد articles: ${storageFiles?.length || 0}`);
      
      if (storageFiles && storageFiles.length > 0) {
        console.log('📁 أحدث الملفات:');
        storageFiles.slice(0, 5).forEach((file, index) => {
          console.log(`${index + 1}. ${file.name} (${file.metadata?.size || 'حجم غير معروف'} bytes)`);
        });
      }
    }

    // 4. اختبار الوصول للصور
    console.log('\n🌐 اختبار الوصول للصور:');
    if (allImages && allImages.length > 0) {
      const testImage = allImages[0];
      console.log(`🧪 اختبار الصورة: ${testImage.image_url}`);
      
      try {
        const response = await fetch(testImage.image_url);
        console.log(`📡 حالة الاستجابة: ${response.status} ${response.statusText}`);
        console.log(`📏 حجم المحتوى: ${response.headers.get('content-length') || 'غير معروف'} bytes`);
        console.log(`🎭 نوع المحتوى: ${response.headers.get('content-type') || 'غير معروف'}`);
      } catch (fetchError) {
        console.error(`❌ خطأ في الوصول للصورة: ${fetchError.message}`);
      }
    }

    console.log('\n✅ انتهى التشخيص');

  } catch (error) {
    console.error('💥 خطأ عام في التشخيص:', error);
  }
}

// تشغيل التشخيص
debugImages();
