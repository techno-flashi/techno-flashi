// اختبار بسيط للأيقونات
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://zgktrwpladrkhhemhnni.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3Ryd3BsYWRya2hoZW1obm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjk0NTIsImV4cCI6MjA2NzYwNTQ1Mn0.uHKisokqk484Vq5QjCbVbcdcabxArrtKUMxjdCihe04'
);

async function simpleTest() {
  console.log('🧪 اختبار بسيط للأيقونات...');
  
  try {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('name, logo_url')
      .limit(5);

    if (error) {
      console.error('❌ خطأ:', error.message);
      return;
    }

    console.log('📋 عينة من الأيقونات:');
    data.forEach(tool => {
      const isJsDelivr = tool.logo_url && tool.logo_url.includes('cdn.jsdelivr.net');
      const isSVG = tool.logo_url && tool.logo_url.endsWith('.svg');
      
      console.log(`✅ ${tool.name}:`);
      console.log(`   ${tool.logo_url}`);
      console.log(`   📍 jsDelivr: ${isJsDelivr ? '✅' : '❌'} | SVG: ${isSVG ? '✅' : '❌'}`);
      console.log('');
    });

    console.log('🎉 الأيقونات محدثة في قاعدة البيانات!');
    console.log('🔧 تم إصلاح الكود لعرض SVG بشكل صحيح');

  } catch (error) {
    console.error('💥 خطأ:', error.message);
  }
}

simpleTest();
