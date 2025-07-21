// تنظيف صور المقال المستهدف
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

async function cleanArticleImages() {
  console.log('🧹 بدء تنظيف صور المقال المستهدف...\n');

  try {
    // 1. البحث عن المقال بالـ slug
    console.log('🔍 البحث عن المقال...');
    const { data: articles, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .ilike('slug', '%-nut-studio%')
      .limit(1);

    if (articleError) {
      console.error('❌ خطأ في البحث عن المقال:', articleError);
      return;
    }

    if (!articles || articles.length === 0) {
      console.log('❌ لم يتم العثور على المقال');
      return;
    }

    const article = articles[0];
    console.log(`✅ تم العثور على المقال: "${article.title}"`);
    console.log(`📄 ID: ${article.id}`);
    console.log(`🔗 Slug: ${article.slug}`);

    // 2. فحص الصور المرتبطة بالمقال
    console.log('\n📸 فحص الصور المرتبطة بالمقال...');
    const { data: articleImages, error: imagesError } = await supabase
      .from('article_images')
      .select('*')
      .eq('article_id', article.id)
      .order('display_order', { ascending: true });

    if (imagesError) {
      console.error('❌ خطأ في جلب الصور:', imagesError);
      return;
    }

    console.log(`📊 عدد الصور المرتبطة: ${articleImages?.length || 0}`);

    if (articleImages && articleImages.length > 0) {
      console.log('\n🖼️ تفاصيل الصور:');
      articleImages.forEach((img, index) => {
        console.log(`${index + 1}. ${img.caption || 'بدون تسمية'}`);
        console.log(`   🔗 URL: ${img.image_url}`);
        console.log(`   📅 تاريخ الإضافة: ${new Date(img.created_at).toLocaleString('ar-EG')}`);
        console.log(`   🎯 ترتيب العرض: ${img.display_order}`);
        
        // فحص إذا كانت صورة تجريبية
        const isTestImage = img.caption && (
          img.caption.includes('تجريبية') || 
          img.caption.includes('اختبار') ||
          img.caption.includes('test') ||
          img.alt_text?.includes('test')
        );
        
        if (isTestImage) {
          console.log(`   ⚠️ صورة تجريبية - سيتم حذفها`);
        }
        console.log('');
      });
    }

    // 3. فحص المراجع في محتوى المقال
    console.log('🔍 فحص المراجع في محتوى المقال...');
    const content = article.content || '';
    const imageReferences = content.match(/\[صورة:\d+\]/g) || [];
    
    console.log(`📝 عدد المراجع الموجودة: ${imageReferences.length}`);
    if (imageReferences.length > 0) {
      console.log('🎯 المراجع الموجودة:');
      imageReferences.forEach((ref, index) => {
        console.log(`   ${index + 1}. ${ref}`);
      });
    }

    // 4. فحص الصور في المحتوى (روابط مباشرة)
    console.log('\n🌐 فحص الروابط المباشرة للصور في المحتوى...');
    const imageUrls = content.match(/https?:\/\/[^\s\)]+\.(jpg|jpeg|png|gif|webp)/gi) || [];
    
    console.log(`🔗 عدد روابط الصور المباشرة: ${imageUrls.length}`);
    if (imageUrls.length > 0) {
      console.log('📷 الروابط المباشرة:');
      imageUrls.forEach((url, index) => {
        console.log(`   ${index + 1}. ${url.substring(0, 80)}...`);
      });
    }

    // 5. تحديد الصور التجريبية للحذف
    const testImages = articleImages?.filter(img => 
      img.caption && (
        img.caption.includes('تجريبية') || 
        img.caption.includes('اختبار') ||
        img.caption.includes('test') ||
        img.alt_text?.includes('test')
      )
    ) || [];

    console.log(`\n🗑️ الصور التجريبية المحددة للحذف: ${testImages.length}`);

    // 6. حذف الصور التجريبية
    if (testImages.length > 0) {
      console.log('\n🗑️ حذف الصور التجريبية...');
      
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

    // 7. إعادة ترقيم الصور المتبقية
    const remainingImages = articleImages?.filter(img => 
      !testImages.some(testImg => testImg.id === img.id)
    ) || [];

    if (remainingImages.length > 0) {
      console.log('\n🔢 إعادة ترقيم الصور المتبقية...');
      
      for (let i = 0; i < remainingImages.length; i++) {
        const img = remainingImages[i];
        const newOrder = i;
        
        if (img.display_order !== newOrder) {
          const { error: updateError } = await supabase
            .from('article_images')
            .update({ display_order: newOrder })
            .eq('id', img.id);

          if (updateError) {
            console.log(`❌ فشل تحديث ترتيب الصورة: ${img.caption}`);
          } else {
            console.log(`✅ تم تحديث ترتيب: ${img.caption} -> ${newOrder}`);
          }
        }
      }
    }

    // 8. تحديث محتوى المقال لاستخدام المراجع
    console.log('\n📝 تحديث محتوى المقال...');
    
    let updatedContent = content;
    
    // إزالة الروابط المباشرة للصور واستبدالها بمراجع
    if (imageUrls.length > 0 && remainingImages.length > 0) {
      console.log('🔄 استبدال الروابط المباشرة بمراجع...');
      
      imageUrls.forEach((url, index) => {
        if (index < remainingImages.length) {
          const reference = `[صورة:${index + 1}]`;
          updatedContent = updatedContent.replace(url, reference);
          console.log(`✅ استبدال: ${url.substring(0, 50)}... -> ${reference}`);
        }
      });
    }

    // تحديث المقال في قاعدة البيانات
    if (updatedContent !== content) {
      const { error: updateError } = await supabase
        .from('articles')
        .update({ content: updatedContent })
        .eq('id', article.id);

      if (updateError) {
        console.error('❌ فشل تحديث محتوى المقال:', updateError);
      } else {
        console.log('✅ تم تحديث محتوى المقال بنجاح');
      }
    }

    // 9. تقرير النتائج النهائية
    console.log('\n📊 تقرير التنظيف النهائي:');
    console.log('=' .repeat(50));
    console.log(`📄 المقال: ${article.title}`);
    console.log(`🗑️ تم حذف: ${testImages.length} صورة تجريبية`);
    console.log(`📸 الصور المتبقية: ${remainingImages.length}`);
    console.log(`🔗 الروابط المباشرة المستبدلة: ${imageUrls.length}`);
    console.log(`📝 المراجع الموجودة: ${imageReferences.length}`);

    if (remainingImages.length > 0) {
      console.log('\n✅ الصور المتبقية:');
      remainingImages.forEach((img, index) => {
        console.log(`   [صورة:${index + 1}] ${img.caption || 'بدون تسمية'}`);
      });
    }

    console.log('\n🔗 للاختبار:');
    console.log(`📄 المقال: http://localhost:3001/articles/${article.slug}`);
    console.log(`✏️ المحرر: http://localhost:3001/admin/articles/edit/${article.id}`);

    console.log('\n✅ انتهى تنظيف المقال بنجاح!');

  } catch (error) {
    console.error('💥 خطأ عام في التنظيف:', error);
  }
}

// تشغيل التنظيف
cleanArticleImages();
