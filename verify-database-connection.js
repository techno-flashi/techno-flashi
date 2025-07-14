// التحقق المباشر من الاتصال وقاعدة البيانات
const { createClient } = require('@supabase/supabase-js');

// إعدادات Supabase الحالية
const SUPABASE_URL = 'https://biikzzcbrzxzfeaavmlc.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpaWt6emNicnp4emZlYWF2bWxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUyNjUwOCwiZXhwIjoyMDY4MTAyNTA4fQ.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verifyDatabaseConnection() {
  try {
    console.log('🔍 التحقق من الاتصال بقاعدة البيانات Supabase...');
    console.log(`📍 URL: ${SUPABASE_URL}`);
    console.log('='.repeat(80));

    // 1. التحقق من الاتصال الأساسي
    console.log('1️⃣ اختبار الاتصال الأساسي...');
    const { data: connectionTest, error: connectionError } = await supabase.auth.getSession();
    
    if (connectionError && !connectionError.message.includes('session')) {
      console.error('❌ فشل الاتصال:', connectionError.message);
      return false;
    }
    console.log('✅ الاتصال الأساسي ناجح');

    // 2. التحقق من وجود جدول ai_tools
    console.log('\n2️⃣ التحقق من وجود جدول ai_tools...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('ai_tools')
      .select('count')
      .limit(1);

    if (tableError) {
      console.error('❌ خطأ في الوصول للجدول:', tableError.message);
      return false;
    }
    console.log('✅ جدول ai_tools موجود ويمكن الوصول إليه');

    // 3. عد إجمالي الأدوات
    console.log('\n3️⃣ عد إجمالي أدوات الذكاء الاصطناعي...');
    const { count: totalCount, error: countError } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ خطأ في عد الأدوات:', countError.message);
      return false;
    }
    console.log(`✅ إجمالي الأدوات: ${totalCount} أداة`);

    // 4. جلب عينة من البيانات الفعلية
    console.log('\n4️⃣ جلب عينة من البيانات الفعلية...');
    const { data: sampleData, error: sampleError } = await supabase
      .from('ai_tools')
      .select('id, name, slug, logo_url, created_at')
      .limit(5)
      .order('name');

    if (sampleError) {
      console.error('❌ خطأ في جلب العينة:', sampleError.message);
      return false;
    }

    console.log('📊 عينة من البيانات:');
    sampleData.forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.name}`);
      console.log(`      ID: ${tool.id}`);
      console.log(`      Slug: ${tool.slug}`);
      console.log(`      Logo: ${tool.logo_url ? tool.logo_url.substring(0, 60) + '...' : 'لا يوجد'}`);
      console.log(`      تاريخ الإنشاء: ${tool.created_at}`);
      console.log('');
    });

    // 5. التحقق من الأيقونات المحدثة
    console.log('5️⃣ التحقق من الأيقونات المحدثة...');
    const { data: iconData, error: iconError } = await supabase
      .from('ai_tools')
      .select('name, logo_url')
      .ilike('logo_url', '%cdn.jsdelivr.net%')
      .limit(10);

    if (iconError) {
      console.error('❌ خطأ في جلب الأيقونات:', iconError.message);
      return false;
    }

    console.log(`✅ عدد الأدوات مع أيقونات jsDelivr: ${iconData.length}`);
    console.log('📋 أمثلة على الأيقونات المحدثة:');
    iconData.slice(0, 5).forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.name}: ${tool.logo_url}`);
    });

    // 6. إحصائيات الأيقونات
    console.log('\n6️⃣ إحصائيات الأيقونات...');
    
    // عد الأيقونات من jsDelivr
    const { count: jsDelivrCount, error: jsError } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
      .ilike('logo_url', '%cdn.jsdelivr.net%');

    // عد الأيقونات SVG
    const { count: svgCount, error: svgError } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
      .ilike('logo_url', '%.svg');

    // عد الأيقونات من Simple Icons
    const { count: simpleIconsCount, error: simpleError } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
      .ilike('logo_url', '%simple-icons%');

    if (jsError || svgError || simpleError) {
      console.error('❌ خطأ في إحصائيات الأيقونات');
    } else {
      console.log(`📊 أيقونات jsDelivr: ${jsDelivrCount}/${totalCount} (${Math.round(jsDelivrCount/totalCount*100)}%)`);
      console.log(`🎨 أيقونات SVG: ${svgCount}/${totalCount} (${Math.round(svgCount/totalCount*100)}%)`);
      console.log(`⭐ أيقونات Simple Icons: ${simpleIconsCount}/${totalCount} (${Math.round(simpleIconsCount/totalCount*100)}%)`);
    }

    // 7. التحقق من آخر تحديث
    console.log('\n7️⃣ التحقق من آخر تحديث...');
    const { data: lastUpdated, error: updateError } = await supabase
      .from('ai_tools')
      .select('name, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5);

    if (updateError) {
      console.error('❌ خطأ في جلب آخر تحديث:', updateError.message);
    } else {
      console.log('📅 آخر الأدوات المحدثة:');
      lastUpdated.forEach((tool, index) => {
        console.log(`   ${index + 1}. ${tool.name} - ${new Date(tool.updated_at).toLocaleString('ar-EG')}`);
      });
    }

    console.log('\n🎉 جميع الفحوصات نجحت! قاعدة البيانات تعمل بشكل مثالي');
    console.log('='.repeat(80));
    
    return {
      success: true,
      totalTools: totalCount,
      jsDelivrIcons: jsDelivrCount,
      svgIcons: svgCount,
      simpleIcons: simpleIconsCount
    };

  } catch (error) {
    console.error('💥 خطأ عام في التحقق:', error.message);
    return false;
  }
}

// تشغيل التحقق
verifyDatabaseConnection().then(result => {
  if (result && result.success) {
    console.log('\n✅ التحقق مكتمل بنجاح!');
    console.log(`📊 الملخص: ${result.totalTools} أداة، ${result.jsDelivrIcons} أيقونة jsDelivr`);
    process.exit(0);
  } else {
    console.log('\n❌ فشل التحقق من قاعدة البيانات');
    process.exit(1);
  }
});
