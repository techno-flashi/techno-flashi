// اختبار الاتصال بالمفاتيح الصحيحة
const { createClient } = require('@supabase/supabase-js');

// المفاتيح الصحيحة الجديدة
const SUPABASE_URL = 'https://xfxpwbqgtuhbkeksdbqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmeHB3YnFndHVoYmtla3NkYnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODAxNTgsImV4cCI6MjA2ODE1NjE1OH0.YQQcmfSpyEqJRO_83kzMeSrOsxt-SIJptVq0FZFPt-I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testCorrectKeys() {
  try {
    console.log('🔑 اختبار الاتصال بالمفاتيح الصحيحة...');
    console.log(`📍 URL: ${SUPABASE_URL}`);
    console.log('='.repeat(70));

    // اختبار أدوات الذكاء الاصطناعي
    console.log('\n1️⃣ اختبار أدوات الذكاء الاصطناعي:');
    const { data: aiTools, error: aiError, count: aiCount } = await supabase
      .from('ai_tools')
      .select('name, logo_url', { count: 'exact' })
      .limit(5);

    if (aiError) {
      console.log(`❌ خطأ: ${aiError.message}`);
    } else {
      console.log(`✅ نجح! ${aiCount} أداة موجودة`);
      console.log('📋 عينة من الأدوات:');
      aiTools?.forEach(tool => {
        const hasJsDelivr = tool.logo_url && tool.logo_url.includes('cdn.jsdelivr.net');
        console.log(`   - ${tool.name}: ${hasJsDelivr ? '✅ jsDelivr SVG' : '⚠️ ' + tool.logo_url?.substring(0, 30) + '...'}`);
      });
    }

    // اختبار المقالات
    console.log('\n2️⃣ اختبار المقالات:');
    const { data: articles, error: articlesError, count: articlesCount } = await supabase
      .from('articles')
      .select('title', { count: 'exact' })
      .limit(3);

    if (articlesError) {
      console.log(`❌ خطأ: ${articlesError.message}`);
    } else {
      console.log(`✅ نجح! ${articlesCount} مقال موجود`);
      articles?.forEach(article => {
        console.log(`   - ${article.title}`);
      });
    }

    // اختبار الصفحات
    console.log('\n3️⃣ اختبار صفحات الموقع:');
    const { data: pages, error: pagesError, count: pagesCount } = await supabase
      .from('site_pages')
      .select('title', { count: 'exact' })
      .limit(3);

    if (pagesError) {
      console.log(`❌ خطأ: ${pagesError.message}`);
    } else {
      console.log(`✅ نجح! ${pagesCount} صفحة موجودة`);
      pages?.forEach(page => {
        console.log(`   - ${page.title}`);
      });
    }

    console.log('\n🎉 النتيجة النهائية:');
    console.log('='.repeat(50));
    
    if (!aiError && !articlesError && !pagesError) {
      console.log('✅ جميع الاتصالات تعمل بشكل مثالي!');
      console.log('🚀 قاعدة البيانات جاهزة للاستخدام');
      console.log(`📊 البيانات: ${aiCount} أداة AI، ${articlesCount} مقال، ${pagesCount} صفحة`);
      return true;
    } else {
      console.log('⚠️ بعض المشاكل ما زالت موجودة');
      return false;
    }

  } catch (error) {
    console.error('💥 خطأ عام:', error.message);
    return false;
  }
}

testCorrectKeys().then(success => {
  if (success) {
    console.log('\n🎊 قاعدة البيانات تعمل بشكل مثالي!');
    console.log('🔄 يمكنك الآن إعادة تشغيل الخادم المحلي');
  } else {
    console.log('\n❌ تحتاج مراجعة إضافية');
  }
});
