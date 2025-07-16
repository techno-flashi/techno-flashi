import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروط الاستخدام - TechnoFlash',
  description: 'شروط وأحكام استخدام موقع TechnoFlash - القواعد والإرشادات لاستخدام المحتوى والخدمات.',
  keywords: 'شروط الاستخدام, أحكام, TechnoFlash, قواعد الاستخدام, حقوق الملكية',
  openGraph: {
    title: 'شروط الاستخدام - TechnoFlash',
    description: 'شروط وأحكام استخدام موقع TechnoFlash - القواعد والإرشادات لاستخدام المحتوى والخدمات.',
    url: 'https://www.tflash.site/terms-of-use',
    siteName: 'TechnoFlash',
    images: [
      {
        url: 'https://www.tflash.site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - شروط الاستخدام',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شروط الاستخدام - TechnoFlash',
    description: 'شروط وأحكام استخدام موقع TechnoFlash - القواعد والإرشادات لاستخدام المحتوى والخدمات.',
    images: ['https://www.tflash.site/og-image.jpg'],
  },
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            شروط الاستخدام
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            القواعد والأحكام التي تحكم استخدام موقع TechnoFlash وخدماته
          </p>
          <p className="text-sm text-gray-400 mt-4">
            آخر تحديث: 16 ديسمبر 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-card rounded-xl p-8 border border-gray-800 space-y-8">
            
            {/* Acceptance */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">قبول الشروط</h2>
              <p className="text-gray-300 leading-relaxed">
                باستخدامك لموقع TechnoFlash (www.tflash.site)، فإنك توافق على الالتزام بهذه الشروط والأحكام. 
                إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
              </p>
            </section>

            {/* Use of Website */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">استخدام الموقع</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">الاستخدام المسموح:</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 mr-4">
                    <li>قراءة ومشاركة المقالات للأغراض التعليمية والشخصية</li>
                    <li>استخدام معلومات أدوات الذكاء الاصطناعي كمرجع</li>
                    <li>التفاعل مع المحتوى من خلال التعليقات والمشاركة</li>
                    <li>الاشتراك في النشرة الإخبارية</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">الاستخدام المحظور:</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 mr-4">
                    <li>نسخ أو إعادة نشر المحتوى دون إذن مكتوب</li>
                    <li>استخدام الموقع لأغراض تجارية دون موافقة</li>
                    <li>محاولة اختراق أو إلحاق الضرر بالموقع</li>
                    <li>نشر محتوى مسيء أو غير قانوني</li>
                    <li>انتهاك حقوق الملكية الفكرية</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">حقوق الملكية الفكرية</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                جميع المحتويات الموجودة على موقع TechnoFlash، بما في ذلك النصوص والصور والتصاميم والشعارات، 
                محمية بحقوق الطبع والنشر وحقوق الملكية الفكرية.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mr-4">
                <li>المحتوى الأصلي مملوك لـ TechnoFlash</li>
                <li>الصور من مصادر مرخصة (Unsplash وغيرها)</li>
                <li>أسماء الأدوات والشعارات مملوكة لأصحابها</li>
                <li>يُسمح بالاقتباس مع ذكر المصدر</li>
              </ul>
            </section>

            {/* User Content */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">محتوى المستخدم</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                عند إرسال تعليقات أو محتوى آخر إلى الموقع، فإنك:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mr-4">
                <li>تمنح TechnoFlash حق استخدام وعرض المحتوى</li>
                <li>تؤكد أن المحتوى لا ينتهك حقوق الآخرين</li>
                <li>تتحمل المسؤولية الكاملة عن المحتوى المرسل</li>
                <li>توافق على عدم نشر محتوى مسيء أو غير لائق</li>
              </ul>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">إخلاء المسؤولية</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">المحتوى والمعلومات:</h3>
                  <p className="text-gray-300 leading-relaxed">
                    المعلومات المقدمة على الموقع هي لأغراض تعليمية وإعلامية فقط. نحن نسعى لتقديم معلومات دقيقة، 
                    لكننا لا نضمن دقة أو اكتمال جميع المعلومات.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">أدوات الذكاء الاصطناعي:</h3>
                  <p className="text-gray-300 leading-relaxed">
                    المراجعات والتقييمات المقدمة للأدوات هي آراء شخصية وتجارب فردية. النتائج قد تختلف حسب الاستخدام 
                    والظروف المختلفة.
                  </p>
                </div>
              </div>
            </section>

            {/* Third Party Links */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">روابط الطرف الثالث</h2>
              <p className="text-gray-300 leading-relaxed">
                يحتوي موقعنا على روابط لمواقع ومنصات أخرى. نحن لسنا مسؤولين عن محتوى أو سياسات هذه المواقع. 
                استخدام هذه الروابط على مسؤوليتك الشخصية.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">تحديد المسؤولية</h2>
              <p className="text-gray-300 leading-relaxed">
                لن يكون TechnoFlash مسؤولاً عن أي أضرار مباشرة أو غير مباشرة قد تنتج عن استخدام الموقع أو 
                الاعتماد على المعلومات المقدمة. استخدام الموقع على مسؤوليتك الشخصية.
              </p>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">الخصوصية</h2>
              <p className="text-gray-300 leading-relaxed">
                استخدام الموقع يخضع أيضاً لسياسة الخصوصية الخاصة بنا. يرجى مراجعة 
                <a href="/privacy-policy" className="text-primary hover:text-primary/80 mx-1">سياسة الخصوصية</a>
                لفهم كيفية جمع واستخدام بياناتك.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">تعديل الشروط</h2>
              <p className="text-gray-300 leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. التعديلات ستكون سارية فور نشرها على الموقع. 
                استمرار استخدامك للموقع بعد التعديلات يعني موافقتك على الشروط الجديدة.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">إنهاء الخدمة</h2>
              <p className="text-gray-300 leading-relaxed">
                نحتفظ بالحق في إنهاء أو تعليق وصولك للموقع في أي وقت دون إشعار مسبق، خاصة في حالة انتهاك 
                هذه الشروط.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">القانون الحاكم</h2>
              <p className="text-gray-300 leading-relaxed">
                تخضع هذه الشروط للقوانين المعمول بها في المملكة العربية السعودية. أي نزاع ينشأ عن استخدام 
                الموقع سيتم حله وفقاً للقوانين السعودية.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">اتصل بنا</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                إذا كان لديك أي أسئلة حول شروط الاستخدام هذه، يرجى التواصل معنا:
              </p>
              <div className="bg-dark-bg rounded-lg p-4 border border-gray-700">
                <p className="text-gray-300">
                  <strong>البريد الإلكتروني:</strong> legal@tflash.site<br/>
                  <strong>الموقع:</strong> <a href="/contact" className="text-primary hover:text-primary/80">www.tflash.site/contact</a>
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
