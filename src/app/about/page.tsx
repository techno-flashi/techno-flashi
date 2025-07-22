import { Metadata } from 'next';
import Image from 'next/image';


export const metadata: Metadata = {
  title: 'من نحن - TechnoFlash',
  description: 'تعرف على فريق TechnoFlash ورؤيتنا في تقديم أفضل المحتوى التقني وأدوات الذكاء الاصطناعي للمجتمع العربي.',
  keywords: 'من نحن, TechnoFlash, فريق العمل, رؤية, رسالة, تقنية, ذكاء اصطناعي',
  openGraph: {
    title: 'من نحن - TechnoFlash',
    description: 'تعرف على فريق TechnoFlash ورؤيتنا في تقديم أفضل المحتوى التقني وأدوات الذكاء الاصطناعي للمجتمع العربي.',
    url: 'https://www.tflash.site/about',
    siteName: 'TechnoFlash',
    images: [
      {
        url: 'https://www.tflash.site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - من نحن',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'من نحن - TechnoFlash',
    description: 'تعرف على فريق TechnoFlash ورؤيتنا في تقديم أفضل المحتوى التقني وأدوات الذكاء الاصطناعي للمجتمع العربي.',
    images: ['https://www.tflash.site/og-image.jpg'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">


      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-blue-600/10"></div>
        </div>

        {/* عناصر هندسية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* شارة */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              👥 تعرف علينا
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              من
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> نحن</span>
            </h1>

            {/* الوصف */}
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              نحن فريق TechnoFlash، متخصصون في تقديم أفضل المحتوى التقني وأدوات الذكاء الاصطناعي
              <br className="hidden md:block" />
              للمجتمع العربي مع رؤية طموحة لمستقبل تقني مشرق
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative modern-card p-8 hover-lift">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">رؤيتنا</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                أن نكون المرجع الأول للمحتوى التقني باللغة العربية، ونساهم في بناء مجتمع تقني عربي متقدم ومطلع على أحدث التطورات في عالم التكنولوجيا والذكاء الاصطناعي.
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 rounded-full text-sm font-medium">
                  🎯 رؤية طموحة
                </span>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative modern-card p-8 hover-lift">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">رسالتنا</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                تقديم محتوى تقني عالي الجودة، ومراجعات شاملة لأدوات الذكاء الاصطناعي، وخدمات متخصصة تساعد الأفراد والشركات على الاستفادة من أحدث التقنيات.
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium">
                  🚀 مهمة واضحة
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              🎁 خدماتنا
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ما
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> نقدمه</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              مجموعة شاملة من الخدمات والمحتوى التقني المتخصص لخدمة المجتمع العربي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative modern-card p-8 text-center hover-lift">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">مقالات تقنية متخصصة</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  مقالات شاملة ومتعمقة حول أحدث التقنيات والأدوات في عالم الذكاء الاصطناعي والبرمجة
                </p>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  500+ مقال
                </span>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative modern-card p-8 text-center hover-lift">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">دليل أدوات الذكاء الاصطناعي</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  مراجعات شاملة ومقارنات تفصيلية لأفضل أدوات الذكاء الاصطناعي المتاحة في السوق
                </p>
                <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  50+ أداة
                </span>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative modern-card p-8 text-center hover-lift">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">خدمات تقنية متخصصة</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  استشارات تقنية وخدمات تطوير مخصصة لمساعدة الشركات على تطبيق أحدث التقنيات
                </p>
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  خدمات شاملة
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-medium mb-6">
              💎 قيمنا الأساسية
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              القيم التي
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> نؤمن بها</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              مبادئ راسخة توجه عملنا وتحدد هويتنا في رحلة خدمة المجتمع التقني العربي
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center">
              <div className="modern-card p-6 hover-lift">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">الجودة</h3>
                <p className="text-gray-600 text-sm leading-relaxed">محتوى عالي الجودة ومعلومات دقيقة وموثوقة</p>
              </div>
            </div>

            <div className="group text-center">
              <div className="modern-card p-6 hover-lift">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">الابتكار</h3>
                <p className="text-gray-600 text-sm leading-relaxed">مواكبة أحدث التطورات التقنية والابتكارات</p>
              </div>
            </div>

            <div className="group text-center">
              <div className="modern-card p-6 hover-lift">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">المجتمع</h3>
                <p className="text-gray-600 text-sm leading-relaxed">خدمة المجتمع التقني العربي وتطويره</p>
              </div>
            </div>

            <div className="group text-center">
              <div className="modern-card p-6 hover-lift">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">التعلم</h3>
                <p className="text-gray-600 text-sm leading-relaxed">التعلم المستمر والتطوير الدائم</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="relative overflow-hidden">
          {/* خلفية متدرجة */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5"></div>
          </div>

          {/* عناصر هندسية */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-40 h-40 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          <div className="relative modern-card p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-medium mb-6">
                🤝 انضم إلينا
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                هل تريد
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> التواصل معنا</span>؟
              </h2>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                نحن هنا لمساعدتك في رحلتك التقنية. تواصل معنا للاستفسارات، التعاون،
                أو مشاركة أفكارك معنا
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="/contact"
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-flex items-center justify-center"
                >
                  <span className="relative z-10">تواصل معنا الآن</span>
                  <svg className="w-5 h-5 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>

                <a
                  href="/services"
                  className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-purple-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 inline-flex items-center justify-center"
                >
                  استكشف خدماتنا
                  <span className="inline-block mr-2 transition-transform group-hover:translate-x-1">←</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
