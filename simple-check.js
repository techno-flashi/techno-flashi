// فحص بسيط للمشروع الصحيح
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://zgktrwpladrkhhemhnni.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3Ryd3BsYWRya2hoZW1obm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjk0NTIsImV4cCI6MjA2NzYwNTQ1Mn0.uHKisokqk484Vq5QjCbVbcdcabxArrtKUMxjdCihe04'
);

async function simpleCheck() {
  console.log('🔍 فحص المشروع الصحيح: zgktrwpladrkhhemhnni');
  
  try {
    const { count, error } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ خطأ:', error.message);
      return;
    }

    console.log(`✅ المشروع متصل - عدد أدوات AI: ${count}`);

    // عينة من البيانات
    const { data } = await supabase
      .from('ai_tools')
      .select('name, logo_url')
      .limit(3);

    console.log('\n📋 عينة من البيانات:');
    data.forEach(tool => {
      console.log(`- ${tool.name}: ${tool.logo_url ? 'لديه أيقونة' : 'لا يوجد أيقونة'}`);
    });

    console.log('\n🚀 جاهز لتحديث الأيقونات!');

  } catch (error) {
    console.error('💥 خطأ:', error.message);
  }
}

simpleCheck();
