// اختبار الاتصال بقاعدة البيانات الجديدة
const { createClient } = require('@supabase/supabase-js');

// قاعدة البيانات الجديدة
const NEW_SUPABASE_URL = 'https://xfxpwbqgtuhbkeksdbqn.supabase.co';
const NEW_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnB3YnFndHVoYmtla3NkYnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MjY1MDgsImV4cCI6MjA2ODEwMjUwOH0.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';

const supabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_ANON_KEY);

async function testDatabaseConnection() {
  try {
    console.log('🔍 اختبار الاتصال بقاعدة البيانات الجديدة...');
    console.log(`📍 URL: ${NEW_SUPABASE_URL}`);
    console.log('='.repeat(70));

    // اختبار الجداول المطلوبة
    const tables = ['ai_tools', 'articles', 'services', 'site_pages'];
    
    for (const tableName of tables) {
      try {
        console.log(`\n📋 اختبار جدول ${tableName}:`);
        
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`❌ خطأ في ${tableName}: ${error.message}`);
          
          // إذا كان الجدول غير موجود، نحاول إنشاؤه
          if (error.message.includes('does not exist') || error.message.includes('relation')) {
            console.log(`⚠️ جدول ${tableName} غير موجود - يحتاج إنشاء`);
          }
        } else {
          console.log(`✅ ${tableName}: ${count} سجل`);
          
          // إذا كان الجدول موجود، نعرض عينة من البيانات
          if (count > 0) {
            const { data: sampleData } = await supabase
              .from(tableName)
              .select('*')
              .limit(3);
            
            console.log(`📊 عينة من البيانات:`);
            sampleData?.forEach((item, index) => {
              const firstField = Object.keys(item)[1]; // أول حقل بعد id
              console.log(`   ${index + 1}. ${item[firstField] || item.id}`);
            });
          }
        }
      } catch (tableError) {
        console.log(`💥 خطأ في ${tableName}: ${tableError.message}`);
      }
    }

    // اختبار خاص لجدول ai_tools
    console.log('\n🤖 اختبار خاص لأدوات الذكاء الاصطناعي:');
    try {
      const { data: aiTools, error: aiError } = await supabase
        .from('ai_tools')
        .select('name, logo_url')
        .limit(5);

      if (aiError) {
        console.log(`❌ لا يمكن الوصول لأدوات AI: ${aiError.message}`);
      } else if (aiTools && aiTools.length > 0) {
        console.log('✅ أدوات AI موجودة:');
        aiTools.forEach(tool => {
          console.log(`   - ${tool.name}: ${tool.logo_url ? 'لديه أيقونة' : 'بدون أيقونة'}`);
        });
      } else {
        console.log('⚠️ جدول ai_tools فارغ');
      }
    } catch (aiError) {
      console.log(`💥 خطأ في ai_tools: ${aiError.message}`);
    }

    console.log('\n🎯 النتيجة النهائية:');
    console.log('='.repeat(50));
    console.log('إذا كانت الجداول غير موجودة أو فارغة، فهذا يفسر لماذا الموقع بدون محتوى');
    console.log('نحتاج إما:');
    console.log('1. نقل البيانات من قاعدة البيانات القديمة');
    console.log('2. أو العودة لقاعدة البيانات القديمة مؤقتاً');

  } catch (error) {
    console.error('💥 خطأ عام:', error.message);
  }
}

testDatabaseConnection();
