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
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            من نحن
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            نحن فريق TechnoFlash، متخصصون في تقديم أفضل المحتوى التقني وأدوات الذكاء الاصطناعي للمجتمع العربي
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-dark-card rounded-xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-primary">رؤيتنا</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              أن نكون المرجع الأول للمحتوى التقني باللغة العربية، ونساهم في بناء مجتمع تقني عربي متقدم ومطلع على أحدث التطورات في عالم التكنولوجيا والذكاء الاصطناعي.
            </p>
          </div>

          <div className="bg-dark-card rounded-xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-400">رسالتنا</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              تقديم محتوى تقني عالي الجودة، ومراجعات شاملة لأدوات الذكاء الاصطناعي، وخدمات متخصصة تساعد الأفراد والشركات على الاستفادة من أحدث التقنيات.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">ما نقدمه</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">مقالات تقنية متخصصة</h3>
              <p className="text-gray-300">
                مقالات شاملة ومتعمقة حول أحدث التقنيات والأدوات في عالم الذكاء الاصطناعي والبرمجة
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">دليل أدوات الذكاء الاصطناعي</h3>
              <p className="text-gray-300">
                مراجعات شاملة ومقارنات تفصيلية لأفضل أدوات الذكاء الاصطناعي المتاحة في السوق
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">خدمات تقنية متخصصة</h3>
              <p className="text-gray-300">
                استشارات تقنية وخدمات تطوير مخصصة لمساعدة الشركات على تطبيق أحدث التقنيات
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-dark-card rounded-xl p-8 border border-gray-800 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">قيمنا</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">الجودة</h3>
              <p className="text-sm text-gray-300">محتوى عالي الجودة ومعلومات دقيقة</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">الابتكار</h3>
              <p className="text-sm text-gray-300">مواكبة أحدث التطورات التقنية</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">المجتمع</h3>
              <p className="text-sm text-text-secondary">خدمة المجتمع التقني العربي</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">التعلم</h3>
              <p className="text-sm text-gray-300">التعلم المستمر والتطوير</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-xl p-8 border border-primary/20">
          <h2 className="text-2xl font-bold mb-4">هل تريد التواصل معنا؟</h2>
          <p className="text-gray-300 mb-6">
            نحن هنا لمساعدتك في رحلتك التقنية. تواصل معنا للاستفسارات أو التعاون
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            تواصل معنا الآن
          </a>
        </div>
      </div>
    </div>
  );
}
