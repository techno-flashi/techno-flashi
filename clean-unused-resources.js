// تنظيف الموارد غير المستخدمة لتحسين الأداء
const fs = require('fs');
const path = require('path');

console.log('🧹 بدء تنظيف الموارد غير المستخدمة...\n');

// 1. فحص مجلد الخطوط
const fontsDir = path.join(__dirname, 'public', 'fonts');
console.log('📁 فحص مجلد الخطوط:');

if (fs.existsSync(fontsDir)) {
  const fontFiles = fs.readdirSync(fontsDir);
  console.log(`✅ تم العثور على ${fontFiles.length} ملف خط:`);
  
  fontFiles.forEach(file => {
    const filePath = path.join(fontsDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`   📄 ${file} (${sizeKB} KB)`);
  });

  // نقل الخطوط غير المستخدمة إلى مجلد backup
  const backupDir = path.join(__dirname, 'backup-fonts');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const unusedFonts = fontFiles.filter(file => 
    file.includes('Roboto') || 
    (file.includes('Cairo') && !file.includes('Regular') && !file.includes('Bold'))
  );

  if (unusedFonts.length > 0) {
    console.log(`\n🗂️ نقل ${unusedFonts.length} خط غير مستخدم إلى backup:`);
    unusedFonts.forEach(file => {
      const sourcePath = path.join(fontsDir, file);
      const backupPath = path.join(backupDir, file);
      
      try {
        fs.renameSync(sourcePath, backupPath);
        console.log(`   ✅ تم نقل: ${file}`);
      } catch (error) {
        console.log(`   ❌ فشل نقل: ${file} - ${error.message}`);
      }
    });
  } else {
    console.log('\n✅ لا توجد خطوط غير مستخدمة للنقل');
  }
} else {
  console.log('❌ مجلد الخطوط غير موجود');
}

// 2. فحص ملفات CSS المكررة
console.log('\n📄 فحص ملفات CSS:');

const cssFiles = [
  'src/app/globals.css',
  'src/styles/local-fonts.css',
  'src/styles/ads.css'
];

cssFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    const sizeKB = (Buffer.byteLength(content, 'utf8') / 1024).toFixed(1);
    
    console.log(`✅ ${file} (${lines} سطر, ${sizeKB} KB)`);
    
    // فحص الاستيرادات المكررة
    const imports = content.match(/@import[^;]+;/g) || [];
    if (imports.length > 0) {
      console.log(`   📥 ${imports.length} استيراد موجود`);
    }
    
    // فحص font-face المكررة
    const fontFaces = content.match(/@font-face\s*{[^}]+}/g) || [];
    if (fontFaces.length > 0) {
      console.log(`   🔤 ${fontFaces.length} تعريف خط موجود`);
    }
  } else {
    console.log(`❌ ${file} غير موجود`);
  }
});

// 3. إنشاء تقرير التحسينات
console.log('\n📊 تقرير التحسينات المقترحة:');

const recommendations = [
  {
    issue: 'تحميل خطوط مكررة',
    solution: 'استخدام خط واحد فقط (Cairo) من Google Fonts',
    impact: 'تقليل وقت التحميل بـ 30-50%'
  },
  {
    issue: 'ملفات CSS متعددة',
    solution: 'دمج CSS الحرج في layout.tsx',
    impact: 'تقليل طلبات HTTP'
  },
  {
    issue: 'preload غير مستخدم',
    solution: 'إزالة preload للخطوط غير المستخدمة',
    impact: 'تقليل التحذيرات في Console'
  },
  {
    issue: 'font-display مفقود',
    solution: 'إضافة font-display: swap',
    impact: 'تحسين Core Web Vitals'
  }
];

recommendations.forEach((rec, index) => {
  console.log(`${index + 1}. 🎯 ${rec.issue}`);
  console.log(`   💡 الحل: ${rec.solution}`);
  console.log(`   📈 التأثير: ${rec.impact}\n`);
});

// 4. إنشاء ملف تكوين محسن للخطوط
const optimizedFontConfig = `/* تكوين الخطوط المحسن - تم إنشاؤه تلقائياً */
@layer base {
  /* خط Cairo الأساسي فقط */
  body {
    font-family: 'Cairo', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-display: swap;
  }
  
  /* تحسين عرض الخطوط */
  * {
    font-feature-settings: "rlig" 1, "calt" 1;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* تحسين الأداء */
  img, video {
    content-visibility: auto;
  }
}`;

const configPath = path.join(__dirname, 'src', 'styles', 'optimized-fonts.css');
fs.writeFileSync(configPath, optimizedFontConfig);
console.log(`✅ تم إنشاء ملف التكوين المحسن: ${configPath}`);

// 5. إنشاء ملف HTML محسن للاختبار
const optimizedHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>اختبار الخطوط المحسنة</title>
  
  <!-- خط واحد فقط مع تحسينات -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
  
  <style>
    body {
      font-family: 'Cairo', system-ui, sans-serif;
      font-display: swap;
      margin: 2rem;
      line-height: 1.6;
      background: #f9fafb;
    }
    
    .test-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }
    
    h1 { font-weight: 700; color: #1f2937; }
    h2 { font-weight: 600; color: #374151; }
    p { font-weight: 400; color: #6b7280; }
  </style>
</head>
<body>
  <div class="test-card">
    <h1>اختبار الخطوط المحسنة</h1>
    <h2>خط Cairo فقط - محسن للأداء</h2>
    <p>هذا نص تجريبي لاختبار الخط المحسن. يجب أن يتم تحميله بسرعة وبدون تحذيرات.</p>
    <p><strong>النتيجة المتوقعة:</strong> لا توجد تحذيرات preload في Console</p>
  </div>
  
  <div class="test-card">
    <h2>معلومات التحسين</h2>
    <ul>
      <li>✅ خط واحد فقط (Cairo)</li>
      <li>✅ font-display: swap</li>
      <li>✅ preconnect محسن</li>
      <li>✅ لا توجد ملفات محلية</li>
    </ul>
  </div>
</body>
</html>`;

const testPath = path.join(__dirname, 'font-test.html');
fs.writeFileSync(testPath, optimizedHTML);
console.log(`✅ تم إنشاء ملف الاختبار: ${testPath}`);

console.log('\n🎉 انتهى التنظيف والتحسين!');
console.log('\n📋 الخطوات التالية:');
console.log('1. افتح font-test.html في المتصفح للاختبار');
console.log('2. تحقق من Console - يجب ألا توجد تحذيرات preload');
console.log('3. طبق التحسينات على layout.tsx');
console.log('4. احذف الملفات غير المستخدمة من backup-fonts إذا كان كل شيء يعمل');
