# 🚀 دليل النشر على Vercel مع SSG و ISR

## 📋 المتطلبات الأساسية

### 1. متغيرات البيئة المطلوبة
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key for SSG Build Time (CRITICAL)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.tflash.site
NEXT_PUBLIC_SITE_NAME=TechnoFlash

# ISR Configuration
NEXT_PUBLIC_REVALIDATE_TIME=86400
```

### 2. إعدادات Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

## 🔧 خطوات النشر

### الخطوة 1: إعداد المشروع على Vercel
1. انتقل إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط "New Project"
3. اختر مستودع GitHub الخاص بك
4. اختر Framework: **Next.js**

### الخطوة 2: تكوين متغيرات البيئة
1. في إعدادات المشروع، انتقل إلى **Environment Variables**
2. أضف جميع المتغيرات المطلوبة:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **مهم جداً للـ SSG**
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SITE_NAME`

### الخطوة 3: إعدادات البناء
```bash
# Build Command
npm run build

# Install Command  
npm install

# Development Command
npm run dev
```

### الخطوة 4: إعدادات النطاق
1. في **Domains**، أضف نطاقك المخصص
2. تأكد من إعداد DNS بشكل صحيح
3. فعّل HTTPS تلقائياً

## ⚙️ إعدادات SSG المتقدمة

### 1. إعدادات ISR
```typescript
// في كل صفحة
export const revalidate = 86400; // 24 ساعة
export const dynamic = 'force-static';
export const dynamicParams = true;
```

### 2. إعدادات Cache
```javascript
// في next.config.js
async headers() {
  return [
    {
      source: '/articles/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400'
        }
      ]
    }
  ];
}
```

### 3. تحسين الأداء
```javascript
// webpack optimization
webpack: (config, { dev, isServer }) => {
  if (!dev && !isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    };
  }
  return config;
}
```

## 📊 مراقبة الأداء

### 1. Vercel Analytics
```bash
npm install @vercel/analytics
```

```typescript
// في _app.tsx أو layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. مراقبة ISR
- راقب **Function Logs** في Vercel Dashboard
- تحقق من **Build Logs** للتأكد من نجاح SSG
- استخدم **Edge Network** لمراقبة Cache

### 3. مقاييس الأداء
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1

## 🔍 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ في بناء SSG
```
Error: SUPABASE_SERVICE_ROLE_KEY is not defined
```
**الحل**: تأكد من إضافة `SUPABASE_SERVICE_ROLE_KEY` في متغيرات البيئة

#### 2. فشل ISR
```
Error: Failed to revalidate
```
**الحل**: تحقق من صحة اتصال Supabase وصلاحيات Service Role Key

#### 3. صفحات فارغة
```
Error: getStaticProps returned undefined
```
**الحل**: تأكد من وجود بيانات في قاعدة البيانات وصحة الاستعلامات

#### 4. بطء التحميل
**الحل**: 
- تحقق من تحسين الصور
- راجع إعدادات Cache
- استخدم `next/dynamic` للمكونات الثقيلة

### سجلات التشخيص
```bash
# فحص البناء محلياً
npm run build
npm run start

# فحص SSG
npm run build && npm run export

# اختبار الأداء
npm run lighthouse
```

## 📈 تحسين الأداء

### 1. تحسين الصور
```typescript
// استخدام next/image
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true} // للصور المهمة
  placeholder="blur" // تحسين UX
/>
```

### 2. تحسين الخطوط
```typescript
// في next.config.js
experimental: {
  optimizeFonts: true,
  fontLoaders: [
    { loader: '@next/font/google', options: { subsets: ['latin', 'arabic'] } }
  ]
}
```

### 3. تحسين JavaScript
```typescript
// استخدام dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // إذا لم تكن بحاجة لـ SSR
});
```

## 🔄 عملية النشر المستمر

### 1. GitHub Actions (اختياري)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 2. إعدادات Git
```bash
# تجاهل ملفات البناء
echo ".vercel" >> .gitignore
echo ".next" >> .gitignore
echo "node_modules" >> .gitignore
```

## ✅ قائمة فحص النشر

### قبل النشر
- [ ] جميع متغيرات البيئة مضافة
- [ ] Service Role Key صحيح
- [ ] البيانات موجودة في Supabase
- [ ] الاختبار المحلي ناجح
- [ ] إعدادات DNS صحيحة

### بعد النشر
- [ ] الموقع يعمل بشكل صحيح
- [ ] SSG يعمل للمقالات وأدوات AI
- [ ] ISR يحدث المحتوى
- [ ] الأداء مقبول (< 3s)
- [ ] SEO محسن
- [ ] الإعلانات تعمل

### مراقبة مستمرة
- [ ] فحص أسبوعي للأداء
- [ ] مراجعة سجلات الأخطاء
- [ ] تحديث المحتوى
- [ ] نسخ احتياطية منتظمة

## 🎯 النتائج المتوقعة

### الأداء
- **تحسين سرعة التحميل**: 60-80%
- **تقليل استهلاك الخادم**: 90%
- **تحسين SEO**: زيادة الترتيب
- **تجربة مستخدم أفضل**: تقليل وقت الانتظار

### التكاليف
- **تقليل Function Executions**: 95%
- **تقليل Bandwidth**: 70%
- **تحسين Cache Hit Ratio**: 90%+
- **توفير في التكاليف**: 80-90%

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع [Vercel Documentation](https://vercel.com/docs)
2. تحقق من [Next.js SSG Guide](https://nextjs.org/docs/basic-features/data-fetching/get-static-props)
3. راجع سجلات الأخطاء في Vercel Dashboard
4. استخدم صفحة `/test-ssg` لتشخيص المشاكل

---

**🚀 مبروك! موقعك الآن محسن بالكامل مع SSG و ISR!**
