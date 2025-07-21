// تشخيص شامل لمشاكل الصور
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

async function diagnoseImageIssues() {
  console.log('🔍 تشخيص مشاكل الصور الثلاث...\n');

  try {
    // المشكلة الأولى: فحص الصور السوداء
    console.log('🖤 المشكلة الأولى: فحص الصور السوداء/التالفة');
    console.log('=' .repeat(50));
    
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, slug, featured_image_url, status')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (articlesError) {
      console.error('❌ خطأ في جلب المقالات:', articlesError);
      return;
    }

    console.log(`📄 تم فحص ${articles?.length || 0} مقال منشور\n`);

    let blackImageCount = 0;
    let placeholderCount = 0;
    let validImageCount = 0;
    let noImageCount = 0;

    for (const article of articles || []) {
      console.log(`📰 "${article.title}"`);
      console.log(`   🔗 Slug: ${article.slug}`);
      
      if (!article.featured_image_url) {
        console.log(`   ❌ لا توجد صورة مميزة - سيتم استخدام placeholder`);
        noImageCount++;
      } else if (article.featured_image_url.includes('placehold.co')) {
        console.log(`   🔲 صورة placeholder: ${article.featured_image_url}`);
        placeholderCount++;
      } else if (article.featured_image_url.includes('unsplash.com')) {
        console.log(`   🌐 صورة Unsplash: ${article.featured_image_url}`);
        validImageCount++;
      } else if (article.featured_image_url.includes('supabase.co')) {
        console.log(`   💾 صورة محلية: ${article.featured_image_url}`);
        validImageCount++;
      } else {
        console.log(`   ⚠️ صورة مشكوك فيها: ${article.featured_image_url}`);
        blackImageCount++;
      }
      console.log('');
    }

    console.log('📊 ملخص الصور المميزة:');
    console.log(`   ✅ صور صحيحة: ${validImageCount}`);
    console.log(`   🔲 صور placeholder: ${placeholderCount}`);
    console.log(`   ❌ بدون صورة: ${noImageCount}`);
    console.log(`   ⚠️ صور مشكوك فيها: ${blackImageCount}\n`);

    // المشكلة الثانية: فحص الصور التلقائية
    console.log('🤖 المشكلة الثانية: فحص الصور التلقائية');
    console.log('=' .repeat(50));

    const { data: allImages, error: imagesError } = await supabase
      .from('article_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (imagesError) {
      console.error('❌ خطأ في جلب الصور:', imagesError);
    } else {
      console.log(`📸 إجمالي الصور في قاعدة البيانات: ${allImages?.length || 0}`);
      
      let unsplashImages = 0;
      let localImages = 0;
      let otherImages = 0;

      allImages?.forEach(img => {
        if (img.image_url.includes('unsplash.com')) {
          unsplashImages++;
        } else if (img.image_url.includes('supabase.co')) {
          localImages++;
        } else {
          otherImages++;
        }
      });

      console.log(`   🌐 صور Unsplash: ${unsplashImages}`);
      console.log(`   💾 صور محلية: ${localImages}`);
      console.log(`   ❓ صور أخرى: ${otherImages}`);

      // عرض أحدث 5 صور
      console.log('\n🆕 أحدث 5 صور مضافة:');
      allImages?.slice(0, 5).forEach((img, index) => {
        const source = img.image_url.includes('unsplash.com') ? 'Unsplash' : 
                      img.image_url.includes('supabase.co') ? 'محلية' : 'أخرى';
        console.log(`${index + 1}. [${source}] ${img.caption || 'بدون تسمية'}`);
        console.log(`   URL: ${img.image_url.substring(0, 80)}...`);
        console.log(`   تاريخ الإضافة: ${new Date(img.created_at).toLocaleString('ar-EG')}`);
      });
    }

    // المشكلة الثالثة: فحص نظام المراجع
    console.log('\n🎯 المشكلة الثالثة: فحص نظام المراجع');
    console.log('=' .repeat(50));

    // فحص المقالات التي تحتوي على مراجع
    let articlesWithReferences = 0;
    let articlesWithImages = 0;
    let articlesWithBothReferencesAndImages = 0;

    for (const article of articles || []) {
      const hasReferences = article.content && article.content.includes('[صورة:');
      
      const { data: articleImages } = await supabase
        .from('article_images')
        .select('id')
        .eq('article_id', article.id);

      const hasImages = articleImages && articleImages.length > 0;

      if (hasReferences) {
        articlesWithReferences++;
        console.log(`📝 "${article.title}" - يحتوي على مراجع صور`);
        
        // عد المراجع
        const references = article.content.match(/\[صورة:\d+\]/g) || [];
        console.log(`   🔗 عدد المراجع: ${references.length}`);
        console.log(`   📸 عدد الصور المتاحة: ${articleImages?.length || 0}`);
        
        if (hasImages && references.length <= articleImages.length) {
          console.log(`   ✅ المراجع متطابقة مع الصور`);
          articlesWithBothReferencesAndImages++;
        } else if (hasImages) {
          console.log(`   ⚠️ عدم تطابق: ${references.length} مراجع، ${articleImages?.length} صور`);
        } else {
          console.log(`   ❌ مراجع بدون صور`);
        }
      }

      if (hasImages) {
        articlesWithImages++;
      }
    }

    console.log('\n📊 ملخص نظام المراجع:');
    console.log(`   📝 مقالات بمراجع: ${articlesWithReferences}`);
    console.log(`   📸 مقالات بصور: ${articlesWithImages}`);
    console.log(`   ✅ مقالات بمراجع وصور متطابقة: ${articlesWithBothReferencesAndImages}`);

    // اختبار الوصول للصور
    console.log('\n🌐 اختبار الوصول للصور:');
    console.log('=' .repeat(50));

    if (allImages && allImages.length > 0) {
      const testImages = allImages.slice(0, 3);
      
      for (const img of testImages) {
        console.log(`🧪 اختبار: ${img.image_url.substring(0, 50)}...`);
        
        try {
          const response = await fetch(img.image_url, { method: 'HEAD' });
          console.log(`   📡 الحالة: ${response.status} ${response.statusText}`);
          
          if (response.status === 200) {
            console.log(`   ✅ الصورة متاحة`);
          } else {
            console.log(`   ❌ الصورة غير متاحة`);
          }
        } catch (error) {
          console.log(`   💥 خطأ في الوصول: ${error.message}`);
        }
      }
    }

    // توصيات الحلول
    console.log('\n💡 توصيات الحلول:');
    console.log('=' .repeat(50));
    
    console.log('🖤 للصور السوداء:');
    if (noImageCount > 0) {
      console.log(`   - ${noImageCount} مقال بدون صورة مميزة - يحتاج صور`);
    }
    if (placeholderCount > 0) {
      console.log(`   - ${placeholderCount} مقال يستخدم placeholder - يحتاج صور حقيقية`);
    }
    
    console.log('\n🤖 للصور التلقائية:');
    if (allImages) {
      let unsplashCount = 0;
      let localCount = 0;
      allImages.forEach(img => {
        if (img.image_url.includes('unsplash.com')) {
          unsplashCount++;
        } else if (img.image_url.includes('supabase.co')) {
          localCount++;
        }
      });

      if (unsplashCount > localCount) {
        console.log(`   - ${unsplashCount} صورة من Unsplash - قد تكون تلقائية`);
        console.log(`   - فحص كود إضافة الصور التلقائية`);
      }
    }
    
    console.log('\n🎯 لنظام المراجع:');
    if (articlesWithReferences < articlesWithImages) {
      console.log(`   - ${articlesWithImages - articlesWithReferences} مقال بصور بدون مراجع`);
      console.log(`   - تحديث المقالات لاستخدام نظام المراجع`);
    }

    console.log('\n✅ انتهى التشخيص');

  } catch (error) {
    console.error('💥 خطأ عام في التشخيص:', error);
  }
}

// تشغيل التشخيص
diagnoseImageIssues();
