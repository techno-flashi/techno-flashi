// اختبار الاتصال بعد إصلاح السياسات
const { createClient } = require('@supabase/supabase-js');

// استخدام نفس الإعدادات من .env.local
const SUPABASE_URL = 'https://xfxpwbqgtuhbkeksdbqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnB3YnFndHVoYmtla3NkYnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MjY1MDgsImV4cCI6MjA2ODEwMjUwOH0.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testFixedConnection() {
  try {
    console.log('🔧 اختبار الاتصال بعد إصلاح السياسات...');
    console.log(`📍 URL: ${SUPABASE_URL}`);
    console.log('='.repeat(70));

    // اختبار جدول أدوات الذكاء الاصطناعي
    console.log('\n1️⃣ اختبار جدول ai_tools:');
    const { data: aiTools, error: aiError, count: aiCount } = await supabase
      .from('ai_tools')
      .select('name, logo_url', { count: 'exact' })
      .limit(5);

    if (aiError) {
      console.log(`❌ خطأ في ai_tools: ${aiError.message}`);
    } else {
      console.log(`✅ ai_tools: ${aiCount} أداة موجودة`);
      console.log('📋 عينة من الأدوات:');
      aiTools?.forEach(tool => {
        const hasLogo = tool.logo_url && tool.logo_url.includes('cdn.jsdelivr.net');
        console.log(`   - ${tool.name}: ${hasLogo ? '✅ أيقونة SVG' : '❌ بدون أيقونة'}`);
      });
    }

    // اختبار جدول المقالات
    console.log('\n2️⃣ اختبار جدول articles:');
    const { data: articles, error: articlesError, count: articlesCount } = await supabase
      .from('articles')
      .select('title', { count: 'exact' })
      .limit(3);

    if (articlesError) {
      console.log(`❌ خطأ في articles: ${articlesError.message}`);
    } else {
      console.log(`✅ articles: ${articlesCount} مقال موجود`);
      console.log('📋 عينة من المقالات:');
      articles?.forEach(article => {
        console.log(`   - ${article.title}`);
      });
    }

    // اختبار جدول الصفحات
    console.log('\n3️⃣ اختبار جدول site_pages:');
    const { data: pages, error: pagesError, count: pagesCount } = await supabase
      .from('site_pages')
      .select('title', { count: 'exact' })
      .limit(3);

    if (pagesError) {
      console.log(`❌ خطأ في site_pages: ${pagesError.message}`);
    } else {
      console.log(`✅ site_pages: ${pagesCount} صفحة موجودة`);
      console.log('📋 عينة من الصفحات:');
      pages?.forEach(page => {
        console.log(`   - ${page.title}`);
      });
    }

    // اختبار جدول الإعلانات
    console.log('\n4️⃣ اختبار جدول advertisements:');
    const { data: ads, error: adsError, count: adsCount } = await supabase
      .from('advertisements')
      .select('*', { count: 'exact' })
      .limit(3);

    if (adsError) {
      console.log(`❌ خطأ في advertisements: ${adsError.message}`);
    } else {
      console.log(`✅ advertisements: ${adsCount} إعلان موجود`);
    }

    console.log('\n🎉 النتيجة النهائية:');
    console.log('='.repeat(50));
    
    if (!aiError && !articlesError && !pagesError) {
      console.log('✅ جميع الجداول تعمل بشكل صحيح!');
      console.log('🚀 الموقع جاهز للعمل محلياً');
      return true;
    } else {
      console.log('⚠️ بعض الجداول تحتاج إصلاح إضافي');
      return false;
    }

  } catch (error) {
    console.error('💥 خطأ عام:', error.message);
    return false;
  }
}

testFixedConnection().then(success => {
  if (success) {
    console.log('\n🎊 الاتصال يعمل بشكل مثالي!');
  } else {
    console.log('\n❌ تحتاج إصلاحات إضافية');
  }
});
