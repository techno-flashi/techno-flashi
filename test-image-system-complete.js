// اختبار شامل لنظام الصور المحسن
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

async function testCompleteImageSystem() {
  console.log('🧪 اختبار شامل لنظام الصور المحسن...\n');

  try {
    const testArticleId = '6ea8d762-7da6-4965-81a4-26a923eee7bc';
    
    // 1. تنظيف البيانات القديمة
    console.log('🧹 تنظيف البيانات القديمة...');
    
    // حذف الصور التجريبية القديمة
    const { error: deleteError } = await supabase
      .from('article_images')
      .delete()
      .eq('article_id', testArticleId);

    if (deleteError) {
      console.log('⚠️ تحذير في حذف الصور القديمة:', deleteError.message);
    } else {
      console.log('✅ تم حذف الصور القديمة');
    }

    // 2. إضافة صور اختبار محسنة
    console.log('\n📸 إضافة صور اختبار محسنة...');
    
    const testImages = [
      {
        article_id: testArticleId,
        image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center',
        image_path: '/test/ai-comparison.jpg',
        alt_text: 'مقارنة أدوات الذكاء الاصطناعي',
        caption: 'مقارنة شاملة بين أدوات إنشاء الصور بالذكاء الاصطناعي',
        display_order: 0,
        width: 800,
        height: 400
      },
      {
        article_id: testArticleId,
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=center',
        image_path: '/test/digital-creativity.jpg',
        alt_text: 'الإبداع الرقمي',
        caption: 'أدوات الإبداع الرقمي والتصميم الحديث',
        display_order: 1,
        width: 800,
        height: 400
      },
      {
        article_id: testArticleId,
        image_url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop&crop=center',
        image_path: '/test/ai-technology.jpg',
        alt_text: 'تقنيات الذكاء الاصطناعي',
        caption: 'تطور تقنيات الذكاء الاصطناعي في مجال الفن والتصميم',
        display_order: 2,
        width: 800,
        height: 400
      },
      {
        article_id: testArticleId,
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
        image_path: '/test/ui-design.jpg',
        alt_text: 'تصميم واجهات المستخدم',
        caption: 'تصميم واجهات المستخدم للأدوات الإبداعية الحديثة',
        display_order: 3,
        width: 800,
        height: 400
      },
      {
        article_id: testArticleId,
        image_url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop&crop=center',
        image_path: '/test/future-tech.jpg',
        alt_text: 'مستقبل التكنولوجيا',
        caption: 'نظرة على مستقبل التكنولوجيا والإبداع الرقمي',
        display_order: 4,
        width: 800,
        height: 400
      }
    ];

    const { data: insertedImages, error: insertError } = await supabase
      .from('article_images')
      .insert(testImages)
      .select();

    if (insertError) {
      console.error('❌ خطأ في إضافة الصور:', insertError);
      return;
    }

    console.log(`✅ تم إضافة ${insertedImages?.length || 0} صورة اختبار`);

    // 3. إنشاء محتوى تجريبي مع مراجع محسنة
    console.log('\n📝 إنشاء محتوى تجريبي مع مراجع محسنة...');
    
    const enhancedContent = `# مقارنة شاملة: Midjourney ضد Stable Diffusion في 2025

في عالم الذكاء الاصطناعي المتطور، تبرز أدوات إنشاء الصور كواحدة من أكثر التقنيات إثارة للاهتمام والجدل في الوقت نفسه.

[صورة:1]

## ما هو Midjourney؟

Midjourney هو أحد أقوى أدوات الذكاء الاصطناعي لإنشاء الصور من النصوص. يتميز بقدرته الاستثنائية على إنتاج صور فنية عالية الجودة تنافس أعمال الفنانين المحترفين.

### المميزات الرئيسية لـ Midjourney:

- **جودة فنية استثنائية**: ينتج صوراً بجودة احترافية عالية
- **سهولة الاستخدام**: واجهة بسيطة عبر Discord
- **مجتمع نشط**: مجتمع كبير من المبدعين والفنانين
- **تحديثات مستمرة**: تطوير مستمر وميزات جديدة

[صورة:2]

## ما هو Stable Diffusion؟

Stable Diffusion هو نموذج مفتوح المصدر لإنشاء الصور، يوفر مرونة أكبر للمطورين والمستخدمين المتقدمين الذين يريدون التحكم الكامل في عملية إنشاء الصور.

### المميزات الرئيسية لـ Stable Diffusion:

- **مفتوح المصدر**: كود مفتوح وقابل للتخصيص
- **يعمل محلياً**: لا يحتاج اتصال إنترنت مستمر
- **مرونة عالية**: إمكانيات تخصيص واسعة
- **مجاني**: لا توجد رسوم اشتراك

[صورة:3]

## المقارنة التفصيلية

### من ناحية الجودة

كلا الأداتين تنتج صوراً عالية الجودة، لكن لكل منهما نقاط قوة مختلفة:

- **Midjourney**: يتفوق في الصور الفنية والإبداعية
- **Stable Diffusion**: يوفر تحكماً أكبر في التفاصيل التقنية

[صورة:4]

### من ناحية سهولة الاستخدام

- **Midjourney**: أسهل للمبتدئين
- **Stable Diffusion**: يتطلب معرفة تقنية أكبر

### من ناحية التكلفة

- **Midjourney**: يتطلب اشتراك شهري
- **Stable Diffusion**: مجاني لكن يحتاج أجهزة قوية

[صورة:5]

## الخلاصة والتوصيات

الاختيار بين Midjourney و Stable Diffusion يعتمد على احتياجاتك المحددة:

### اختر Midjourney إذا كنت:
- مبتدئ في مجال الذكاء الاصطناعي
- تريد نتائج سريعة وعالية الجودة
- لا تمانع دفع رسوم شهرية
- تركز على الإبداع أكثر من التحكم التقني

### اختر Stable Diffusion إذا كنت:
- لديك خبرة تقنية
- تريد التحكم الكامل في العملية
- تفضل الحلول مفتوحة المصدر
- لديك أجهزة قوية للتشغيل المحلي

كلا الأداتين ممتازتان، والمستقبل مشرق لتقنيات إنشاء الصور بالذكاء الاصطناعي.`;

    // تحديث محتوى المقال
    const { error: updateError } = await supabase
      .from('articles')
      .update({ 
        content: enhancedContent,
        featured_image_url: insertedImages[0].image_url
      })
      .eq('id', testArticleId);

    if (updateError) {
      console.error('❌ خطأ في تحديث المحتوى:', updateError);
      return;
    }

    console.log('✅ تم تحديث محتوى المقال بنجاح');

    // 4. عرض النتائج
    console.log('\n📊 نتائج الاختبار:');
    console.log('=' .repeat(50));
    
    console.log('🎯 المراجع المستخدمة:');
    const references = enhancedContent.match(/\[صورة:\d+\]/g) || [];
    references.forEach((ref, index) => {
      const imageNum = parseInt(ref.match(/\d+/)[0]) - 1;
      const image = insertedImages[imageNum];
      console.log(`   ${ref} -> ${image ? image.caption : 'صورة غير موجودة'}`);
    });

    console.log('\n🔗 روابط الاختبار:');
    console.log(`📄 المقال: http://localhost:3000/articles/midjourney-vs-stable-diffusion-2025`);
    console.log(`✏️ المحرر: http://localhost:3000/admin/articles/edit/${testArticleId}`);

    console.log('\n✅ تم إعداد الاختبار بنجاح!');
    console.log('\n🧪 للاختبار:');
    console.log('1. افتح رابط المقال لرؤية النتيجة النهائية');
    console.log('2. افتح رابط المحرر واختر "محرر متقدم"');
    console.log('3. جرب سحب الصور من القائمة اليسرى');
    console.log('4. أفلت الصور في المحرر في مواضع مختلفة');
    console.log('5. اضغط "معاينة" لرؤية النتيجة');
    console.log('6. تحقق من أن المراجع تعمل بشكل صحيح');

  } catch (error) {
    console.error('💥 خطأ عام في الاختبار:', error);
  }
}

// تشغيل الاختبار
testCompleteImageSystem();
