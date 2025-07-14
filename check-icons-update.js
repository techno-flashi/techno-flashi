// التحقق من تحديث الأيقونات في قاعدة البيانات
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://biikzzcbrzxzfeaavmlc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpaWt6emNicnp4emZlYWF2bWxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUyNjUwOCwiZXhwIjoyMDY4MTAyNTA4fQ.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkIconsUpdate() {
  try {
    console.log('🔍 التحقق من تحديث الأيقونات في قاعدة البيانات...');
    console.log('='.repeat(80));

    // جلب عينة من الأدوات المهمة
    const { data, error } = await supabase
      .from('ai_tools')
      .select('name, logo_url')
      .in('name', [
        'Figma', 'ChatGPT', 'Claude', 'Midjourney', 'GitHub Copilot', 
        'Grammarly', 'Notion AI', 'Zapier', 'Adobe Firefly', 'Stable Diffusion (Automatic1111)'
      ])
      .order('name');

    if (error) {
      console.error('❌ خطأ في جلب البيانات:', error.message);
      return false;
    }

    if (!data || data.length === 0) {
      console.log('⚠️ لا توجد بيانات');
      return false;
    }

    console.log('📊 عينة من الأدوات المحدثة:');
    console.log('');

    data.forEach(tool => {
      const isJsDelivr = tool.logo_url && tool.logo_url.includes('cdn.jsdelivr.net');
      const isSVG = tool.logo_url && tool.logo_url.endsWith('.svg');
      
      console.log(`✅ ${tool.name}:`);
      console.log(`   ${tool.logo_url}`);
      console.log(`   📍 jsDelivr: ${isJsDelivr ? '✅' : '❌'} | SVG: ${isSVG ? '✅' : '❌'}`);
      console.log('');
    });

    // إحصائيات شاملة
    console.log('📊 إحصائيات شاملة:');
    console.log('='.repeat(50));

    const { data: allTools, error: allError } = await supabase
      .from('ai_tools')
      .select('logo_url');

    if (allError) {
      console.error('❌ خطأ في جلب جميع البيانات:', allError.message);
      return false;
    }

    const totalTools = allTools.length;
    const jsDelivrCount = allTools.filter(tool => 
      tool.logo_url && tool.logo_url.includes('cdn.jsdelivr.net')
    ).length;
    const svgCount = allTools.filter(tool => 
      tool.logo_url && tool.logo_url.endsWith('.svg')
    ).length;
    const simpleIconsCount = allTools.filter(tool => 
      tool.logo_url && tool.logo_url.includes('simple-icons')
    ).length;

    console.log(`📊 إجمالي الأدوات: ${totalTools}`);
    console.log(`🚀 أيقونات jsDelivr: ${jsDelivrCount} (${Math.round(jsDelivrCount/totalTools*100)}%)`);
    console.log(`🎨 أيقونات SVG: ${svgCount} (${Math.round(svgCount/totalTools*100)}%)`);
    console.log(`⭐ أيقونات Simple Icons: ${simpleIconsCount} (${Math.round(simpleIconsCount/totalTools*100)}%)`);

    // التحقق من الروابط المكسورة
    console.log('\n🔗 التحقق من صحة الروابط:');
    console.log('='.repeat(40));

    const emptyIcons = allTools.filter(tool => !tool.logo_url || tool.logo_url.trim() === '').length;
    const invalidIcons = allTools.filter(tool => 
      tool.logo_url && !tool.logo_url.startsWith('http')
    ).length;

    console.log(`❌ أيقونات فارغة: ${emptyIcons}`);
    console.log(`⚠️ روابط غير صحيحة: ${invalidIcons}`);

    if (jsDelivrCount === totalTools && svgCount === totalTools) {
      console.log('\n🎉 ممتاز! جميع الأيقونات تم تحديثها بنجاح إلى jsDelivr SVG!');
      return true;
    } else {
      console.log('\n⚠️ بعض الأيقونات تحتاج إلى تحديث');
      return false;
    }

  } catch (error) {
    console.error('💥 خطأ عام:', error.message);
    return false;
  }
}

// تشغيل التحقق
checkIconsUpdate().then(success => {
  process.exit(success ? 0 : 1);
});
