// فحص أخطاء البناء المحتملة
const fs = require('fs');
const path = require('path');

console.log('🔍 فحص أخطاء البناء المحتملة...');
console.log('='.repeat(60));

// 1. فحص الملفات المطلوبة
const requiredFiles = [
  'src/components/SVGIcon.tsx',
  'next.config.js',
  'package.json',
  'tsconfig.json'
];

console.log('1️⃣ فحص الملفات المطلوبة:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - موجود`);
  } else {
    console.log(`❌ ${file} - مفقود`);
  }
});

// 2. فحص imports في المكونات
console.log('\n2️⃣ فحص imports في المكونات:');

const componentsToCheck = [
  'src/components/FeaturedAIToolCard.tsx',
  'src/components/AIToolCard.tsx',
  'src/components/SmallAIToolCard.tsx',
  'src/app/ai-tools/[slug]/page.tsx'
];

componentsToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const hasSVGIconImport = content.includes('import SVGIcon');
    const hasImageImport = content.includes('import Image from "next/image"') || content.includes("import Image from 'next/image'");
    
    console.log(`📁 ${file}:`);
    console.log(`   SVGIcon import: ${hasSVGIconImport ? '✅' : '❌'}`);
    console.log(`   Image import: ${hasImageImport ? '⚠️ (should be removed)' : '✅'}`);
  } else {
    console.log(`❌ ${file} - مفقود`);
  }
});

// 3. فحص package.json للتبعيات
console.log('\n3️⃣ فحص التبعيات:');
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['next', 'react', '@supabase/supabase-js'];
  
  requiredDeps.forEach(dep => {
    const hasInDeps = packageJson.dependencies && packageJson.dependencies[dep];
    const hasInDevDeps = packageJson.devDependencies && packageJson.devDependencies[dep];
    
    if (hasInDeps || hasInDevDeps) {
      console.log(`✅ ${dep} - موجود`);
    } else {
      console.log(`❌ ${dep} - مفقود`);
    }
  });
}

// 4. فحص TypeScript errors محتملة
console.log('\n4️⃣ فحص أخطاء TypeScript محتملة:');

// فحص SVGIcon component
if (fs.existsSync('src/components/SVGIcon.tsx')) {
  const svgIconContent = fs.readFileSync('src/components/SVGIcon.tsx', 'utf8');
  
  const checks = [
    { name: 'React import', pattern: /import.*React/i },
    { name: 'Image import', pattern: /import.*Image.*from.*next\/image/i },
    { name: 'Interface definition', pattern: /interface.*SVGIconProps/i },
    { name: 'Export default', pattern: /export default function SVGIcon/i }
  ];
  
  checks.forEach(check => {
    const found = check.pattern.test(svgIconContent);
    console.log(`   ${check.name}: ${found ? '✅' : '❌'}`);
  });
}

// 5. فحص next.config.js
console.log('\n5️⃣ فحص next.config.js:');
if (fs.existsSync('next.config.js')) {
  const nextConfigContent = fs.readFileSync('next.config.js', 'utf8');
  
  const configChecks = [
    { name: 'images.domains', pattern: /images.*domains/i },
    { name: 'cdn.jsdelivr.net', pattern: /cdn\.jsdelivr\.net/i },
    { name: 'remotePatterns', pattern: /remotePatterns/i }
  ];
  
  configChecks.forEach(check => {
    const found = check.pattern.test(nextConfigContent);
    console.log(`   ${check.name}: ${found ? '✅' : '❌'}`);
  });
}

// 6. إنشاء تقرير الأخطاء المحتملة
console.log('\n6️⃣ الأخطاء المحتملة في Vercel:');

const potentialErrors = [
  {
    error: 'Module not found: SVGIcon',
    solution: 'تأكد من وجود src/components/SVGIcon.tsx'
  },
  {
    error: 'Image optimization error',
    solution: 'تأكد من إعداد remotePatterns في next.config.js'
  },
  {
    error: 'TypeScript compilation error',
    solution: 'تأكد من صحة types في SVGIcon component'
  },
  {
    error: 'Build timeout',
    solution: 'قد تحتاج لتحسين imports أو تقليل حجم الملفات'
  }
];

potentialErrors.forEach((item, index) => {
  console.log(`   ${index + 1}. ${item.error}`);
  console.log(`      الحل: ${item.solution}`);
});

console.log('\n🎯 للحصول على أخطاء Vercel الفعلية:');
console.log('1. اذهب إلى https://vercel.com/dashboard');
console.log('2. اختر مشروعك');
console.log('3. اضغط على آخر deployment');
console.log('4. اضغط على "View Function Logs" أو "Build Logs"');
console.log('5. انسخ الأخطاء وأرسلها لي');

console.log('\n✅ انتهى الفحص!');
