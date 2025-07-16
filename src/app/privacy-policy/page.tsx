import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية - TechnoFlash',
  description: 'سياسة الخصوصية لموقع TechnoFlash - كيف نجمع ونستخدم ونحمي بياناتك الشخصية.',
  keywords: 'سياسة الخصوصية, حماية البيانات, TechnoFlash, خصوصية المستخدم',
  openGraph: {
    title: 'سياسة الخصوصية - TechnoFlash',
    description: 'سياسة الخصوصية لموقع TechnoFlash - كيف نجمع ونستخدم ونحمي بياناتك الشخصية.',
    url: 'https://www.tflash.site/privacy-policy',
    siteName: 'TechnoFlash',
    images: [
      {
        url: 'https://www.tflash.site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - سياسة الخصوصية',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سياسة الخصوصية - TechnoFlash',
    description: 'سياسة الخصوصية لموقع TechnoFlash - كيف نجمع ونستخدم ونحمي بياناتك الشخصية.',
    images: ['https://www.tflash.site/og-image.jpg'],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            سياسة الخصوصية
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            نحن في TechnoFlash نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية
          </p>
          <p className="text-sm text-gray-400 mt-4">
            آخر تحديث: 16 ديسمبر 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-card rounded-xl p-8 border border-gray-800 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">مقدمة</h2>
              <p className="text-gray-300 leading-relaxed">
                تصف هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها عند استخدام موقع TechnoFlash (www.tflash.site). 
                نحن ملتزمون بحماية خصوصيتك وضمان أمان بياناتك الشخصية.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">المعلومات التي نجمعها</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">المعلومات التي تقدمها طوعياً:</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 mr-4">
                    <li>الاسم والبريد الإلكتروني عند الاشتراك في النشرة الإخبارية</li>
                    <li>المعلومات المرسلة عبر نماذج الاتصال</li>
                    <li>التعليقات والمشاركات على المقالات</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">المعلومات التي نجمعها تلقائياً:</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 mr-4">
                    <li>عنوان IP ونوع المتصفح</li>
                    <li>صفحات الموقع التي تزورها</li>
                    <li>وقت ومدة الزيارة</li>
                    <li>الموقع المرجعي الذي أتيت منه</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">كيف نستخدم المعلومات</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mr-4">
                <li>تحسين محتوى الموقع وتجربة المستخدم</li>
                <li>إرسال النشرة الإخبارية والتحديثات (بموافقتك)</li>
                <li>الرد على استفساراتك وطلبات الدعم</li>
                <li>تحليل استخدام الموقع لتحسين الخدمات</li>
                <li>منع الاستخدام غير المشروع للموقع</li>
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">ملفات تعريف الارتباط (Cookies)</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع. هذه الملفات تساعدنا في:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mr-4">
                <li>تذكر تفضيلاتك وإعداداتك</li>
                <li>تحليل حركة المرور على الموقع</li>
                <li>عرض إعلانات مناسبة (إن وجدت)</li>
                <li>تحسين أداء الموقع</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                يمكنك تعطيل ملفات تعريف الارتباط من إعدادات متصفحك، لكن هذا قد يؤثر على وظائف الموقع.
              </p>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">مشاركة البيانات</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة، باستثناء الحالات التالية:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mr-4">
                <li>عند الحصول على موافقتك الصريحة</li>
                <li>مع مقدمي الخدمات الذين يساعدوننا في تشغيل الموقع</li>
                <li>عند الطلب القانوني من السلطات المختصة</li>
                <li>لحماية حقوقنا أو سلامة المستخدمين</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">أمان البيانات</h2>
              <p className="text-gray-300 leading-relaxed">
                نتخذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. 
                هذا يشمل استخدام التشفير، جدران الحماية، وإجراءات الأمان الفيزيائية والإلكترونية.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">حقوقك</h2>
              <p className="text-gray-300 leading-relaxed mb-4">لديك الحق في:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mr-4">
                <li>الوصول إلى معلوماتك الشخصية التي نحتفظ بها</li>
                <li>طلب تصحيح أو تحديث معلوماتك</li>
                <li>طلب حذف معلوماتك الشخصية</li>
                <li>إلغاء الاشتراك في النشرة الإخبارية في أي وقت</li>
                <li>تقييد معالجة بياناتك في ظروف معينة</li>
              </ul>
            </section>

            {/* Third Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">خدمات الطرف الثالث</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                قد يحتوي موقعنا على روابط لمواقع أخرى أو يستخدم خدمات طرف ثالث مثل:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mr-4">
                <li>Google Analytics لتحليل حركة المرور</li>
                <li>خدمات التواصل الاجتماعي</li>
                <li>خدمات الإعلانات (إن وجدت)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                هذه الخدمات لها سياسات خصوصية منفصلة، ونحن لسنا مسؤولين عن ممارساتها.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">خصوصية الأطفال</h2>
              <p className="text-gray-300 leading-relaxed">
                موقعنا غير موجه للأطفال دون سن 13 عاماً. نحن لا نجمع عمداً معلومات شخصية من الأطفال دون هذا السن. 
                إذا علمنا أننا جمعنا معلومات من طفل دون سن 13، سنحذف هذه المعلومات فوراً.
              </p>
            </section>

            {/* Policy Changes */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">تغييرات السياسة</h2>
              <p className="text-gray-300 leading-relaxed">
                قد نحدث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات مهمة عبر نشر السياسة المحدثة على هذه الصفحة 
                مع تاريخ التحديث الجديد. ننصحك بمراجعة هذه السياسة بانتظام.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">اتصل بنا</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارساتنا، يرجى التواصل معنا:
              </p>
              <div className="bg-dark-bg rounded-lg p-4 border border-gray-700">
                <p className="text-gray-300">
                  <strong>البريد الإلكتروني:</strong> privacy@tflash.site<br/>
                  <strong>الموقع:</strong> www.tflash.site/contact
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
