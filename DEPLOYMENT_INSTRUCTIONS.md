# 🚀 تعليمات النشر - TechnoFlash

## 📋 الخطوات المطلوبة لنشر الموقع

### 1️⃣ **إنشاء مستودع GitHub**

1. اذهب إلى https://github.com/new
2. اسم المستودع: `technoflash-website`
3. الوصف: `موقع تقني عربي شامل مع نظام إدارة المحتوى`
4. اجعله عام (Public)
5. اضغط "Create repository"

### 2️⃣ **رفع الكود إلى GitHub**

```bash
# في مجلد المشروع
git remote add origin https://github.com/techno-flashi/technoflash-website.git
git branch -M main
git push -u origin main
```

### 3️⃣ **النشر على Vercel**

1. اذهب إلى https://vercel.com
2. سجل دخول بحساب GitHub
3. اضغط "New Project"
4. اختر مستودع `technoflash-website`
5. اضغط "Deploy"

### 4️⃣ **إعداد متغيرات البيئة في Vercel**

في لوحة Vercel:
1. اذهب إلى Settings → Environment Variables
2. أضف المتغيرات التالية:

```
NEXT_PUBLIC_SUPABASE_URL = https://zgktrwpladrkhhemhnni.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3Ryd3BsYWRya2hoZW1obm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjk0NTIsImV4cCI6MjA2NzYwNTQ1Mn0.uHKisokqk484Vq5QjCbVbcdcabxArrtKUMxjdCihe04
NEXT_PUBLIC_SITE_URL = https://your-vercel-domain.vercel.app
NEXT_PUBLIC_GA_ID = G-X8ZRRZX2EQ
```

**مهم:** استبدل `your-vercel-domain.vercel.app` برابط موقعك الفعلي على Vercel.

### 5️⃣ **إعداد Supabase للدومين الجديد**

في لوحة Supabase:
1. اذهب إلى Settings → API
2. في قسم "Site URL" أضف رابط Vercel الجديد
3. في قسم "Redirect URLs" أضف:
   - `https://your-vercel-domain.vercel.app/auth/callback`
   - `https://your-vercel-domain.vercel.app/admin`

### 6️⃣ **اختبار الموقع**

1. افتح رابط Vercel
2. تأكد من عمل:
   - الصفحة الرئيسية
   - قسم الخدمات
   - قسم الإعلانات
   - لوحة الإدارة `/admin`

## ✅ **النتيجة المتوقعة**

بعد اتباع هذه الخطوات ستحصل على:
- ✅ موقع يعمل بالكامل على Vercel
- ✅ رابط مباشر للموقع
- ✅ قاعدة بيانات متصلة
- ✅ لوحة إدارة تعمل
- ✅ نظام إعلانات نشط

## 🔗 **الروابط المهمة**

- **GitHub:** https://github.com/techno-flashi/technoflash-website
- **Vercel:** https://vercel.com/dashboard
- **Supabase:** https://supabase.com/dashboard/project/zgktrwpladrkhhemhnni

## 📞 **في حالة المشاكل**

### 🔧 **مشاكل شائعة وحلولها:**

#### 1. **الخدمات لا تظهر:**
- تأكد من أن `NEXT_PUBLIC_SITE_URL` مُعد بشكل صحيح
- تحقق من أن الخدمات في قاعدة البيانات لها `status = 'active'`

#### 2. **النص العربي لا يظهر بشكل صحيح:**
- تم إصلاح هذه المشكلة في الكود الجديد
- تأكد من أن الموقع يستخدم أحدث إصدار من الكود

#### 3. **الصفحات الثابتة لا تعمل:**
- تحقق من أن الصفحات في قاعدة البيانات لها `is_active = true`
- تأكد من أن `page_key` يطابق الرابط المطلوب

#### 4. **مشاكل عامة:**
1. تأكد من متغيرات البيئة
2. تحقق من إعدادات Supabase
3. راجع logs في Vercel
4. تأكد من أن Row Level Security مُعد بشكل صحيح

---

🎉 **مبروك! موقعك سيكون جاهزاً للعالم!**