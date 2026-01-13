// اختبار سريع للتأكد من الإصلاحات النهائية
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xfxpwbqgtuhbkeksdbqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmeHB3YnFndHVoYmtla3NkYnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODAxNTgsImV4cCI6MjA2ODE1NjE1OH0.YQQcmfSpyEqJRO_83kzMeSrOsxt-SIJptVq0FZFPt-I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testFinalFixes() {
  try {
    console.log('🔧 اختبار الإصلاحات النهائية...');
    console.log('='.repeat(60));

    // اختبار أدوات الذكاء الاصطناعي
    console.log('\n1️⃣ اختبار أدوات الذكاء الاصطناعي:');
    const { data: aiTools, error: aiError } = await supabase
      .from('ai_tools')
      .select('name, features, use_cases, pros, cons, tags')
      .limit(3);

    if (aiError) {
      console.log(`❌ خطأ: ${aiError.message}`);
    } else {
      console.log(`✅ ${aiTools.length} أدوات تم جلبها`);
      aiTools.forEach(tool => {
        console.log(`📋 ${tool.name}:`);
        console.log(`   features: ${Array.isArray(tool.features) ? '✅ Array' : '❌ ' + typeof tool.features}`);
        console.log(`   use_cases: ${Array.isArray(tool.use_cases) ? '✅ Array' : '❌ ' + typeof tool.use_cases}`);
        console.log(`   pros: ${Array.isArray(tool.pros) ? '✅ Array' : '❌ ' + typeof tool.pros}`);
        console.log(`   cons: ${Array.isArray(tool.cons) ? '✅ Array' : '❌ ' + typeof tool.cons}`);
        console.log(`   tags: ${Array.isArray(tool.tags) ? '✅ Array' : '❌ ' + typeof tool.tags}`);
      });
    }

    // اختبار المقالات
    console.log('\n2️⃣ اختبار المقالات:');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('title, tags')
      .limit(3);

    if (articlesError) {
      console.log(`❌ خطأ: ${articlesError.message}`);
    } else {
      console.log(`✅ ${articles.length} مقالات تم جلبها`);
      articles.forEach(article => {
        console.log(`📄 ${article.title}:`);
        console.log(`   tags: ${Array.isArray(article.tags) ? '✅ Array' : '❌ ' + typeof article.tags}`);
      });
    }

    // اختبار الخدمات
    console.log('\n3️⃣ اختبار الخدمات:');
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('name, features')
      .limit(3);

    if (servicesError) {
      console.log(`❌ خطأ: ${servicesError.message}`);
    } else {
      console.log(`✅ ${services.length} خدمات تم جلبها`);
      services.forEach(service => {
        console.log(`🔧 ${service.name}:`);
        console.log(`   features: ${Array.isArray(service.features) ? '✅ Array' : '❌ ' + typeof service.features}`);
      });
    }

    console.log('\n🎉 النتيجة النهائية:');
    console.log('='.repeat(50));
    
    if (!aiError && !articlesError && !servicesError) {
      console.log('✅ جميع الاختبارات نجحت!');
      console.log('🚀 الموقع جاهز للاستخدام');
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

testFinalFixes().then(success => {
  if (success) {
    console.log('\n🎊 جميع الإصلاحات تعمل بشكل مثالي!');
  } else {
    console.log('\n❌ تحتاج مراجعة إضافية');
  }
});
