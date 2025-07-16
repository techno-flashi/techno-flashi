// التحقق النهائي من قاعدة البيانات
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://biikzzcbrzxzfeaavmlc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpaWt6emNicnp4emZlYWF2bWxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUyNjUwOCwiZXhwIjoyMDY4MTAyNTA4fQ.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function finalCheck() {
  console.log('🔍 التحقق النهائي من قاعدة البيانات...');
  console.log(`📍 ${SUPABASE_URL}`);
  console.log('='.repeat(60));

  try {
    // 1. عد الأدوات
    const { count, error } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ خطأ:', error.message);
      return;
    }

    console.log(`📊 إجمالي الأدوات: ${count}`);

    // 2. عينة من البيانات
    const { data, error: dataError } = await supabase
      .from('ai_tools')
      .select('name, logo_url')
      .limit(5);

    if (dataError) {
      console.error('❌ خطأ في البيانات:', dataError.message);
      return;
    }

    console.log('\n📋 عينة من البيانات:');
    data.forEach(tool => {
      console.log(`✅ ${tool.name}`);
      console.log(`   ${tool.logo_url}`);
    });

    // 3. إحصائيات الأيقونات
    const { count: jsDelivrCount } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
      .ilike('logo_url', '%cdn.jsdelivr.net%');

    console.log(`\n🚀 أيقونات jsDelivr: ${jsDelivrCount}/${count}`);
    console.log(`📈 النسبة: ${Math.round(jsDelivrCount/count*100)}%`);

    if (jsDelivrCount === count) {
      console.log('\n🎉 ممتاز! جميع الأيقونات محدثة!');
    }

  } catch (error) {
    console.error('💥 خطأ:', error.message);
  }
}

finalCheck();
