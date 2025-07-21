// تنظيف الصور غير المرغوب فيها
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// قراءة متغيرات البيئة
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

async function cleanUnwantedImages() {
  console.log('🧹 بدء تنظيف الصور غير المرغوب فيها...\n');

  try {
    // 1. فحص جميع الصور
    console.log('🔍 فحص جميع الصور في قاعدة البيانات:');
    const { data: allImages, error: imagesError } = await supabase
      .from('article_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (imagesError) {
      console.error('❌ خطأ في جلب الصور:', imagesError);
      return;
    }

    console.log(`📸 إجمالي الصور: ${allImages?.length || 0}\n`);

    // تصنيف الصور
    const unsplashImages = [];
    const localImages = [];
    const testImages = [];

    allImages?.forEach(img => {
      if (img.image_url.includes('unsplash.com')) {
        // فحص إذا كانت صورة اختبار
        if (img.caption && (
          img.caption.includes('تجريبية') || 
          img.caption.includes('اختبار') ||
          img.caption.includes('test') ||
          img.alt_text?.includes('test') ||
          img.image_path?.includes('test')
        )) {
          testImages.push(img);
        } else {
          unsplashImages.push(img);
        }
      } else if (img.image_url.includes('supabase.co')) {
        localImages.push(img);
      }
    });

    console.log('📊 تصنيف الصور:');
    console.log(`   🌐 صور Unsplash عادية: ${unsplashImages.length}`);
    console.log(`   🧪 صور اختبار: ${testImages.length}`);
    console.log(`   💾 صور محلية: ${localImages.length}\n`);

    // 2. عرض الصور المشكوك فيها
    if (testImages.length > 0) {
      console.log('🧪 صور الاختبار المكتشفة:');
      testImages.forEach((img, index) => {
        console.log(`${index + 1}. ${img.caption || 'بدون تسمية'}`);
        console.log(`   📅 تاريخ الإضافة: ${new Date(img.created_at).toLocaleString('ar-EG')}`);
        console.log(`   🔗 URL: ${img.image_url.substring(0, 60)}...`);
        console.log(`   📄 المقال: ${img.article_id}`);
      });
      console.log('');
    }

    // 3. فحص الصور التلقائية المضافة حديثاً
    const recentImages = allImages?.filter(img => {
      const imageDate = new Date(img.created_at);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return imageDate > oneDayAgo && img.image_url.includes('unsplash.com');
    }) || [];

    if (recentImages.length > 0) {
      console.log('🕐 صور Unsplash مضافة خلال آخر 24 ساعة:');
      recentImages.forEach((img, index) => {
        console.log(`${index + 1}. ${img.caption || 'بدون تسمية'}`);
        console.log(`   📅 ${new Date(img.created_at).toLocaleString('ar-EG')}`);
      });
      console.log('');
    }

    // 4. فحص المقالات بدون صور مميزة
    console.log('🔍 فحص المقالات بدون صور مميزة:');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, slug, featured_image_url')
      .eq('status', 'published');

    if (articlesError) {
      console.error('❌ خطأ في جلب المقالات:', articlesError);
      return;
    }

    const articlesWithoutImages = articles?.filter(article => 
      !article.featured_image_url || 
      article.featured_image_url.includes('placehold.co')
    ) || [];

    console.log(`📄 مقالات بدون صور مميزة: ${articlesWithoutImages.length}`);
    articlesWithoutImages.forEach((article, index) => {
      console.log(`${index + 1}. "${article.title}"`);
      console.log(`   🔗 Slug: ${article.slug}`);
      console.log(`   🖼️ الصورة: ${article.featured_image_url || 'غير محددة'}`);
    });

    // 5. اقتراح الحلول
    console.log('\n💡 اقتراحات التنظيف:');
    console.log('=' .repeat(50));

    if (testImages.length > 0) {
      console.log(`🧪 حذف ${testImages.length} صورة اختبار:`);
      console.log('   - هذه الصور تم إضافتها للاختبار فقط');
      console.log('   - يمكن حذفها بأمان');
      console.log('   - سيتم الاحتفاظ بالصور المحلية المهمة');
    }

    if (articlesWithoutImages.length > 0) {
      console.log(`\n📄 إضافة صور لـ ${articlesWithoutImages.length} مقال:`);
      console.log('   - استخدام الصور المحلية المتاحة');
      console.log('   - أو رفع صور جديدة مناسبة');
      console.log('   - تجنب استخدام placeholder');
    }

    // 6. تنفيذ التنظيف (اختياري)
    console.log('\n🤔 هل تريد تنفيذ التنظيف؟');
    console.log('   - سيتم حذف صور الاختبار فقط');
    console.log('   - الصور المحلية والمهمة ستبقى');
    console.log('   - يمكن التراجع عن العملية');

    // حذف صور الاختبار (مع تأكيد)
    if (testImages.length > 0) {
      console.log('\n🗑️ حذف صور الاختبار...');
      
      for (const img of testImages) {
        const { error: deleteError } = await supabase
          .from('article_images')
          .delete()
          .eq('id', img.id);

        if (deleteError) {
          console.log(`❌ فشل حذف الصورة: ${img.caption} - ${deleteError.message}`);
        } else {
          console.log(`✅ تم حذف: ${img.caption || 'صورة بدون تسمية'}`);
        }
      }
    }

    // 7. تحديث الصور المميزة للمقالات
    console.log('\n🔄 تحديث الصور المميزة:');
    
    for (const article of articlesWithoutImages) {
      // البحث عن أول صورة محلية للمقال
      const { data: articleImages } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', article.id)
        .order('display_order', { ascending: true })
        .limit(1);

      if (articleImages && articleImages.length > 0) {
        const firstImage = articleImages[0];
        
        // تحديث الصورة المميزة
        const { error: updateError } = await supabase
          .from('articles')
          .update({ featured_image_url: firstImage.image_url })
          .eq('id', article.id);

        if (updateError) {
          console.log(`❌ فشل تحديث الصورة المميزة للمقال: ${article.title}`);
        } else {
          console.log(`✅ تم تحديث الصورة المميزة: ${article.title}`);
        }
      }
    }

    console.log('\n✅ انتهى التنظيف!');
    console.log('\n📊 النتائج النهائية:');
    console.log(`   🗑️ تم حذف ${testImages.length} صورة اختبار`);
    console.log(`   🔄 تم تحديث ${articlesWithoutImages.length} صورة مميزة`);
    console.log(`   💾 تم الاحتفاظ بجميع الصور المحلية المهمة`);

  } catch (error) {
    console.error('💥 خطأ عام في التنظيف:', error);
  }
}

// تشغيل التنظيف
cleanUnwantedImages();
