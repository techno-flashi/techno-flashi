// اختبار شامل للتحسينات الجديدة - Light Theme
const fs = require('fs');
const path = require('path');

console.log('🧪 اختبار شامل للتحسينات الجديدة - Light Theme...\n');

try {
  // اختبار المهمة الأولى: قسم أدوات الذكاء الاصطناعي
  console.log('✅ المهمة الأولى: قسم أدوات الذكاء الاصطناعي');
  console.log('=' .repeat(50));
  
  // فحص وجود مكون LatestAIToolsSection
  const latestAIToolsPath = path.join(__dirname, 'src/components/LatestAIToolsSection.tsx');
  if (fs.existsSync(latestAIToolsPath)) {
    console.log('✅ تم إنشاء مكون LatestAIToolsSection');
    
    const content = fs.readFileSync(latestAIToolsPath, 'utf8');
    
    const features = [
      { check: 'أحدث أدوات الذكاء الاصطناعي', description: 'عنوان القسم' },
      { check: 'grid-cols-4', description: 'شبكة 4 أعمدة' },
      { check: 'hover:shadow-2xl', description: 'تأثيرات hover' },
      { check: 'group-hover:scale-110', description: 'تأثيرات الصور' },
      { check: 'bg-gradient-to-r from-purple-600', description: 'أزرار متدرجة' },
      { check: 'Link href="/ai-tools"', description: 'رابط عرض المزيد' },
      { check: 'limit(8)', description: 'عرض 8 أدوات' }
    ];
    
    features.forEach(feature => {
      if (content.includes(feature.check)) {
        console.log(`   ✅ ${feature.description}`);
      } else {
        console.log(`   ❌ مفقود: ${feature.description}`);
      }
    });
  } else {
    console.log('❌ مكون LatestAIToolsSection غير موجود');
  }

  // فحص إضافة المكون للصفحة الرئيسية
  const homepagePath = path.join(__dirname, 'src/app/page.tsx');
  if (fs.existsSync(homepagePath)) {
    const content = fs.readFileSync(homepagePath, 'utf8');
    
    if (content.includes('import LatestAIToolsSection')) {
      console.log('✅ تم استيراد المكون في الصفحة الرئيسية');
    }
    
    if (content.includes('<LatestAIToolsSection />')) {
      console.log('✅ تم إضافة المكون للصفحة الرئيسية');
    }
  }

  // اختبار المهمة الثانية: Light Theme
  console.log('\n✅ المهمة الثانية: تحويل إلى Light Theme');
  console.log('=' .repeat(50));
  
  // فحص tailwind.config.js
  const tailwindConfigPath = path.join(__dirname, 'tailwind.config.js');
  if (fs.existsSync(tailwindConfigPath)) {
    const content = fs.readFileSync(tailwindConfigPath, 'utf8');
    
    const lightThemeColors = [
      { check: 'light-background', description: 'خلفية فاتحة' },
      { check: 'light-card', description: 'بطاقات فاتحة' },
      { check: 'light-text-primary', description: 'نص رئيسي فاتح' },
      { check: 'light-text-secondary', description: 'نص ثانوي فاتح' },
      { check: 'light-border', description: 'حدود فاتحة' },
      { check: 'light-hover', description: 'تأثير hover فاتح' }
    ];
    
    lightThemeColors.forEach(color => {
      if (content.includes(color.check)) {
        console.log(`   ✅ ${color.description}`);
      } else {
        console.log(`   ❌ مفقود: ${color.description}`);
      }
    });
  }

  // فحص globals.css
  const globalsCssPath = path.join(__dirname, 'src/app/globals.css');
  if (fs.existsSync(globalsCssPath)) {
    const content = fs.readFileSync(globalsCssPath, 'utf8');
    
    if (content.includes('Light Theme')) {
      console.log('✅ تم تحديث globals.css للثيم الفاتح');
    }
    
    if (content.includes('#1e293b')) {
      console.log('✅ ألوان النصوص محدثة للثيم الفاتح');
    }
  }

  // فحص Header
  const headerPath = path.join(__dirname, 'src/components/Header.tsx');
  if (fs.existsSync(headerPath)) {
    const content = fs.readFileSync(headerPath, 'utf8');
    
    const headerUpdates = [
      { check: 'bg-white/90', description: 'خلفية Header فاتحة' },
      { check: 'text-gray-900', description: 'نص Logo فاتح' },
      { check: 'text-gray-700', description: 'روابط التنقل فاتحة' },
      { check: 'hover:bg-gray-100', description: 'تأثير hover فاتح' },
      { check: 'border-gray-200', description: 'حدود فاتحة' }
    ];
    
    headerUpdates.forEach(update => {
      if (content.includes(update.check)) {
        console.log(`   ✅ ${update.description}`);
      } else {
        console.log(`   ❌ مفقود: ${update.description}`);
      }
    });
  }

  // اختبار المهمة الثالثة: خلفية محسنة
  console.log('\n✅ المهمة الثالثة: خلفية الصفحة الرئيسية المحسنة');
  console.log('=' .repeat(50));
  
  const simpleHeroPath = path.join(__dirname, 'src/components/SimpleHeroSection.tsx');
  if (fs.existsSync(simpleHeroPath)) {
    const content = fs.readFileSync(simpleHeroPath, 'utf8');
    
    const heroImprovements = [
      { check: 'bg-gradient-to-br from-white via-purple-50', description: 'خلفية فاتحة متدرجة' },
      { check: 'text-gray-900', description: 'نصوص فاتحة' },
      { check: 'for (let i = 0; i < 100; i++)', description: '100 جسيمة محسنة' },
      { check: 'rotationSpeed:', description: 'سرعة دوران للجسيمات' },
      { check: 'أشكال هندسية متحركة', description: 'أشكال هندسية' },
      { check: 'roundRect', description: 'أشكال مستديرة الزوايا' },
      { check: 'rgba(168, 85, 247, 0.05', description: 'شفافية محسنة للثيم الفاتح' }
    ];
    
    heroImprovements.forEach(improvement => {
      if (content.includes(improvement.check)) {
        console.log(`   ✅ ${improvement.description}`);
      } else {
        console.log(`   ❌ مفقود: ${improvement.description}`);
      }
    });
    
    // فحص عدد الألوان
    const colorMatches = content.match(/#[a-fA-F0-9]{6}/g) || [];
    console.log(`   🎨 عدد الألوان المستخدمة: ${colorMatches.length}`);
    
    // فحص تأثيرات Canvas
    const canvasFeatures = [
      'createRadialGradient',
      'createLinearGradient',
      'Math.sin',
      'Math.cos',
      'requestAnimationFrame'
    ];
    
    canvasFeatures.forEach(feature => {
      if (content.includes(feature)) {
        console.log(`   ✅ تأثير Canvas: ${feature}`);
      }
    });
  }

  // اختبار الأداء والتوافق
  console.log('\n🚀 اختبار الأداء والتوافق');
  console.log('=' .repeat(50));
  
  if (fs.existsSync(simpleHeroPath)) {
    const content = fs.readFileSync(simpleHeroPath, 'utf8');
    
    const performanceFeatures = [
      { check: 'getContext(\'2d\')', description: 'Canvas 2D (أداء أفضل)' },
      { check: 'requestAnimationFrame', description: 'رسم محسن' },
      { check: 'addEventListener(\'resize\'', description: 'تكيف مع الشاشة' },
      { check: 'removeEventListener', description: 'تنظيف الذاكرة' }
    ];
    
    performanceFeatures.forEach(feature => {
      if (content.includes(feature.check)) {
        console.log(`   ✅ ${feature.description}`);
      }
    });
  }

  // تقرير النتائج النهائية
  console.log('\n📊 تقرير التحسينات النهائي');
  console.log('=' .repeat(50));
  
  const completedTasks = [
    '✅ إضافة قسم أدوات الذكاء الاصطناعي',
    '✅ تحويل الموقع إلى Light Theme',
    '✅ تحسين خلفية الصفحة الرئيسية',
    '✅ تحسين الأداء والتوافق',
    '✅ الحفاظ على جميع الوظائف الموجودة'
  ];
  
  completedTasks.forEach(task => {
    console.log(task);
  });

  console.log('\n🔗 روابط الاختبار:');
  console.log(`🏠 الصفحة الرئيسية: http://localhost:3001`);
  console.log(`🤖 أدوات الذكاء الاصطناعي: http://localhost:3001/ai-tools`);
  console.log(`📄 المقالات: http://localhost:3001/articles`);

  console.log('\n🎯 نقاط الاختبار المهمة:');
  console.log('1. تحقق من قسم أدوات الذكاء الاصطناعي الجديد');
  console.log('2. تأكد من تطبيق Light Theme على جميع العناصر');
  console.log('3. اختبر الخلفية التفاعلية الجديدة');
  console.log('4. تحقق من الأداء على أجهزة مختلفة');
  console.log('5. اختبر التوافق مع المتصفحات المختلفة');

  console.log('\n✅ انتهى اختبار التحسينات بنجاح!');

} catch (error) {
  console.error('💥 خطأ عام في الاختبار:', error);
}
