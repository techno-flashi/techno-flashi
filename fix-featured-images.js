// إصلاح الصور المميزة للمقالات
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

async function fixFeaturedImages() {
  console.log('🔧 بدء إصلاح الصور المميزة...\n');

  try {
    // جلب جميع المقالات
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, slug, featured_image_url')
      .eq('status', 'published');

    if (articlesError) {
      console.error('❌ خطأ في جلب المقالات:', articlesError);
      return;
    }

    console.log(`📄 تم العثور على ${articles?.length || 0} مقال منشور\n`);

    for (const article of articles || []) {
      console.log(`🔍 فحص المقال: "${article.title}"`);
      
      // جلب أول صورة للمقال
      const { data: articleImages, error: imagesError } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', article.id)
        .order('display_order', { ascending: true })
        .limit(1);

      if (imagesError) {
        console.log(`   ❌ خطأ في جلب صور المقال: ${imagesError.message}`);
        continue;
      }

      if (!articleImages || articleImages.length === 0) {
        console.log(`   ⚠️ لا توجد صور مرفقة للمقال`);
        continue;
      }

      const firstImage = articleImages[0];
      
      // تحقق من أن الصورة محلية (من Supabase Storage)
      const isLocalImage = firstImage.image_url.includes('supabase.co/storage');
      
      if (isLocalImage) {
        // إذا كانت الصورة محلية ولكن featured_image_url فارغ أو مختلف
        if (!article.featured_image_url || article.featured_image_url !== firstImage.image_url) {
          console.log(`   🔄 تحديث الصورة المميزة...`);
          console.log(`   📸 من: ${article.featured_image_url || 'فارغ'}`);
          console.log(`   📸 إلى: ${firstImage.image_url}`);
          
          const { error: updateError } = await supabase
            .from('articles')
            .update({ featured_image_url: firstImage.image_url })
            .eq('id', article.id);

          if (updateError) {
            console.log(`   ❌ خطأ في التحديث: ${updateError.message}`);
          } else {
            console.log(`   ✅ تم تحديث الصورة المميزة بنجاح`);
          }
        } else {
          console.log(`   ✅ الصورة المميزة محدثة بالفعل`);
        }
      } else {
        console.log(`   ℹ️ الصورة خارجية (Unsplash): ${firstImage.image_url}`);
      }
      
      console.log('');
    }

    console.log('✅ انتهى إصلاح الصور المميزة');

  } catch (error) {
    console.error('💥 خطأ عام في الإصلاح:', error);
  }
}

// تشغيل الإصلاح
fixFeaturedImages();
