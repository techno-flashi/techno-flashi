// التحقق من المشروع الصحيح zgktrwpladrkhhemhnni
const { createClient } = require('@supabase/supabase-js');

// المشروع الصحيح
const CORRECT_SUPABASE_URL = 'https://zgktrwpladrkhhemhnni.supabase.co';
const CORRECT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3Ryd3BsYWRya2hoZW1obm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjk0NTIsImV4cCI6MjA2NzYwNTQ1Mn0.uHKisokqk484Vq5QjCbVbcdcabxArrtKUMxjdCihe04';

const supabase = createClient(CORRECT_SUPABASE_URL, CORRECT_SUPABASE_KEY);

async function verifyCorrectProject() {
  try {
    console.log('🔍 التحقق من المشروع الصحيح...');
    console.log(`📍 URL: ${CORRECT_SUPABASE_URL}`);
    console.log(`🆔 Project ID: zgktrwpladrkhhemhnni`);
    console.log('='.repeat(70));

    // 1. اختبار الاتصال
    console.log('1️⃣ اختبار الاتصال...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError && !sessionError.message.includes('session')) {
      console.error('❌ خطأ في الاتصال:', sessionError.message);
      return false;
    }
    console.log('✅ الاتصال ناجح');

    // 2. التحقق من جدول ai_tools
    console.log('\n2️⃣ التحقق من جدول ai_tools...');
    const { count: toolsCount, error: countError } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ خطأ في الوصول للجدول:', countError.message);
      return false;
    }
    console.log(`✅ جدول ai_tools موجود - عدد الأدوات: ${toolsCount}`);

    // 3. عينة من البيانات
    console.log('\n3️⃣ عينة من البيانات الموجودة...');
    const { data: sampleData, error: sampleError } = await supabase
      .from('ai_tools')
      .select('name, logo_url, category')
      .limit(5)
      .order('name');

    if (sampleError) {
      console.error('❌ خطأ في جلب العينة:', sampleError.message);
      return false;
    }

    console.log('📋 عينة من الأدوات:');
    sampleData.forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.name} (${tool.category})`);
      console.log(`      الأيقونة: ${tool.logo_url ? tool.logo_url.substring(0, 50) + '...' : 'لا يوجد'}`);
    });

    // 4. فحص الأيقونات الحالية
    console.log('\n4️⃣ فحص الأيقونات الحالية...');
    
    // عد الأيقونات من مصادر مختلفة
    const { count: jsDelivrCount } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
      .ilike('logo_url', '%cdn.jsdelivr.net%');

    const { count: svgCount } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
      .ilike('logo_url', '%.svg');

    const { count: emptyCount } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
      .or('logo_url.is.null,logo_url.eq.');

    console.log(`📊 إحصائيات الأيقونات الحالية:`);
    console.log(`   🚀 أيقونات jsDelivr: ${jsDelivrCount}/${toolsCount} (${Math.round(jsDelivrCount/toolsCount*100)}%)`);
    console.log(`   🎨 أيقونات SVG: ${svgCount}/${toolsCount} (${Math.round(svgCount/toolsCount*100)}%)`);
    console.log(`   ❌ أيقونات فارغة: ${emptyCount}/${toolsCount} (${Math.round(emptyCount/toolsCount*100)}%)`);

    // 5. التحقق من جداول أخرى
    console.log('\n5️⃣ التحقق من الجداول الأخرى...');
    
    const tables = ['articles', 'services', 'site_pages'];
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`   ❌ ${table}: غير موجود`);
        } else {
          console.log(`   ✅ ${table}: ${count} سجل`);
        }
      } catch (e) {
        console.log(`   ❌ ${table}: خطأ`);
      }
    }

    // 6. النتيجة النهائية
    console.log('\n🎉 النتيجة النهائية:');
    console.log('='.repeat(50));
    console.log(`✅ المشروع الصحيح متصل: zgktrwpladrkhhemhnni`);
    console.log(`✅ جدول ai_tools يعمل: ${toolsCount} أداة`);
    console.log(`📊 الأيقونات تحتاج تحديث: ${toolsCount - jsDelivrCount} أداة`);
    
    if (jsDelivrCount < toolsCount) {
      console.log(`🔄 جاهز لتحديث الأيقونات!`);
    } else {
      console.log(`🎨 جميع الأيقونات محدثة بالفعل!`);
    }

    return {
      success: true,
      totalTools: toolsCount,
      jsDelivrIcons: jsDelivrCount,
      needsUpdate: toolsCount - jsDelivrCount
    };

  } catch (error) {
    console.error('💥 خطأ عام:', error.message);
    return { success: false };
  }
}

// تشغيل التحقق
verifyCorrectProject().then(result => {
  if (result.success) {
    console.log('\n🚀 المشروع جاهز للعمل!');
    process.exit(0);
  } else {
    console.log('\n❌ مشكلة في المشروع!');
    process.exit(1);
  }
});
