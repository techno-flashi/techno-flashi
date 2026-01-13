// اختبار أيقونات SVG من قاعدة البيانات
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

const SUPABASE_URL = 'https://zgktrwpladrkhhemhnni.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3Ryd3BsYWRya2hoZW1obm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjk0NTIsImV4cCI6MjA2NzYwNTQ1Mn0.uHKisokqk484Vq5QjCbVbcdcabxArrtKUMxjdCihe04';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// دالة اختبار رابط الأيقونة
function testIconURL(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        resolve({ success: true, status: response.statusCode });
      } else {
        resolve({ success: false, status: response.statusCode });
      }
      response.destroy();
    });
    
    request.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    request.setTimeout(5000, () => {
      request.destroy();
      resolve({ success: false, error: 'timeout' });
    });
  });
}

async function testAllIcons() {
  try {
    console.log('🧪 اختبار جميع أيقونات أدوات الذكاء الاصطناعي...');
    console.log('='.repeat(70));

    // جلب جميع الأدوات
    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('id, name, logo_url')
      .order('name');

    if (error) {
      console.error('❌ خطأ في جلب الأدوات:', error.message);
      return false;
    }

    console.log(`📊 عدد الأدوات: ${tools.length}`);
    console.log('');

    let workingCount = 0;
    let brokenCount = 0;
    const brokenIcons = [];

    // اختبار كل أيقونة
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      
      if (!tool.logo_url) {
        console.log(`⚠️  ${i + 1}/${tools.length} - ${tool.name}: لا يوجد رابط أيقونة`);
        brokenCount++;
        brokenIcons.push({
          name: tool.name,
          issue: 'no_url'
        });
        continue;
      }

      const result = await testIconURL(tool.logo_url);
      
      if (result.success) {
        console.log(`✅ ${i + 1}/${tools.length} - ${tool.name}: يعمل`);
        workingCount++;
      } else {
        console.log(`❌ ${i + 1}/${tools.length} - ${tool.name}: لا يعمل (${result.status || result.error})`);
        brokenCount++;
        brokenIcons.push({
          name: tool.name,
          url: tool.logo_url,
          issue: result.error || `HTTP ${result.status}`
        });
      }

      // تقرير التقدم كل 25 أداة
      if ((i + 1) % 25 === 0) {
        console.log(`\n📊 تقدم: ${i + 1}/${tools.length} (${Math.round((i + 1) / tools.length * 100)}%)`);
        console.log(`   ✅ يعمل: ${workingCount} | ❌ لا يعمل: ${brokenCount}`);
        console.log('');
      }

      // توقف قصير
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n🎉 انتهى الاختبار!');
    console.log('='.repeat(70));
    console.log(`✅ أيقونات تعمل: ${workingCount}`);
    console.log(`❌ أيقونات لا تعمل: ${brokenCount}`);
    console.log(`📈 معدل النجاح: ${Math.round(workingCount / tools.length * 100)}%`);

    if (brokenIcons.length > 0) {
      console.log('\n💔 الأيقونات المكسورة:');
      brokenIcons.forEach((icon, index) => {
        console.log(`   ${index + 1}. ${icon.name}: ${icon.issue}`);
        if (icon.url) {
          console.log(`      URL: ${icon.url}`);
        }
      });
    }

    // حفظ التقرير
    const report = {
      test_date: new Date().toISOString(),
      total_tools: tools.length,
      working_count: workingCount,
      broken_count: brokenCount,
      success_rate: Math.round(workingCount / tools.length * 100),
      broken_icons: brokenIcons
    };

    require('fs').writeFileSync(
      'icon_test_report.json',
      JSON.stringify(report, null, 2)
    );

    console.log('\n📋 تقرير الاختبار: icon_test_report.json');

    return workingCount === tools.length;

  } catch (error) {
    console.error('💥 خطأ عام:', error.message);
    return false;
  }
}

// تشغيل الاختبار
testAllIcons().then(success => {
  if (success) {
    console.log('\n🎊 جميع الأيقونات تعمل بشكل مثالي!');
  } else {
    console.log('\n⚠️ بعض الأيقونات تحتاج إصلاح');
  }
  process.exit(success ? 0 : 1);
});
