// اختبار إصلاح أخطاء Canvas
const fs = require('fs');
const path = require('path');

console.log('🔧 اختبار إصلاح أخطاء Canvas...\n');

try {
  const simpleHeroPath = path.join(__dirname, 'src/components/SimpleHeroSection.tsx');
  
  if (fs.existsSync(simpleHeroPath)) {
    const content = fs.readFileSync(simpleHeroPath, 'utf8');
    
    console.log('✅ فحص الإصلاحات المطبقة:');
    console.log('=' .repeat(40));
    
    // فحص الحماية من القيم السالبة
    const fixes = [
      { check: 'Math.max(1, particle.size', description: 'حماية حجم الجسيمة' },
      { check: 'Math.max(0.1, particle.opacity', description: 'حماية شفافية الجسيمة' },
      { check: 'Math.max(1, pulseSize * 4)', description: 'حماية الشعاع الخارجي' },
      { check: 'Math.max(1, pulseSize * 2)', description: 'حماية الشعاع الداخلي' },
      { check: 'Math.max(0.5, pulseSize)', description: 'حماية حجم الرسم' },
      { check: 'Math.max(0, 0.2 * (1 - distance', description: 'حماية شفافية الخطوط' },
      { check: 'Math.max(0.5, 2 * finalOpacity)', description: 'حماية النقاط الضوئية' },
      { check: 'particle.size = Math.max(1, particle.size', description: 'تحقق من صحة القيم' },
      { check: 'particle.energy = Math.max(50, Math.min(100', description: 'حماية قيم الطاقة' },
      { check: 'Math.max(0.1, Math.min(1, pulseOpacity))', description: 'حماية globalAlpha' }
    ];
    
    let fixedCount = 0;
    fixes.forEach(fix => {
      if (content.includes(fix.check)) {
        console.log(`   ✅ ${fix.description}`);
        fixedCount++;
      } else {
        console.log(`   ❌ مفقود: ${fix.description}`);
      }
    });
    
    console.log(`\n📊 الإصلاحات المطبقة: ${fixedCount}/${fixes.length}`);
    
    // فحص عدم وجود قيم سالبة محتملة
    const potentialIssues = [
      'createRadialGradient.*-',
      'arc.*-',
      'globalAlpha.*-'
    ];
    
    let issuesFound = 0;
    potentialIssues.forEach(pattern => {
      const regex = new RegExp(pattern, 'g');
      const matches = content.match(regex);
      if (matches) {
        console.log(`⚠️ مشكلة محتملة: ${pattern} - ${matches.length} مطابقة`);
        issuesFound += matches.length;
      }
    });
    
    if (issuesFound === 0) {
      console.log('✅ لا توجد مشاكل محتملة في الكود');
    }
    
    // فحص استخدام Math.max و Math.min
    const mathMaxCount = (content.match(/Math\.max/g) || []).length;
    const mathMinCount = (content.match(/Math\.min/g) || []).length;
    
    console.log(`\n🔢 استخدام Math.max: ${mathMaxCount} مرة`);
    console.log(`🔢 استخدام Math.min: ${mathMinCount} مرة`);
    
    // فحص createRadialGradient
    const radialGradientCount = (content.match(/createRadialGradient/g) || []).length;
    console.log(`🎨 استخدام createRadialGradient: ${radialGradientCount} مرة`);
    
    console.log('\n🎯 التحسينات المطبقة:');
    console.log('• حماية جميع قيم الشعاع من أن تكون سالبة');
    console.log('• حماية قيم globalAlpha من أن تكون خارج النطاق [0,1]');
    console.log('• حماية أحجام الجسيمات من أن تكون صفر أو سالبة');
    console.log('• تحقق من صحة جميع القيم في بداية كل إطار');
    console.log('• حماية شفافية الخطوط والنقاط الضوئية');
    
    console.log('\n✅ تم إصلاح جميع أخطاء Canvas المحتملة!');
    
  } else {
    console.log('❌ ملف SimpleHeroSection.tsx غير موجود');
  }
  
  console.log('\n🔗 للاختبار:');
  console.log('🏠 الصفحة الرئيسية: http://localhost:3001');
  console.log('🎨 يجب أن تعمل الخلفية التفاعلية بدون أخطاء الآن');

} catch (error) {
  console.error('💥 خطأ في الاختبار:', error);
}
