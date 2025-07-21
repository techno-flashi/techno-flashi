// اختبار بسيط لدالة تنظيف المقالات
const { cleanArticleContent, previewCleaningChanges } = require('./src/lib/articleCleaner.ts');

// محتوى تجريبي للاختبار
const testContent = `
<h1>العنوان الرئيسي الأول</h1>
<p>هذه فقرة عادية.</p>

<h1>عنوان رئيسي ثاني يجب تحويله إلى H2</h1>
<p>فقرة أخرى مع <span style="color: red;">نص ملون</span> و <div class="test">عنصر div</div>.</p>

<script>alert('كود خطير!');</script>
<iframe src="http://example.com"></iframe>

<h1>عنوان رئيسي ثالث</h1>
<p>فقرة مع <a href="http://example.com" style="color: blue;" class="link">رابط خارجي</a>.</p>

<img src="image.jpg" style="width: 100px;" class="image" />

<p></p>
<div></div>
<span></span>

<blockquote>اقتباس مهم</blockquote>
`;

console.log('=== اختبار تنظيف المقال ===');
console.log('المحتوى الأصلي:');
console.log(testContent);
console.log('\n' + '='.repeat(50) + '\n');

try {
  const result = previewCleaningChanges(testContent);
  
  console.log('المحتوى المنظف:');
  console.log(result.cleanedContent);
  
  console.log('\n=== الإحصائيات ===');
  console.log(`الطول الأصلي: ${result.stats.originalLength} حرف`);
  console.log(`الطول بعد التنظيف: ${result.stats.cleanedLength} حرف`);
  console.log(`التقليل: ${result.stats.reduction} حرف (${result.stats.reductionPercentage}%)`);
  console.log(`عناوين H1 محولة: ${result.stats.h1Converted}`);
  console.log(`عناصر محذوفة: ${result.stats.removedElements.total}`);
  
  console.log('\n=== التحقق ===');
  console.log(`صالح: ${result.validation.isValid}`);
  if (result.validation.issues.length > 0) {
    console.log('مشاكل:', result.validation.issues);
  }
  if (result.validation.warnings.length > 0) {
    console.log('تحذيرات:', result.validation.warnings);
  }
  
} catch (error) {
  console.error('خطأ في الاختبار:', error);
}
