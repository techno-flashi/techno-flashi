// فحص قاعدة البيانات المتصل بها حالياً
const { createClient } = require('@supabase/supabase-js');

// قاعدة البيانات الجديدة
const SUPABASE_URL = 'https://xfxpwbqgtuhbkeksdbqn.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnB3YnFndHVoYmtla3NkYnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUyNjUwOCwiZXhwIjoyMDY4MTAyNTA4fQ.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkCurrentDatabase() {
  try {
    console.log('🔍 فحص قاعدة البيانات الحالية...');
    console.log(`📍 URL: ${SUPABASE_URL}`);
    console.log(`🆔 Project ID: xfxpwbqgtuhbkeksdbqn`);
    console.log('='.repeat(70));

    // فحص الجداول الموجودة
    console.log('\n1️⃣ فحص الجداول الموجودة:');
    
    // محاولة الوصول للجداول المطلوبة
    const requiredTables = [
      'ai_tools',
      'articles', 
      'services',
      'site_pages'
    ];

    const tableStatus = {};

    for (const tableName of requiredTables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`❌ ${tableName}: غير موجود (${error.message})`);
          tableStatus[tableName] = false;
        } else {
          console.log(`✅ ${tableName}: موجود (${count} سجل)`);
          tableStatus[tableName] = true;
        }
      } catch (e) {
        console.log(`❌ ${tableName}: خطأ (${e.message})`);
        tableStatus[tableName] = false;
      }
    }

    // فحص Storage
    console.log('\n2️⃣ فحص Storage:');
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      
      if (storageError) {
        console.log(`❌ Storage: غير متاح (${storageError.message})`);
      } else {
        console.log(`✅ Storage: متاح (${buckets?.length || 0} buckets)`);
        buckets?.forEach(bucket => {
          console.log(`   - ${bucket.name}`);
        });
      }
    } catch (e) {
      console.log(`❌ Storage: خطأ (${e.message})`);
    }

    // النتيجة
    console.log('\n🎯 النتيجة:');
    console.log('='.repeat(50));
    
    const existingTables = Object.values(tableStatus).filter(Boolean).length;
    const totalTables = requiredTables.length;
    
    console.log(`📊 الجداول الموجودة: ${existingTables}/${totalTables}`);
    
    if (existingTables === 0) {
      console.log('⚠️ قاعدة البيانات فارغة تماماً - تحتاج إنشاء جميع الجداول');
      return { empty: true, needsSetup: true };
    } else if (existingTables < totalTables) {
      console.log('⚠️ بعض الجداول مفقودة - تحتاج إكمال الإعداد');
      return { empty: false, needsSetup: true, missingTables: requiredTables.filter(t => !tableStatus[t]) };
    } else {
      console.log('✅ جميع الجداول موجودة - قاعدة البيانات جاهزة');
      return { empty: false, needsSetup: false };
    }

  } catch (error) {
    console.error('💥 خطأ عام:', error.message);
    return { error: error.message };
  }
}

checkCurrentDatabase().then(result => {
  console.log('\n🎊 انتهى الفحص!');
  if (result.needsSetup) {
    console.log('🔧 الخطوة التالية: إنشاء الجداول المطلوبة');
  }
});
