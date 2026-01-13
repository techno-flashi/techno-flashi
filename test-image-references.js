// اختبار نظام مراجع الصور
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

async function testImageReferences() {
  console.log('🧪 اختبار نظام مراجع الصور...\n');

  try {
    // اختيار مقال للاختبار (المقال الذي يحتوي على صور)
    const testArticleId = '6ea8d762-7da6-4965-81a4-26a923eee7bc'; // Midjourney vs Stable Diffusion
    
    console.log(`📄 اختبار المقال: ${testArticleId}`);
    
    // جلب بيانات المقال
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', testArticleId)
      .single();

    if (articleError) {
      console.error('❌ خطأ في جلب المقال:', articleError);
      return;
    }

    console.log(`✅ المقال: "${article.title}"`);
    console.log(`📝 المحتوى الحالي: ${article.content?.substring(0, 200)}...`);

    // جلب صور المقال
    const { data: images, error: imagesError } = await supabase
      .from('article_images')
      .select('*')
      .eq('article_id', testArticleId)
      .order('display_order', { ascending: true });

    if (imagesError) {
      console.error('❌ خطأ في جلب الصور:', imagesError);
      return;
    }

    console.log(`📸 عدد الصور المتاحة: ${images?.length || 0}`);
    
    if (!images || images.length === 0) {
      console.log('⚠️ لا توجد صور للاختبار. سأضيف صور تجريبية...');
      
      // إضافة صور تجريبية
      const testImages = [
        {
          article_id: testArticleId,
          image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center',
          alt_text: 'مقارنة أدوات الذكاء الاصطناعي',
          caption: 'مقارنة شاملة بين Midjourney و Stable Diffusion',
          display_order: 0
        },
        {
          article_id: testArticleId,
          image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=center',
          alt_text: 'أدوات الإبداع الرقمي',
          caption: 'أدوات الإبداع الرقمي الحديثة',
          display_order: 1
        },
        {
          article_id: testArticleId,
          image_url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop&crop=center',
          alt_text: 'تقنيات الذكاء الاصطناعي',
          caption: 'تطور تقنيات الذكاء الاصطناعي في الفن',
          display_order: 2
        }
      ];

      const { data: insertedImages, error: insertError } = await supabase
        .from('article_images')
        .insert(testImages)
        .select();

      if (insertError) {
        console.error('❌ خطأ في إضافة الصور التجريبية:', insertError);
        return;
      }

      console.log(`✅ تم إضافة ${insertedImages?.length || 0} صورة تجريبية`);
      images = insertedImages;
    }

    // إنشاء محتوى تجريبي مع مراجع الصور
    const testContent = `# مقارنة شاملة: Midjourney ضد Stable Diffusion في 2025

في عالم الذكاء الاصطناعي المتطور، تبرز أدوات إنشاء الصور كواحدة من أكثر التقنيات إثارة للاهتمام.

[صورة:1]

## ما هو Midjourney؟

Midjourney هو أحد أقوى أدوات الذكاء الاصطناعي لإنشاء الصور من النصوص. يتميز بقدرته على إنتاج صور فنية عالية الجودة.

### المميزات الرئيسية:
- جودة فنية استثنائية
- سهولة الاستخدام
- مجتمع نشط ومتفاعل

[صورة:2]

## ما هو Stable Diffusion؟

Stable Diffusion هو نموذج مفتوح المصدر لإنشاء الصور، يوفر مرونة أكبر للمطورين والمستخدمين المتقدمين.

### المميزات الرئيسية:
- مفتوح المصدر
- قابل للتخصيص
- يعمل محلياً

[صورة:3]

## الخلاصة

كلا الأداتين لهما مميزات فريدة، والاختيار يعتمد على احتياجاتك المحددة ومستوى خبرتك التقنية.`;

    console.log('\n📝 تحديث محتوى المقال بمراجع الصور...');
    
    const { error: updateError } = await supabase
      .from('articles')
      .update({ content: testContent })
      .eq('id', testArticleId);

    if (updateError) {
      console.error('❌ خطأ في تحديث المحتوى:', updateError);
      return;
    }

    console.log('✅ تم تحديث محتوى المقال بنجاح');
    
    // عرض النتيجة
    console.log('\n📊 نتيجة الاختبار:');
    console.log('🔗 رابط المقال للاختبار:');
    console.log(`   http://localhost:3000/articles/${article.slug}`);
    console.log('\n🔗 رابط المحرر للاختبار:');
    console.log(`   http://localhost:3000/admin/articles/edit/${testArticleId}`);
    
    console.log('\n📋 المراجع المستخدمة في المحتوى:');
    const references = testContent.match(/\[صورة:\d+\]/g) || [];
    references.forEach((ref, index) => {
      const imageNum = parseInt(ref.match(/\d+/)[0]) - 1;
      const image = images[imageNum];
      console.log(`   ${ref} -> ${image ? image.caption : 'صورة غير موجودة'}`);
    });

    console.log('\n✅ انتهى الاختبار بنجاح!');
    console.log('\n🎯 للاختبار:');
    console.log('1. افتح رابط المقال لرؤية النتيجة النهائية');
    console.log('2. افتح رابط المحرر لاختبار السحب والإفلات');
    console.log('3. جرب سحب الصور من القائمة اليسرى وإفلاتها في المحرر');

  } catch (error) {
    console.error('💥 خطأ عام في الاختبار:', error);
  }
}

// تشغيل الاختبار
testImageReferences();
