# 🔍 دليل مدقق صحة الموقع الشامل - TechnoFlash

## نظرة عامة

مدقق صحة الموقع الشامل هو أداة متقدمة تكتشف المشاكل التقنية في موقعك قبل أن يكتشفها Google. يفحص جميع جوانب الموقع من SEO والأداء والأمان وإمكانية الوصول.

---

## 🚀 التشغيل السريع

### الفحص الأساسي
```bash
npm run health-check
```

### الفحص السريع (للاختبار اليومي)
```bash
npm run health-check:quick
```

### فحص محدد (SEO فقط)
```bash
npm run health-check:seo
```

---

## 📋 أنواع الفحوصات

### 1. 🎯 فحص SEO
- **العناوين**: طول مناسب (10-60 حرف)
- **الأوصاف**: طول مناسب (50-160 حرف)
- **H1**: وجود H1 واحد في كل صفحة
- **الصور**: وجود alt text
- **الروابط الداخلية**: صحة الروابط

### 2. ⚡ فحص الأداء
- **سرعة التحميل**: أقل من 3 ثواني
- **حجم HTML**: أقل من 100KB
- **ضغط GZIP**: مفعل
- **التخزين المؤقت**: Cache-Control headers
- **عدد الملفات**: CSS/JS محدود

### 3. 🔒 فحص الأمان
- **HTTPS**: إجباري
- **HSTS**: Strict-Transport-Security
- **Headers الأمان**: X-Frame-Options, X-XSS-Protection
- **Content Security**: X-Content-Type-Options

### 4. ♿ فحص إمكانية الوصول
- **اللغة**: lang attribute
- **التنقل**: skip links
- **النماذج**: labels مناسبة
- **التباين**: فحص أساسي للألوان

### 5. 📄 فحص المحتوى
- **المحتوى المكرر**: عناوين وأوصاف
- **الصور المفقودة**: في المقالات
- **الأوصاف القصيرة**: أقل من 50 حرف

### 6. 🗄️ فحص قاعدة البيانات
- **المقالات**: صور وأوصاف مفقودة
- **أدوات الذكاء الاصطناعي**: روابط تالفة
- **الصفحات**: محتوى مفقود

### 7. 🌐 فحص الروابط الخارجية
- **أدوات الذكاء الاصطناعي**: فحص 20 رابط
- **حالة الروابط**: 404, 500, timeout
- **إعادة التوجيه**: 3xx responses

### 8. 🏗️ فحص بنية الموقع
- **الصفحات المطلوبة**: Homepage, Articles, AI Tools
- **ملفات النظام**: sitemap.xml, robots.txt
- **الصفحات الاختيارية**: Terms, Ads.txt

---

## 🎛️ خيارات التشغيل

### الخيارات الأساسية
```bash
# فحص شامل مع تفاصيل
node run-health-check.js --verbose

# فحص سريع
node run-health-check.js --quick

# فحص محدد
node run-health-check.js --check seo --check performance
```

### تنسيقات التقرير
```bash
# تقرير JSON
node run-health-check.js --format json

# تقرير HTML
node run-health-check.js --format html

# حفظ في ملف محدد
node run-health-check.js --output my-report.json
```

### تكوين مخصص
```bash
# استخدام ملف تكوين مخصص
node run-health-check.js --config my-config.json
```

---

## ⚙️ ملف التكوين

يمكنك تخصيص الفحوصات عبر ملف `health-checker-config.json`:

```json
{
  "checks": {
    "seo": {
      "enabled": true,
      "titleMinLength": 10,
      "titleMaxLength": 60
    },
    "performance": {
      "enabled": true,
      "maxLoadTime": 3000
    }
  }
}
```

### الإعدادات المتاحة

#### فحص SEO
- `titleMinLength`: الحد الأدنى لطول العنوان
- `titleMaxLength`: الحد الأقصى لطول العنوان
- `descriptionMinLength`: الحد الأدنى لطول الوصف
- `descriptionMaxLength`: الحد الأقصى لطول الوصف

#### فحص الأداء
- `maxLoadTime`: أقصى وقت تحميل مقبول (ms)
- `warningLoadTime`: وقت التحميل للتحذير (ms)
- `maxHtmlSize`: أقصى حجم HTML (bytes)

#### فحص الأمان
- `requiredHeaders`: Headers الأمان المطلوبة
- `checkHsts`: فحص HSTS
- `checkHttps`: فحص HTTPS

---

## 📊 فهم التقرير

### نقاط الصحة
- **90-100**: ممتاز ✅
- **80-89**: جيد جداً 🟢
- **60-79**: مقبول ⚠️
- **أقل من 60**: يحتاج تحسين ❌

### مستويات المشاكل
- **🔴 حرجة**: تؤثر على الفهرسة والأداء
- **🟡 عالية**: تؤثر على تجربة المستخدم
- **🟠 متوسطة**: تحسينات مفيدة
- **🔵 منخفضة**: تحسينات اختيارية

### أمثلة على المشاكل

#### مشاكل حرجة
- صفحات 404
- روابط تالفة
- عدم وجود عنوان الصفحة
- مشاكل قاعدة البيانات

#### مشاكل عالية
- بطء التحميل
- عدم وجود HSTS
- صور بدون alt text
- روابط خارجية تالفة

#### مشاكل متوسطة
- عناوين طويلة/قصيرة
- عدم وجود ضغط GZIP
- مشاكل إمكانية الوصول
- محتوى مكرر

---

## 🔧 الاستخدام المتقدم

### الفحص المجدول
```bash
# إضافة إلى crontab للفحص اليومي
0 2 * * * cd /path/to/project && npm run health-check:quick
```

### التكامل مع CI/CD
```yaml
# GitHub Actions
- name: Health Check
  run: |
    npm run health-check
    if [ $? -ne 0 ]; then
      echo "Health check failed!"
      exit 1
    fi
```

### مراقبة مستمرة
```bash
# فحص كل ساعة مع تنبيهات
*/60 * * * * cd /path/to/project && npm run health-check:quick || echo "Health check failed" | mail -s "Site Health Alert" admin@tflash.site
```

---

## 📈 أفضل الممارسات

### الفحص اليومي
1. **صباحاً**: فحص سريع للتأكد من عدم وجود مشاكل حرجة
2. **مساءً**: فحص شامل مع تقرير مفصل

### قبل النشر
```bash
# فحص شامل قبل النشر
npm run health-check:verbose
```

### بعد التحديثات
```bash
# فحص محدد بعد تحديث المحتوى
npm run health-check:seo
npm run health-check:performance
```

### المراقبة الأسبوعية
```bash
# تقرير HTML أسبوعي
npm run health-check:html
```

---

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة

#### خطأ في الاتصال بقاعدة البيانات
```bash
# تحقق من متغيرات البيئة
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### timeout في الروابط الخارجية
```json
{
  "externalLinks": {
    "timeout": 10000,
    "maxChecks": 10
  }
}
```

#### ذاكرة غير كافية
```bash
# زيادة حد الذاكرة
node --max-old-space-size=4096 run-health-check.js
```

---

## 📞 الدعم والمساهمة

### الإبلاغ عن مشاكل
- إنشاء issue في GitHub
- تضمين تفاصيل الخطأ والتكوين
- إرفاق تقرير JSON إن أمكن

### المساهمة
- Fork المشروع
- إضافة فحوصات جديدة
- تحسين الأداء
- ترجمة الرسائل

### التطوير المستقبلي
- [ ] فحص Core Web Vitals
- [ ] تكامل مع Google PageSpeed
- [ ] فحص Schema.org
- [ ] تنبيهات Slack/Discord
- [ ] واجهة ويب للتقارير

---

**تم تطوير هذه الأداة بواسطة فريق TechnoFlash لضمان أفضل أداء وجودة للموقع.**
