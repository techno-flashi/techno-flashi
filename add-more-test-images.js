// إضافة المزيد من الصور التجريبية
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

async function addMoreTestImages() {
  console.log('📸 إضافة المزيد من الصور التجريبية...\n');

  try {
    const testArticleId = '6ea8d762-7da6-4965-81a4-26a923eee7bc';
    
    // حذف الصور الموجودة أولاً لتجنب التكرار
    const { error: deleteError } = await supabase
      .from('article_images')
      .delete()
      .eq('article_id', testArticleId);

    if (deleteError) {
      console.log('⚠️ تحذير في حذف الصور القديمة:', deleteError.message);
    } else {
      console.log('🗑️ تم حذف الصور القديمة');
    }

    // إضافة صور جديدة متنوعة
    const newTestImages = [
      {
        article_id: testArticleId,
        image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center',
        image_path: '/external/unsplash/ai-comparison.jpg',
        alt_text: 'مقارنة أدوات الذكاء الاصطناعي',
        caption: 'مقارنة شاملة بين Midjourney و Stable Diffusion',
        display_order: 0
      },
      {
        article_id: testArticleId,
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=center',
        image_path: '/external/unsplash/digital-creativity.jpg',
        alt_text: 'أدوات الإبداع الرقمي',
        caption: 'أدوات الإبداع الرقمي الحديثة',
        display_order: 1
      },
      {
        article_id: testArticleId,
        image_url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop&crop=center',
        image_path: '/external/unsplash/ai-technology.jpg',
        alt_text: 'تقنيات الذكاء الاصطناعي',
        caption: 'تطور تقنيات الذكاء الاصطناعي في الفن',
        display_order: 2
      },
      {
        article_id: testArticleId,
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
        image_path: '/external/unsplash/ui-design.jpg',
        alt_text: 'واجهات المستخدم الحديثة',
        caption: 'تصميم واجهات المستخدم للأدوات الإبداعية',
        display_order: 3
      },
      {
        article_id: testArticleId,
        image_url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop&crop=center',
        image_path: '/external/unsplash/future-tech.jpg',
        alt_text: 'مستقبل التكنولوجيا',
        caption: 'مستقبل التكنولوجيا والإبداع الرقمي',
        display_order: 4
      }
    ];

    const { data: insertedImages, error: insertError } = await supabase
      .from('article_images')
      .insert(newTestImages)
      .select();

    if (insertError) {
      console.error('❌ خطأ في إضافة الصور:', insertError);
      return;
    }

    console.log(`✅ تم إضافة ${insertedImages?.length || 0} صورة جديدة`);
    
    // عرض الصور المضافة
    console.log('\n📋 الصور المضافة:');
    insertedImages?.forEach((img, index) => {
      console.log(`${index + 1}. ${img.caption}`);
      console.log(`   URL: ${img.image_url}`);
      console.log(`   Order: ${img.display_order}`);
      console.log('');
    });

    console.log('🎯 الآن يمكنك اختبار:');
    console.log('1. المقال: http://localhost:3000/articles/midjourney-vs-stable-diffusion-2025');
    console.log('2. المحرر: http://localhost:3000/admin/articles/edit/6ea8d762-7da6-4965-81a4-26a923eee7bc');
    console.log('\n✅ تم الانتهاء بنجاح!');

  } catch (error) {
    console.error('💥 خطأ عام:', error);
  }
}

// تشغيل الإضافة
addMoreTestImages();
