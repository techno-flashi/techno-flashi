const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://zgktrwpladrkhhemhnni.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3Ryd3BsYWRya2hoZW1obm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjk0NTIsImV4cCI6MjA2NzYwNTQ1Mn0.uHKisokqk484Vq5QjCbVbcdcabxArrtKUMxjdCihe04'
);

async function debugServices() {
  console.log('🔍 فحص شامل لجدول الخدمات في Supabase...\n');
  
  try {
    // 1. فحص جميع الخدمات بدون أي فلاتر
    console.log('1️⃣ جلب جميع الخدمات (بدون فلاتر):');
    const { data: allServices, error: allError } = await supabase
      .from('services')
      .select('*');
    
    if (allError) {
      console.error('❌ خطأ في جلب جميع الخدمات:', allError);
    } else {
      console.log(`📊 إجمالي الخدمات: ${allServices?.length || 0}`);
      if (allServices && allServices.length > 0) {
        allServices.forEach((service, index) => {
          console.log(`   ${index + 1}. ${service.name || 'بدون اسم'}`);
          console.log(`      - ID: ${service.id}`);
          console.log(`      - الحالة: ${service.status || 'غير محدد'}`);
          console.log(`      - مميز: ${service.featured || false}`);
          console.log(`      - تاريخ الإنشاء: ${service.created_at}`);
          console.log('');
        });
      }
    }

    // 2. فحص الخدمات النشطة فقط
    console.log('\n2️⃣ جلب الخدمات النشطة (status = active):');
    const { data: activeServices, error: activeError } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active');
    
    if (activeError) {
      console.error('❌ خطأ في جلب الخدمات النشطة:', activeError);
    } else {
      console.log(`📊 الخدمات النشطة: ${activeServices?.length || 0}`);
      if (activeServices && activeServices.length > 0) {
        activeServices.forEach((service, index) => {
          console.log(`   ${index + 1}. ${service.name}`);
        });
      }
    }

    // 3. فحص الخدمات المميزة
    console.log('\n3️⃣ جلب الخدمات المميزة (featured = true):');
    const { data: featuredServices, error: featuredError } = await supabase
      .from('services')
      .select('*')
      .eq('featured', true);
    
    if (featuredError) {
      console.error('❌ خطأ في جلب الخدمات المميزة:', featuredError);
    } else {
      console.log(`📊 الخدمات المميزة: ${featuredServices?.length || 0}`);
    }

    // 4. فحص بنية الجدول
    console.log('\n4️⃣ فحص بنية الجدول:');
    if (allServices && allServices.length > 0) {
      const sampleService = allServices[0];
      console.log('🏗️ الحقول المتاحة في الجدول:');
      Object.keys(sampleService).forEach(key => {
        console.log(`   - ${key}: ${typeof sampleService[key]}`);
      });
    }

    // 5. اختبار نفس الاستعلام المستخدم في API
    console.log('\n5️⃣ اختبار استعلام API (نفس الكود المستخدم في الموقع):');
    const { data: apiTestServices, error: apiTestError } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (apiTestError) {
      console.error('❌ خطأ في اختبار API:', apiTestError);
    } else {
      console.log(`📊 نتائج اختبار API: ${apiTestServices?.length || 0} خدمة`);
      if (apiTestServices && apiTestServices.length > 0) {
        apiTestServices.forEach((service, index) => {
          console.log(`   ${index + 1}. ${service.name} (ترتيب: ${service.display_order})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ خطأ عام:', error);
  }
}

debugServices();
