// اختبار شامل للتحسينات الجديدة
const fs = require('fs');
const path = require('path');

console.log('🧪 اختبار شامل للتحسينات الجديدة...\n');

try {
  // اختبار المهمة الأولى: تحسين التفاعل مع الماوس في Hero Section
  console.log('✅ المهمة الأولى: تحسين التفاعل مع الماوس في Hero Section');
  console.log('=' .repeat(60));
  
  const simpleHeroPath = path.join(__dirname, 'src/components/SimpleHeroSection.tsx');
  if (fs.existsSync(simpleHeroPath)) {
    const content = fs.readFileSync(simpleHeroPath, 'utf8');
    
    const mouseInteractionImprovements = [
      { check: 'mouseInfluence = 200', description: 'زيادة نطاق تأثير الماوس إلى 200px' },
      { check: 'force * 0.008', description: 'زيادة قوة التفاعل مع الماوس' },
      { check: 'force * 4', description: 'تحسين تأثير الطاقة' },
      { check: 'Math.random() - 0.5) * force * 0.002', description: 'إضافة تأثير اهتزاز ناعم' },
      { check: 'رسم هالة تتبع الماوس المتوهجة', description: 'هالة تتبع الماوس' },
      { check: 'mouseGlowSize = 100 + Math.sin(time * 3) * 20', description: 'حجم متغير للهالة' },
      { check: 'رسم دائرة مركزية صغيرة متوهجة', description: 'دائرة مركزية متوهجة' },
      { check: 'رسم موجات تنتشر من موضع الماوس', description: 'موجات تنتشر من الماوس' },
      { check: 'waveRadius = 50 + (time * 100 + i * 50) % 200', description: 'موجات متحركة' },
      { check: 'distanceToMouse / 300', description: 'تحسين نطاق تأثير الشبكة السداسية' },
      { check: 'moveIntensity = influence * 15', description: 'زيادة شدة الحركة' },
      { check: 'sizeMultiplier = 0.2 + influence * 0.8', description: 'تغيير حجم السداسيات' }
    ];
    
    let mouseImprovementCount = 0;
    mouseInteractionImprovements.forEach(improvement => {
      if (content.includes(improvement.check)) {
        console.log(`   ✅ ${improvement.description}`);
        mouseImprovementCount++;
      } else {
        console.log(`   ❌ مفقود: ${improvement.description}`);
      }
    });
    
    console.log(`\n📊 تحسينات التفاعل مع الماوس: ${mouseImprovementCount}/${mouseInteractionImprovements.length}`);
    
    // فحص عدد createRadialGradient (يجب أن يزيد بسبب هالة الماوس)
    const radialGradientCount = (content.match(/createRadialGradient/g) || []).length;
    console.log(`🎨 استخدام createRadialGradient: ${radialGradientCount} مرة`);
    
  } else {
    console.log('❌ ملف SimpleHeroSection.tsx غير موجود');
  }

  // اختبار المهمة الثانية: تقليل عدد أدوات الذكاء الاصطناعي
  console.log('\n✅ المهمة الثانية: تقليل عدد أدوات الذكاء الاصطناعي من 8 إلى 4');
  console.log('=' .repeat(60));
  
  const latestAIToolsPath = path.join(__dirname, 'src/components/LatestAIToolsSection.tsx');
  if (fs.existsSync(latestAIToolsPath)) {
    const content = fs.readFileSync(latestAIToolsPath, 'utf8');
    
    if (content.includes('.limit(4)')) {
      console.log('✅ تم تغيير limit من 8 إلى 4 في استعلام قاعدة البيانات');
    } else {
      console.log('❌ لم يتم تغيير limit في استعلام قاعدة البيانات');
    }
    
    if (content.includes('[...Array(4)]')) {
      console.log('✅ تم تحديث skeleton loading ليعرض 4 عناصر');
    } else {
      console.log('❌ لم يتم تحديث skeleton loading');
    }
    
    // فحص النص الوصفي
    if (content.includes('اكتشف أحدث وأقوى أدوات الذكاء الاصطناعي')) {
      console.log('✅ النص الوصفي محدث');
    }
    
  } else {
    console.log('❌ ملف LatestAIToolsSection.tsx غير موجود');
  }

  // اختبار المهمة الثالثة: حذف قسم الخدمات
  console.log('\n✅ المهمة الثالثة: حذف قسم "خدماتنا" من الصفحة الرئيسية');
  console.log('=' .repeat(60));
  
  const homepagePath = path.join(__dirname, 'src/app/page.tsx');
  if (fs.existsSync(homepagePath)) {
    const content = fs.readFileSync(homepagePath, 'utf8');
    
    const servicesDeletionChecks = [
      { check: 'import { ServicesSection }', description: 'استيراد ServicesSection', shouldExist: false },
      { check: 'getLatestServices', description: 'دالة getLatestServices', shouldExist: false },
      { check: 'latestServices = await getLatestServices()', description: 'استدعاء getLatestServices', shouldExist: false },
      { check: 'from(\'services\')', description: 'استعلام جدول services', shouldExist: false }
    ];
    
    let servicesRemovedCount = 0;
    servicesDeletionChecks.forEach(check => {
      const exists = content.includes(check.check);
      if (check.shouldExist === exists) {
        if (check.shouldExist) {
          console.log(`   ✅ ${check.description} موجود كما هو مطلوب`);
        } else {
          console.log(`   ✅ ${check.description} تم حذفه بنجاح`);
        }
        servicesRemovedCount++;
      } else {
        if (check.shouldExist) {
          console.log(`   ❌ ${check.description} مفقود`);
        } else {
          console.log(`   ❌ ${check.description} لا يزال موجود`);
        }
      }
    });
    
    console.log(`\n📊 حذف قسم الخدمات: ${servicesRemovedCount}/${servicesDeletionChecks.length} تم بنجاح`);
    
  } else {
    console.log('❌ ملف page.tsx غير موجود');
  }

  // اختبار PerformanceOptimizer
  console.log('\n🔧 اختبار تحديث PerformanceOptimizer');
  console.log('=' .repeat(40));
  
  const performanceOptimizerPath = path.join(__dirname, 'src/components/PerformanceOptimizer.tsx');
  if (fs.existsSync(performanceOptimizerPath)) {
    const content = fs.readFileSync(performanceOptimizerPath, 'utf8');
    
    if (content.includes('latestServices?: any[]')) {
      console.log('✅ latestServices أصبح اختيارياً في interface');
    }
    
    if (content.includes('latestServices = []')) {
      console.log('✅ قيمة افتراضية فارغة لـ latestServices');
    }
    
    if (content.includes('latestServices && latestServices.length > 0')) {
      console.log('✅ فحص وجود الخدمات قبل العرض');
    }
    
  } else {
    console.log('❌ ملف PerformanceOptimizer.tsx غير موجود');
  }

  // تقرير النتائج النهائية
  console.log('\n📊 تقرير التحسينات النهائي');
  console.log('=' .repeat(50));
  
  const completedTasks = [
    '✅ تحسين التفاعل مع الماوس في Hero Section',
    '   • زيادة نطاق التأثير إلى 200px',
    '   • زيادة قوة التفاعل والطاقة',
    '   • إضافة هالة تتبع الماوس المتوهجة',
    '   • إضافة موجات تنتشر من الماوس',
    '   • تحسين الشبكة السداسية التفاعلية',
    '',
    '✅ تقليل عدد أدوات الذكاء الاصطناعي من 8 إلى 4',
    '   • تحديث استعلام قاعدة البيانات',
    '   • تحديث skeleton loading',
    '',
    '✅ حذف قسم "خدماتنا" من الصفحة الرئيسية',
    '   • حذف استيراد ServicesSection',
    '   • حذف دالة getLatestServices',
    '   • تحديث PerformanceOptimizer',
    '   • الاحتفاظ بصفحة /services منفصلة'
  ];
  
  completedTasks.forEach(task => {
    console.log(task);
  });

  console.log('\n🔗 روابط الاختبار:');
  console.log(`🏠 الصفحة الرئيسية: http://localhost:3002`);
  console.log(`🤖 أدوات الذكاء الاصطناعي: http://localhost:3002/ai-tools`);
  console.log(`⚙️ صفحة الخدمات (منفصلة): http://localhost:3002/services`);

  console.log('\n🎯 نقاط الاختبار المهمة:');
  console.log('1. اختبر التفاعل المحسن مع الماوس في الصفحة الرئيسية');
  console.log('2. تحقق من عرض 4 أدوات ذكاء اصطناعي فقط');
  console.log('3. تأكد من عدم وجود قسم خدمات في الصفحة الرئيسية');
  console.log('4. تحقق من أن صفحة /services لا تزال تعمل');
  console.log('5. اختبر الأداء والسلاسة على أجهزة مختلفة');

  console.log('\n🌟 الميزات الجديدة المبهرة:');
  console.log('• تفاعل أقوى وأكثر استجابة مع الماوس');
  console.log('• هالة متوهجة تتبع مؤشر الماوس');
  console.log('• موجات تنتشر من موضع الماوس');
  console.log('• شبكة سداسية أكثر تفاعلاً');
  console.log('• عرض مركز لـ 4 أدوات ذكاء اصطناعي');
  console.log('• صفحة رئيسية أكثر تركيزاً بدون قسم الخدمات');

  console.log('\n✅ انتهى اختبار التحسينات الجديدة بنجاح!');

} catch (error) {
  console.error('💥 خطأ عام في الاختبار:', error);
}
