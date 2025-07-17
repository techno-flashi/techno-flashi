# دليل تحسين الأداء - إصلاح مشكلة TTFB البطيء

## 🔴 المشكلة الحرجة
زمن الاستجابة (TTFB) ارتفع إلى 13+ ثانية، مما يجعل الموقع غير قابل للاستخدام.

## ✅ الحلول المطبقة في الكود

### 1. تحسين استعلامات Supabase
- ✅ إزالة `select('*')` واستبدالها بأعمدة محددة
- ✅ إضافة `limit()` لجميع الاستعلامات
- ✅ إزالة الجلب المزدوج (SSG + Runtime)
- ✅ تحسين التخزين المؤقت (زيادة المدة إلى ساعة)

### 2. الملفات المحدثة
- `src/app/page.tsx` - تحسين الصفحة الرئيسية
- `src/app/articles/page.tsx` - إزالة الجلب المزدوج
- `src/app/articles/[slug]/page.tsx` - تحسين جلب المقال الواحد
- `src/app/api/articles/route.ts` - تحسين API
- `src/lib/database.ts` - إضافة دوال محسنة

## 🔴 خطوات مطلوبة في لوحة تحكم Supabase

### الخطوة 1: إنشاء الفهارس (الأهم!)
1. اذهب إلى لوحة تحكم Supabase
2. انتقل إلى SQL Editor
3. نفذ الاستعلامات التالية **واحد تلو الآخر**:

```sql
-- فهرس على status (الأكثر استخداماً)
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

-- فهرس على slug (للبحث السريع)
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- فهرس مركب على status و published_at (للترتيب السريع)
CREATE INDEX IF NOT EXISTS idx_articles_status_published_at ON articles(status, published_at DESC);

-- فهرس على featured للمقالات المميزة
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = true;

-- تحليل الجدول لتحديث الإحصائيات
ANALYZE articles;
```

### الخطوة 2: فحص الفهارس المنشأة
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'articles'
ORDER BY indexname;
```

### الخطوة 3: مراقبة الأداء
```sql
-- فحص الاستعلامات البطيئة
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
WHERE query LIKE '%articles%' 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

## 📊 النتائج المتوقعة

### قبل التحسين:
- TTFB: 13,605ms (13+ ثانية)
- استعلامات تجلب جميع البيانات (`select('*')`)
- جلب مزدوج للمقالات
- عدم وجود فهارس

### بعد التحسين:
- TTFB المتوقع: < 500ms
- استعلامات محددة الأعمدة
- جلب واحد مع تخزين مؤقت
- فهارس محسنة

## 🔧 خطوات إضافية للتحسين

### 1. تحسين قاعدة البيانات
- تأكد من أن جدول `articles` لا يحتوي على بيانات غير ضرورية
- فكر في أرشفة المقالات القديمة جداً

### 2. مراقبة الاستخدام
- راقب استهلاك Supabase Egress
- تأكد من أن التخزين المؤقت يعمل بشكل صحيح

### 3. تحسينات إضافية
- استخدم CDN للصور
- ضغط الاستجابات
- تحسين حجم الحمولة (payload)

## ⚠️ تحذيرات مهمة

1. **لا تنفذ جميع الفهارس مرة واحدة** - نفذها واحد تلو الآخر
2. **راقب استهلاك قاعدة البيانات** - الفهارس تستهلك مساحة إضافية
3. **اختبر الأداء بعد كل فهرس** - تأكد من التحسن

## 🧪 اختبار النتائج

بعد تطبيق الفهارس:
1. أعد تشغيل الخادم
2. افتح أدوات المطور
3. انتقل إلى Network tab
4. حدث الصفحة الرئيسية
5. تحقق من TTFB في أول طلب HTML

**الهدف:** TTFB أقل من 500ms
