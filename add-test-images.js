// أداة لإضافة صور تجريبية لمقال معين لاختبار النظام
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

// تحميل متغيرات البيئة
loadEnvFile();

// إعدادات Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zgktrwpladrkhhemhnni.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseKey ? 'Found' : 'Not found');

if (!supabaseKey) {
  console.error('❌ Supabase key not found. Please check .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestImages() {
  try {
    console.log('🔍 Looking for articles...');
    
    // جلب أحدث مقال
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, slug')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5);

    if (articlesError) {
      console.error('❌ Error fetching articles:', articlesError);
      return;
    }

    if (!articles || articles.length === 0) {
      console.log('⚠️ No published articles found');
      return;
    }

    // البحث عن مقال بدون صور
    let article = null;
    for (const art of articles) {
      const { data: existingImages, error: existingError } = await supabase
        .from('article_images')
        .select('id')
        .eq('article_id', art.id);

      if (existingError) {
        console.error('❌ Error checking existing images:', existingError);
        continue;
      }

      if (!existingImages || existingImages.length === 0) {
        article = art;
        break;
      } else {
        console.log(`⚠️ Article "${art.title}" already has ${existingImages.length} images. Checking next...`);
      }
    }

    if (!article) {
      console.log('⚠️ All articles already have images. No article to add images to.');
      return;
    }

    console.log(`📄 Selected article: "${article.title}" (${article.slug})`);
    console.log(`🆔 Article ID: ${article.id}`);

    // إضافة صور تجريبية
    const testImages = [
      {
        article_id: article.id,
        image_url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop&crop=center',
        image_path: '/images/test-automation.jpg',
        alt_text: 'صورة تقنية - أتمتة العمليات',
        caption: 'أتمتة العمليات التقنية الحديثة',
        display_order: 1,
        width: 800,
        height: 400
      },
      {
        article_id: article.id,
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
        image_path: '/images/test-ai.jpg',
        alt_text: 'صورة تقنية - الذكاء الاصطناعي',
        caption: 'تطبيقات الذكاء الاصطناعي في العمل',
        display_order: 2,
        width: 800,
        height: 400
      },
      {
        article_id: article.id,
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&crop=center',
        image_path: '/images/test-programming.jpg',
        alt_text: 'صورة تقنية - البرمجة والتطوير',
        caption: 'أدوات البرمجة والتطوير الحديثة',
        display_order: 3,
        width: 800,
        height: 400
      }
    ];

    console.log(`📸 Adding ${testImages.length} test images...`);

    const { data: insertedImages, error: insertError } = await supabase
      .from('article_images')
      .insert(testImages)
      .select();

    if (insertError) {
      console.error('❌ Error inserting images:', insertError);
      return;
    }

    console.log(`✅ Successfully added ${insertedImages?.length || 0} images!`);
    console.log('📋 Inserted images:');
    insertedImages?.forEach((img, index) => {
      console.log(`  ${index + 1}. ${img.image_url}`);
      console.log(`     Caption: ${img.caption}`);
      console.log(`     Order: ${img.display_order}`);
    });

    console.log('\n🎉 Test images added successfully!');
    console.log(`🔗 Check the article at: /articles/${article.slug}`);

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// تشغيل الأداة
addTestImages();
