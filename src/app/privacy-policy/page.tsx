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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            سياسة الخصوصية
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            نحن في TechnoFlash نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية
          </p>
          <p className="text-sm text-gray-500 mt-4 font-medium">
            آخر تحديث: 16 ديسمبر 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 ring-1 ring-gray-100 space-y-8">

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                مقدمة
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                تصف هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها عند استخدام موقع TechnoFlash (www.tflash.site).
                نحن ملتزمون بحماية خصوصيتك وضمان أمان بياناتك الشخصية.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                المعلومات التي نجمعها
              </h2>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                    <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">1</span>
                    </span>
                    المعلومات التي تقدمها طوعياً:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4 text-base">
                    <li>الاسم والبريد الإلكتروني عند الاشتراك في النشرة الإخبارية</li>
                    <li>المعلومات المرسلة عبر نماذج الاتصال</li>
                    <li>التعليقات والمشاركات على المقالات</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                    <span className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">2</span>
                    </span>
                    المعلومات التي نجمعها تلقائياً:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4 text-base">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                كيف نستخدم المعلومات
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <ul className="list-disc list-inside text-gray-700 space-y-3 mr-4 text-base">
                  <li>تحسين محتوى الموقع وتجربة المستخدم</li>
                  <li>إرسال النشرة الإخبارية والتحديثات (بموافقتك)</li>
                  <li>الرد على استفساراتك وطلبات الدعم</li>
                  <li>تحليل استخدام الموقع لتحسين الخدمات</li>
                  <li>منع الاستخدام غير المشروع للموقع</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </span>
                ملفات تعريف الارتباط (Cookies)
              </h2>
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <p className="text-gray-700 leading-relaxed mb-4 text-base">
                  نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع. هذه الملفات تساعدنا في:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4 text-base">
                  <li>تذكر تفضيلاتك وإعداداتك</li>
                  <li>تحليل حركة المرور على الموقع</li>
                  <li>عرض إعلانات مناسبة (إن وجدت)</li>
                  <li>تحسين أداء الموقع</li>
                </ul>
                <div className="mt-4 p-4 bg-orange-100 rounded-lg border border-orange-300">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    <strong>ملاحظة:</strong> يمكنك تعطيل ملفات تعريف الارتباط من إعدادات متصفحك، لكن هذا قد يؤثر على وظائف الموقع.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </span>
                مشاركة البيانات
              </h2>
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <p className="text-gray-700 leading-relaxed mb-4 text-base">
                  نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة، باستثناء الحالات التالية:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4 text-base">
                  <li>عند الحصول على موافقتك الصريحة</li>
                  <li>مع مقدمي الخدمات الذين يساعدوننا في تشغيل الموقع</li>
                  <li>عند الطلب القانوني من السلطات المختصة</li>
                  <li>لحماية حقوقنا أو سلامة المستخدمين</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                أمان البيانات
              </h2>
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <p className="text-gray-700 leading-relaxed text-base">
                  نتخذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.
                  هذا يشمل استخدام التشفير، جدران الحماية، وإجراءات الأمان الفيزيائية والإلكترونية.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                حقوقك
              </h2>
              <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                <p className="text-gray-700 leading-relaxed mb-4 text-base font-medium">لديك الحق في:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4 text-base">
                  <li>الوصول إلى معلوماتك الشخصية التي نحتفظ بها</li>
                  <li>طلب تصحيح أو تحديث معلوماتك</li>
                  <li>طلب حذف معلوماتك الشخصية</li>
                  <li>إلغاء الاشتراك في النشرة الإخبارية في أي وقت</li>
                  <li>تقييد معالجة بياناتك في ظروف معينة</li>
                </ul>
              </div>
            </section>

            {/* Third Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </span>
                خدمات الطرف الثالث
              </h2>
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <p className="text-gray-700 leading-relaxed mb-4 text-base">
                  قد يحتوي موقعنا على روابط لمواقع أخرى أو يستخدم خدمات طرف ثالث مثل:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mr-4 text-base">
                  <li>Google Analytics لتحليل حركة المرور</li>
                  <li>خدمات التواصل الاجتماعي</li>
                  <li>خدمات الإعلانات (إن وجدت)</li>
                </ul>
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    <strong>تنبيه:</strong> هذه الخدمات لها سياسات خصوصية منفصلة، ونحن لسنا مسؤولين عن ممارساتها.
                  </p>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </span>
                خصوصية الأطفال
              </h2>
              <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
                <p className="text-gray-700 leading-relaxed text-base">
                  موقعنا غير موجه للأطفال دون سن 13 عاماً. نحن لا نجمع عمداً معلومات شخصية من الأطفال دون هذا السن.
                  إذا علمنا أننا جمعنا معلومات من طفل دون سن 13، سنحذف هذه المعلومات فوراً.
                </p>
              </div>
            </section>

            {/* Policy Changes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </span>
                تغييرات السياسة
              </h2>
              <div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
                <p className="text-gray-700 leading-relaxed text-base">
                  قد نحدث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات مهمة عبر نشر السياسة المحدثة على هذه الصفحة
                  مع تاريخ التحديث الجديد. ننصحك بمراجعة هذه السياسة بانتظام.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                اتصل بنا
              </h2>
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                <p className="text-gray-700 leading-relaxed mb-4 text-base">
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارساتنا، يرجى التواصل معنا:
                </p>
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <span className="text-gray-700 font-medium">البريد الإلكتروني:</span>
                      <span className="text-primary font-semibold mr-2">privacy@tflash.site</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </span>
                      <span className="text-gray-700 font-medium">الموقع:</span>
                      <span className="text-primary font-semibold mr-2">www.tflash.site/contact</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
