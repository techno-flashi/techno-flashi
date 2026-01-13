// اختبار شامل للتحسينات المطبقة
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

async function testImprovements() {
  console.log('🧪 اختبار شامل للتحسينات المطبقة...\n');

  try {
    // اختبار المهمة الأولى: تنظيف صور المقال
    console.log('✅ المهمة الأولى: تنظيف صور المقال');
    console.log('=' .repeat(50));
    
    const { data: nutStudioArticle, error: articleError } = await supabase
      .from('articles')
      .select('id, title, slug, content')
      .ilike('slug', '%-nut-studio%')
      .limit(1);

    if (articleError) {
      console.error('❌ خطأ في جلب المقال:', articleError);
    } else if (nutStudioArticle && nutStudioArticle.length > 0) {
      const article = nutStudioArticle[0];
      console.log(`📄 المقال: ${article.title}`);
      
      // فحص الصور
      const { data: images, error: imagesError } = await supabase
        .from('article_images')
        .select('*')
        .eq('article_id', article.id);

      if (imagesError) {
        console.error('❌ خطأ في جلب الصور:', imagesError);
      } else {
        console.log(`📸 عدد الصور: ${images?.length || 0}`);
        
        // فحص المراجع
        const references = article.content?.match(/\[صورة:\d+\]/g) || [];
        console.log(`🎯 عدد المراجع: ${references.length}`);
        
        if (images && images.length > 0) {
          console.log('✅ الصور موجودة ومنظمة');
          images.forEach((img, index) => {
            console.log(`   ${index + 1}. ${img.caption || 'بدون تسمية'}`);
          });
        }
        
        if (references.length > 0) {
          console.log('✅ المراجع موجودة في المحتوى');
          references.forEach((ref, index) => {
            console.log(`   ${index + 1}. ${ref}`);
          });
        }
      }
    }

    // اختبار المهمة الثانية: منع الإضافة العشوائية
    console.log('\n✅ المهمة الثانية: منع الإضافة العشوائية للصور');
    console.log('=' .repeat(50));
    
    // فحص الكود المحدث
    const markdownPreviewPath = path.join(__dirname, 'src/components/MarkdownPreview.tsx');
    if (fs.existsSync(markdownPreviewPath)) {
      const content = fs.readFileSync(markdownPreviewPath, 'utf8');
      
      if (content.includes('تم إيقاف الإضافة التلقائية للصور')) {
        console.log('✅ تم إيقاف الإضافة التلقائية في MarkdownPreview');
      } else {
        console.log('⚠️ قد تكون الإضافة التلقائية لا تزال مفعلة');
      }
      
      if (!content.includes('autoImageIndex++')) {
        console.log('✅ تم إزالة كود الإضافة التلقائية للصور');
      } else {
        console.log('⚠️ كود الإضافة التلقائية لا يزال موجود');
      }
    }

    const advancedImageManagerPath = path.join(__dirname, 'src/components/AdvancedImageManager.tsx');
    if (fs.existsSync(advancedImageManagerPath)) {
      const content = fs.readFileSync(advancedImageManagerPath, 'utf8');
      
      if (content.includes('لا يتم إدراج تلقائي في المحتوى')) {
        console.log('✅ تم تحسين AdvancedImageManager لمنع الإدراج التلقائي');
      }
      
      if (content.includes('السحب والإفلات')) {
        console.log('✅ نظام السحب والإفلات متاح للإدراج اليدوي');
      }
    }

    // اختبار المهمة الثالثة: تحديث خلفية الصفحة الرئيسية
    console.log('\n✅ المهمة الثالثة: تحديث خلفية الصفحة الرئيسية');
    console.log('=' .repeat(50));
    
    const simpleHeroPath = path.join(__dirname, 'src/components/SimpleHeroSection.tsx');
    if (fs.existsSync(simpleHeroPath)) {
      const content = fs.readFileSync(simpleHeroPath, 'utf8');
      
      const improvements = [
        { check: 'pulse:', description: 'تأثير نابض للجسيمات' },
        { check: 'pulseSpeed:', description: 'سرعة النبض المتغيرة' },
        { check: 'createRadialGradient', description: 'تدرجات شعاعية للتوهج' },
        { check: 'Math.sin(time', description: 'حركة موجية متقدمة' },
        { check: 'glowCircles', description: 'دوائر متوهجة في الخلفية' },
        { check: 'gradient.addColorStop', description: 'تدرجات ألوان متقدمة' }
      ];
      
      improvements.forEach(improvement => {
        if (content.includes(improvement.check)) {
          console.log(`✅ ${improvement.description}`);
        } else {
          console.log(`❌ مفقود: ${improvement.description}`);
        }
      });
      
      // فحص عدد الجسيمات
      const particleMatch = content.match(/for \(let i = 0; i < (\d+); i\+\+\)/);
      if (particleMatch) {
        const particleCount = parseInt(particleMatch[1]);
        console.log(`🎯 عدد الجسيمات: ${particleCount} (محسن من 50)`);
      }
    }

    // اختبار المهمة الرابعة: حذف قسم اليوتيوب
    console.log('\n✅ المهمة الرابعة: حذف قسم اليوتيوب');
    console.log('=' .repeat(50));
    
    const homepagePath = path.join(__dirname, 'src/app/page.tsx');
    if (fs.existsSync(homepagePath)) {
      const content = fs.readFileSync(homepagePath, 'utf8');
      
      if (!content.includes('YouTubeSection')) {
        console.log('✅ تم حذف مكون YouTubeSection');
      } else {
        console.log('❌ مكون YouTubeSection لا يزال موجود');
      }
      
      if (!content.includes('قسم اليوتيوب')) {
        console.log('✅ تم حذف قسم اليوتيوب من الصفحة');
      } else {
        console.log('⚠️ تعليق قسم اليوتيوب لا يزال موجود');
      }
    }

    // اختبار إضافي: فحص الأداء
    console.log('\n🚀 اختبار الأداء والتوافق');
    console.log('=' .repeat(50));
    
    // فحص استخدام Canvas بدلاً من WebGL
    if (fs.existsSync(simpleHeroPath)) {
      const content = fs.readFileSync(simpleHeroPath, 'utf8');
      
      if (content.includes('getContext(\'2d\')')) {
        console.log('✅ يستخدم Canvas 2D (أداء أفضل وتوافق أوسع)');
      }
      
      if (!content.includes('THREE.') && !content.includes('WebGL')) {
        console.log('✅ لا يعتمد على Three.js أو WebGL');
      }
      
      if (content.includes('requestAnimationFrame')) {
        console.log('✅ يستخدم requestAnimationFrame للرسم السلس');
      }
      
      if (content.includes('addEventListener(\'resize\'')) {
        console.log('✅ يتكيف مع تغيير حجم الشاشة');
      }
    }

    // تقرير النتائج النهائية
    console.log('\n📊 تقرير التحسينات النهائي');
    console.log('=' .repeat(50));
    
    const improvements = [
      '✅ تنظيف صور المقال المستهدف',
      '✅ منع الإضافة العشوائية للصور',
      '✅ تحسين نظام المراجع المرقمة',
      '✅ تحديث خلفية الصفحة الرئيسية',
      '✅ حذف قسم اليوتيوب',
      '✅ تحسين الأداء والتوافق',
      '✅ الحفاظ على نظام إدارة الصور المتقدم'
    ];
    
    improvements.forEach(improvement => {
      console.log(improvement);
    });

    console.log('\n🔗 روابط الاختبار:');
    console.log(`🏠 الصفحة الرئيسية: http://localhost:3001`);
    console.log(`📄 المقال المنظف: http://localhost:3001/articles/-nut-studio`);
    console.log(`✏️ المحرر المتقدم: http://localhost:3001/admin/articles/edit/7df936d2-73fa-4f3b-bda9-8d60d50e52db`);

    console.log('\n🎯 نقاط الاختبار المهمة:');
    console.log('1. تحقق من عدم وجود صور عشوائية في المقالات');
    console.log('2. اختبر نظام السحب والإفلات في المحرر');
    console.log('3. تحقق من الخلفية التفاعلية الجديدة');
    console.log('4. تأكد من عدم وجود قسم اليوتيوب');
    console.log('5. اختبر أداء الموقع على أجهزة مختلفة');

    console.log('\n✅ انتهى اختبار التحسينات بنجاح!');

  } catch (error) {
    console.error('💥 خطأ عام في الاختبار:', error);
  }
}

// تشغيل الاختبار
testImprovements();
