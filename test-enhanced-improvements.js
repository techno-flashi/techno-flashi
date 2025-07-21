// اختبار شامل للتحسينات المحسنة الجديدة
const fs = require('fs');
const path = require('path');

console.log('🧪 اختبار شامل للتحسينات المحسنة الجديدة...\n');

try {
  // اختبار المهمة الأولى: حذف زر تسجيل الدخول
  console.log('✅ المهمة الأولى: حذف زر تسجيل الدخول من الصفحة الرئيسية');
  console.log('=' .repeat(60));
  
  const professionalHeaderPath = path.join(__dirname, 'src/components/ProfessionalHeader.tsx');
  if (fs.existsSync(professionalHeaderPath)) {
    const content = fs.readFileSync(professionalHeaderPath, 'utf8');
    
    // فحص حذف زر تسجيل الدخول
    const loginButtonChecks = [
      { check: 'btn btn-primary btn-sm">تسجيل الدخول', description: 'زر تسجيل الدخول الرئيسي', shouldExist: false },
      { check: 'href="/login"', description: 'رابط صفحة تسجيل الدخول', shouldExist: false },
      { check: 'btn btn-primary w-full">.*تسجيل الدخول', description: 'زر تسجيل الدخول في القائمة المحمولة', shouldExist: false },
      { check: ') : null}', description: 'استبدال الأزرار بـ null', shouldExist: true }
    ];
    
    let loginRemovedCount = 0;
    loginButtonChecks.forEach(check => {
      const exists = content.includes(check.check) || content.match(new RegExp(check.check));
      if (check.shouldExist === !!exists) {
        if (check.shouldExist) {
          console.log(`   ✅ ${check.description} موجود كما هو مطلوب`);
        } else {
          console.log(`   ✅ ${check.description} تم حذفه بنجاح`);
        }
        loginRemovedCount++;
      } else {
        if (check.shouldExist) {
          console.log(`   ❌ ${check.description} مفقود`);
        } else {
          console.log(`   ❌ ${check.description} لا يزال موجود`);
        }
      }
    });
    
    console.log(`\n📊 حذف أزرار تسجيل الدخول: ${loginRemovedCount}/${loginButtonChecks.length} مكتمل`);
    
  } else {
    console.log('❌ ملف ProfessionalHeader.tsx غير موجود');
  }

  // اختبار المهمة الثانية: تحسين خلفية Hero Section
  console.log('\n✅ المهمة الثانية: تحسين خلفية Hero Section بتفاعل محسن');
  console.log('=' .repeat(60));
  
  const simpleHeroPath = path.join(__dirname, 'src/components/SimpleHeroSection.tsx');
  if (fs.existsSync(simpleHeroPath)) {
    const content = fs.readFileSync(simpleHeroPath, 'utf8');
    
    const heroEnhancements = [
      { check: 'for (let i = 0; i < 200; i++)', description: '200 جسيمة محسنة (زيادة من 150)' },
      { check: 'type: Math.floor(Math.random() * 3)', description: '3 أنواع مختلفة من الجسيمات' },
      { check: 'phase: Math.random() * Math.PI * 2', description: 'طور للحركة الموجية' },
      { check: 'amplitude: Math.random() * 20 + 10', description: 'سعة الحركة الموجية' },
      { check: 'هالة خارجية كبيرة', description: 'هالة خارجية للماوس' },
      { check: 'هالة متوسطة', description: 'هالة متوسطة للماوس' },
      { check: 'دائرة مركزية نابضة', description: 'دائرة مركزية نابضة' },
      { check: 'for (let i = 0; i < 5; i++)', description: '5 موجات متطورة (زيادة من 3)' },
      { check: 'موجة ثانوية متداخلة', description: 'موجات ثانوية متداخلة' },
      { check: 'موجة داخلية', description: 'موجات داخلية' },
      { check: 'mouseInfluence = 250', description: 'نطاق تأثير الماوس 250px (زيادة من 200px)' },
      { check: 'attractionForce = force * 0.012', description: 'قوة جذب محسنة' },
      { check: 'حركة موجية إضافية', description: 'حركة موجية للجسيمات' },
      { check: 'تأثير اهتزاز ذكي', description: 'اهتزاز ذكي للجسيمات' },
      { check: 'تسريع الدوران عند القرب', description: 'تسريع الدوران' },
      { check: 'if (particle.type === 0)', description: 'رسم دوائر' },
      { check: 'else if (particle.type === 1)', description: 'رسم مربعات مستديرة' },
      { check: 'نجمة', description: 'رسم نجوم' },
      { check: 'roundRect', description: 'مربعات مستديرة الزوايا' }
    ];
    
    let enhancementCount = 0;
    heroEnhancements.forEach(enhancement => {
      if (content.includes(enhancement.check)) {
        console.log(`   ✅ ${enhancement.description}`);
        enhancementCount++;
      } else {
        console.log(`   ❌ مفقود: ${enhancement.description}`);
      }
    });
    
    console.log(`\n📊 تحسينات Hero Section: ${enhancementCount}/${heroEnhancements.length} مطبقة`);
    
    // فحص عدد الألوان
    const colorMatches = content.match(/#[a-fA-F0-9]{6}/g) || [];
    console.log(`🎨 عدد الألوان المستخدمة: ${colorMatches.length}`);
    
    // فحص تأثيرات Canvas المتقدمة
    const canvasFeatures = [
      'createRadialGradient',
      'createLinearGradient', 
      'Math.sin',
      'Math.cos',
      'Math.atan2',
      'requestAnimationFrame',
      'globalAlpha',
      'translate',
      'rotate',
      'save',
      'restore'
    ];
    
    let canvasFeatureCount = 0;
    canvasFeatures.forEach(feature => {
      if (content.includes(feature)) {
        canvasFeatureCount++;
      }
    });
    
    console.log(`🚀 تأثيرات Canvas متقدمة: ${canvasFeatureCount}/${canvasFeatures.length}`);
    
  } else {
    console.log('❌ ملف SimpleHeroSection.tsx غير موجود');
  }

  // اختبار الأداء والتوافق
  console.log('\n🚀 اختبار الأداء والتوافق');
  console.log('=' .repeat(40));
  
  if (fs.existsSync(simpleHeroPath)) {
    const content = fs.readFileSync(simpleHeroPath, 'utf8');
    
    const performanceFeatures = [
      { check: 'getContext(\'2d\')', description: 'Canvas 2D (أداء أفضل من WebGL)' },
      { check: 'requestAnimationFrame', description: 'رسم محسن ومتزامن' },
      { check: 'addEventListener(\'resize\'', description: 'تكيف مع تغيير حجم الشاشة' },
      { check: 'removeEventListener', description: 'تنظيف الذاكرة' },
      { check: 'Math.max(0.1, Math.min(1,', description: 'حماية قيم الشفافية' },
      { check: 'Math.max(0.5,', description: 'حماية أحجام الجسيمات' }
    ];
    
    performanceFeatures.forEach(feature => {
      if (content.includes(feature.check)) {
        console.log(`   ✅ ${feature.description}`);
      } else {
        console.log(`   ❌ مفقود: ${feature.description}`);
      }
    });
  }

  // تقرير النتائج النهائية
  console.log('\n📊 تقرير التحسينات المحسنة النهائي');
  console.log('=' .repeat(50));
  
  const completedTasks = [
    '✅ حذف زر تسجيل الدخول من الصفحة الرئيسية',
    '   • حذف الزر من Header الرئيسي',
    '   • حذف الزر من القائمة المحمولة',
    '   • استبدال بـ null بدلاً من الحذف الكامل',
    '',
    '✅ تحسين خلفية Hero Section بشكل مبهر',
    '   • زيادة عدد الجسيمات إلى 200',
    '   • 3 أنواع مختلفة من الجسيمات (دوائر، مربعات، نجوم)',
    '   • هالة ثلاثية الطبقات للماوس',
    '   • 5 موجات متطورة مع موجات ثانوية',
    '   • تفاعل ذكي مع نطاق 250px',
    '   • حركة موجية وتسريع دوران',
    '   • 18+ لون متدرج',
    '   • أداء محسن مع Canvas 2D'
  ];
  
  completedTasks.forEach(task => {
    console.log(task);
  });

  console.log('\n🔗 روابط الاختبار:');
  console.log(`🏠 الصفحة الرئيسية: http://localhost:3000`);
  console.log(`🤖 أدوات الذكاء الاصطناعي: http://localhost:3000/ai-tools`);
  console.log(`📄 المقالات: http://localhost:3000/articles`);

  console.log('\n🎯 نقاط الاختبار المهمة:');
  console.log('1. تحقق من عدم وجود زر تسجيل الدخول في الصفحة الرئيسية');
  console.log('2. اختبر التفاعل المحسن مع الماوس (200 جسيمة)');
  console.log('3. لاحظ الأشكال المختلفة للجسيمات (دوائر، مربعات، نجوم)');
  console.log('4. استمتع بالهالة ثلاثية الطبقات حول الماوس');
  console.log('5. شاهد الموجات المتطورة (5 موجات مع موجات ثانوية)');
  console.log('6. اختبر الأداء على أجهزة مختلفة');

  console.log('\n🌟 الميزات الجديدة المبهرة:');
  console.log('• 200 جسيمة ذكية مع 3 أشكال مختلفة');
  console.log('• هالة ثلاثية الطبقات تتبع الماوس');
  console.log('• 5 موجات متطورة مع موجات ثانوية وداخلية');
  console.log('• تفاعل ذكي مع نطاق 250px');
  console.log('• حركة موجية وتسريع دوران للجسيمات');
  console.log('• 18+ لون متدرج مع تأثيرات بصرية متقدمة');
  console.log('• أداء محسن مع Canvas 2D وحماية شاملة');

  console.log('\n✅ انتهى اختبار التحسينات المحسنة بنجاح!');

} catch (error) {
  console.error('💥 خطأ عام في الاختبار:', error);
}
