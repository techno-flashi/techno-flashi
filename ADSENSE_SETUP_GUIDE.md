# دليل إعداد Google AdSense - TechnoFlash

## 📋 المتطلبات الأساسية

### 1. حساب Google AdSense
- إنشاء حساب AdSense على [www.google.com/adsense](https://www.google.com/adsense)
- التحقق من الموقع وقبوله في البرنامج
- الحصول على Publisher ID (يبدأ بـ `ca-pub-`)

### 2. إعداد الموقع
- موقع متوافق مع سياسات AdSense
- محتوى عالي الجودة
- تصميم متجاوب
- سرعة تحميل جيدة

---

## 🔧 خطوات الإعداد

### الخطوة 1: تحديث Publisher ID

في ملف `src/app/layout.tsx`:
```typescript
<AdSenseScript publisherId="ca-pub-YOUR_ACTUAL_PUBLISHER_ID" />
```

في ملف `src/components/ads/SafeAdSense.tsx`:
```typescript
publisherId = 'ca-pub-YOUR_ACTUAL_PUBLISHER_ID'
```

### الخطوة 2: إنشاء وحدات الإعلانات

في لوحة تحكم AdSense:
1. اذهب إلى "الإعلانات" > "حسب الوحدة الإعلانية"
2. انقر على "إنشاء وحدة إعلانية جديدة"
3. اختر نوع الإعلان:
   - **إعلان عرضي**: للبانرات
   - **إعلان داخل المقال**: للمحتوى
   - **إعلان متعدد الأشكال**: متجاوب

### الخطوة 3: نسخ معرفات الإعلانات

بعد إنشاء كل وحدة إعلانية، انسخ `data-ad-slot`:

```typescript
// مثال للاستخدام
<SafeBannerAd adSlot="1234567890" />
<SafeInArticleAd adSlot="9876543210" />
<SafeSidebarAd adSlot="5555555555" />
```

---

## 📱 أنواع الإعلانات المدعومة

### 1. إعلانات البانر
```typescript
import { SafeBannerAd } from '@/components/ads/SafeAdSense';

<SafeBannerAd 
  adSlot="YOUR_BANNER_AD_SLOT"
  className="my-4"
/>
```

### 2. إعلانات الشريط الجانبي
```typescript
import { SafeSidebarAd } from '@/components/ads/SafeAdSense';

<SafeSidebarAd 
  adSlot="YOUR_SIDEBAR_AD_SLOT"
  className="mb-6"
/>
```

### 3. إعلانات داخل المقال
```typescript
import { SafeInArticleAd } from '@/components/ads/SafeAdSense';

<SafeInArticleAd 
  adSlot="YOUR_IN_ARTICLE_AD_SLOT"
  className="my-8"
/>
```

### 4. إعلانات متجاوبة
```typescript
import { SafeMobileAd, SafeDesktopAd } from '@/components/ads/SafeAdSense';

{/* للموبايل فقط */}
<SafeMobileAd adSlot="YOUR_MOBILE_AD_SLOT" />

{/* للديسكتوب فقط */}
<SafeDesktopAd adSlot="YOUR_DESKTOP_AD_SLOT" />
```

---

## 🎨 الإعلانات المخصصة

### 1. إعلان HTML مخصص
```typescript
import CustomAd from '@/components/ads/CustomAd';

<CustomAd
  id="custom-ad-1"
  type="html"
  htmlContent={`
    <div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); padding: 20px; border-radius: 10px; color: white; text-align: center;">
      <h3>إعلان مخصص</h3>
      <p>محتوى الإعلان هنا</p>
      <button onclick="alert('تم النقر!')">اضغط هنا</button>
    </div>
  `}
  cssStyles={`
    .custom-ad { animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
  `}
  jsCode={`
    console.log('تم تحميل الإعلان المخصص');
  `}
/>
```

### 2. إعلان بانر مخصص
```typescript
<CustomAd
  id="banner-ad"
  type="banner"
  title="عنوان الإعلان"
  description="وصف الإعلان"
  imageUrl="/path/to/image.jpg"
  linkUrl="https://example.com"
  animation="fade"
  showCloseButton={true}
/>
```

### 3. إعلان متحرك
```typescript
<CustomAd
  id="animated-ad"
  type="animated"
  title="إعلان متحرك"
  description="مع تأثيرات بصرية"
  imageUrl="/path/to/image.jpg"
  linkUrl="https://example.com"
  animation="bounce"
/>
```

---

## 🔄 مدير الإعلانات الذكي

### استخدام AdManager
```typescript
import AdManager from '@/components/ads/AdManager';

{/* إعلانات الهيدر */}
<AdManager
  placement="header"
  maxAds={1}
  fallbackAdSenseSlot="YOUR_FALLBACK_SLOT"
  showFallback={true}
/>

{/* إعلانات بين المقالات */}
<AdManager
  placement="between-articles"
  maxAds={2}
  className="my-6"
/>
```

### المواضع المتاحة
- `header` - أعلى الصفحة
- `footer` - أسفل الصفحة
- `sidebar` - الشريط الجانبي
- `in-article` - داخل المقال
- `between-articles` - بين المقالات

---

## 📊 إحصائيات الإعلانات

### تتبع المشاهدات والنقرات
```typescript
// يتم تتبع الإحصائيات تلقائياً
// يمكن عرضها في لوحة التحكم /admin/ads
```

### قاعدة البيانات
```sql
-- جدول الإعلانات
CREATE TABLE advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  placement TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  current_impressions INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  max_impressions INTEGER,
  -- المزيد من الحقول...
);
```

---

## ⚠️ نصائح مهمة

### 1. سياسات AdSense
- تجنب النقر على إعلاناتك
- لا تطلب من الزوار النقر
- تأكد من المحتوى عالي الجودة
- تجنب المحتوى المحظور

### 2. تحسين الأداء
- استخدم `SafeAdSense` لتجنب الأخطاء
- ضع الإعلانات في مواضع مناسبة
- لا تفرط في عدد الإعلانات
- اختبر أداء الإعلانات

### 3. التجاوب
- استخدم إعلانات متجاوبة
- اختبر على أجهزة مختلفة
- تأكد من سرعة التحميل

---

## 🧪 الاختبار

### صفحة الاختبار
زر صفحة `/test-ads` لاختبار:
- إعلانات AdSense
- إعلانات مخصصة
- إعلانات متحركة
- التجاوب

### أدوات التطوير
```javascript
// فحص حالة AdSense في console
console.log('AdSense loaded:', !!window.adsbygoogle);
console.log('Ads count:', document.querySelectorAll('.adsbygoogle').length);
```

---

## 🔧 استكشاف الأخطاء

### مشاكل شائعة

1. **"enable_page_level_ads" error**
   - ✅ تم إصلاحها في `SafeAdSense`
   - تجنب التحميل المتكرر

2. **الإعلانات لا تظهر**
   - تحقق من Publisher ID
   - تأكد من قبول الموقع في AdSense
   - فحص Ad Blockers

3. **بطء التحميل**
   - استخدم `strategy="afterInteractive"`
   - تأخير تحميل الإعلانات

### حلول سريعة
```typescript
// إعادة تحميل الإعلانات
if (window.adsbygoogle) {
  window.adsbygoogle.push({});
}

// فحص حالة الإعلان
const adElement = document.querySelector('.adsbygoogle');
console.log('Ad status:', adElement?.getAttribute('data-adsbygoogle-status'));
```

---

## 📈 تحسين الإيرادات

### 1. مواضع الإعلانات
- أعلى المحتوى (Above the fold)
- داخل المقالات الطويلة
- نهاية المقالات
- الشريط الجانبي

### 2. أحجام الإعلانات
- 728x90 (Leaderboard)
- 300x250 (Medium Rectangle)
- 320x50 (Mobile Banner)
- 300x600 (Half Page)

### 3. اختبار A/B
- اختبر مواضع مختلفة
- جرب أحجام متنوعة
- راقب معدل النقر (CTR)
- حلل الإيرادات

---

## 🚀 النشر

### قبل النشر
1. تحديث Publisher ID الحقيقي
2. إنشاء وحدات إعلانية في AdSense
3. اختبار جميع الإعلانات
4. التأكد من سياسات AdSense

### بعد النشر
1. مراقبة الأداء في AdSense
2. تحليل الإحصائيات
3. تحسين المواضع
4. متابعة الإيرادات

---

## 📞 الدعم

### موارد مفيدة
- [مركز مساعدة AdSense](https://support.google.com/adsense)
- [سياسات AdSense](https://support.google.com/adsense/answer/48182)
- [أفضل الممارسات](https://support.google.com/adsense/answer/17957)

### اتصل بنا
إذا واجهت مشاكل في الإعداد، يمكنك:
- فتح issue في GitHub
- مراجعة الوثائق
- اختبار الإعلانات في `/test-ads`
