}import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'اتصل بنا - TechnoFlash',
  description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
  keywords: 'اتصل بنا, تواصل, TechnoFlash, استفسارات, خدمات تقنية, دعم',
  openGraph: {
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    url: 'https://www.tflash.site/contact',
    siteName: 'TechnoFlash',
    images: [
      {
        url: 'https://www.tflash.site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - اتصل بنا',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    images: ['https://www.tflash.site/og-image.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-purple-600/10"></div>
        </div>

        {/* عناصر هندسية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center">
            {/* شارة */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
              📄 صفحة معلومات
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              اتصل بنا
            </h1>

            {/* الوصف */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              تواصل معنا عبر البريد الإلكتروني للاستفسارات والاقتراحات والتعاون في مجال الذكاء الاصطناعي
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4">
        {/* Main Content */}
        <main className="mb-16">
          <div className="modern-card p-8 lg:p-12">
            <div className="prose prose-lg max-w-none text-right text-gray-800 leading-relaxed" style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
              <p className="mb-6">إذا كان لديك أي استفسار، اقتراح، أو ترغب بالتواصل معنا بخصوص التعاون، الرعاية، أو تقديم ملاحظات لتحسين المحتوى، يسعدنا تواصلك عبر البريد الإلكتروني:</p>

              <p className="mb-6">📧 contact@tfai.pro </p>

              <p className="mb-6">⏰ مواعيد العمل الرسمية:<br/>
              من الأحد إلى الخميس، من 9:00 صباحًا إلى 6:00 مساءً بتوقيت القاهرة (GMT+2).<br/>
              جميع الردود خلال 3 إلى 5 أيام عمل.</p>

              <p className="mb-6">📌 تنويه:<br/>
              لا نقدّم دعمًا فنيًا مباشرًا للأدوات.<br/>
              التواصل فقط لأغراض:<br/>
              • الرعاية الإعلانية<br/>
              • الاقتراحات<br/>
              • البلاغات المتعلقة بالمحتوى</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center">
          <div className="modern-card p-8">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
                🕒 آخر تحديث: ١٤ يوليو ٢٠٢٥
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/"
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="relative z-10">العودة للرئيسية</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <Link
                  href="/contact"
                  className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-indigo-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  تواصل معنا
                  <span className="inline-block mr-2 transition-transform group-hover:translate-x-1">←</span>
                </Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'اتصل بنا - TechnoFlash',
  description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
  keywords: 'اتصل بنا, تواصل, TechnoFlash, استفسارات, خدمات تقنية, دعم',
  openGraph: {
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    url: 'https://www.tflash.site/contact',
    siteName: 'TechnoFlash',
    images: [
      {
        url: 'https://www.tflash.site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - اتصل بنا',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    images: ['https://www.tflash.site/og-image.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-purple-600/10"></div>
        </div>

        {/* عناصر هندسية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center">
            {/* شارة */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
              📄 صفحة معلومات
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              اتصل بنا
            </h1>

            {/* الوصف */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              تواصل معنا عبر البريد الإلكتروني للاستفسارات والاقتراحات والتعاون في مجال الذكاء الاصطناعي
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4">
        {/* Main Content */}
        <main className="mb-16">
          <div className="modern-card p-8 lg:p-12">
            <div className="prose prose-lg max-w-none text-right text-gray-800 leading-relaxed" style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
              <p className="mb-6">إذا كان لديك أي استفسار، اقتراح، أو ترغب بالتواصل معنا بخصوص التعاون، الرعاية، أو تقديم ملاحظات لتحسين المحتوى، يسعدنا تواصلك عبر البريد الإلكتروني:</p>

              <p className="mb-6">📧 contact@tfai.pro </p>

              <p className="mb-6">⏰ مواعيد العمل الرسمية:<br/>
              من الأحد إلى الخميس، من 9:00 صباحًا إلى 6:00 مساءً بتوقيت القاهرة (GMT+2).<br/>
              جميع الردود خلال 3 إلى 5 أيام عمل.</p>

              <p className="mb-6">📌 تنويه:<br/>
              لا نقدّم دعمًا فنيًا مباشرًا للأدوات.<br/>
              التواصل فقط لأغراض:<br/>
              • الرعاية الإعلانية<br/>
              • الاقتراحات<br/>
              • البلاغات المتعلقة بالمحتوى</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center">
          <div className="modern-card p-8">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
                🕒 آخر تحديث: ١٤ يوليو ٢٠٢٥
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/"
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="relative z-10">العودة للرئيسية</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <Link
                  href="/contact"
                  className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-indigo-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  تواصل معنا
                  <span className="inline-block mr-2 transition-transform group-hover:translate-x-1">←</span>
                </Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'اتصل بنا - TechnoFlash',
  description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
  keywords: 'اتصل بنا, تواصل, TechnoFlash, استفسارات, خدمات تقنية, دعم',
  openGraph: {
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    url: 'https://www.tflash.site/contact',
    siteName: 'TechnoFlash',
    images: [
      {
        url: 'https://www.tflash.site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - اتصل بنا',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    images: ['https://www.tflash.site/og-image.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-purple-600/10"></div>
        </div>

        {/* عناصر هندسية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center">
            {/* شارة */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
              📄 صفحة معلومات
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              اتصل بنا
            </h1>

            {/* الوصف */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              تواصل معنا عبر البريد الإلكتروني للاستفسارات والاقتراحات والتعاون في مجال الذكاء الاصطناعي
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4">
        {/* Main Content */}
        <main className="mb-16">
          <div className="modern-card p-8 lg:p-12">
            <div className="prose prose-lg max-w-none text-right text-gray-800 leading-relaxed" style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
              <p className="mb-6">إذا كان لديك أي استفسار، اقتراح، أو ترغب بالتواصل معنا بخصوص التعاون، الرعاية، أو تقديم ملاحظات لتحسين المحتوى، يسعدنا تواصلك عبر البريد الإلكتروني:</p>

              <p className="mb-6">📧 i2s2mail22@gmail.com</p>

              <p className="mb-6">⏰ مواعيد العمل الرسمية:<br/>
              من الأحد إلى الخميس، من 9:00 صباحًا إلى 6:00 مساءً بتوقيت القاهرة (GMT+2).<br/>
              جميع الردود خلال 3 إلى 5 أيام عمل.</p>

              <p className="mb-6">📌 تنويه:<br/>
              لا نقدّم دعمًا فنيًا مباشرًا للأدوات.<br/>
              التواصل فقط لأغراض:<br/>
              • الرعاية الإعلانية<br/>
              • الاقتراحات<br/>
              • البلاغات المتعلقة بالمحتوى</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center">
          <div className="modern-card p-8">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
                🕒 آخر تحديث: ١٤ يوليو ٢٠٢٥
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/"
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="relative z-10">العودة للرئيسية</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <Link
                  href="/contact"
                  className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-indigo-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  تواصل معنا
                  <span className="inline-block mr-2 transition-transform group-hover:translate-x-1">←</span>
                </Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'اتصل بنا - TechnoFlash',
  description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
  keywords: 'اتصل بنا, تواصل, TechnoFlash, استفسارات, خدمات تقنية, دعم',
  openGraph: {
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    url: 'https://www.tflash.site/contact',
    siteName: 'TechnoFlash',
    images: [
      {
        url: 'https://www.tflash.site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - اتصل بنا',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    images: ['https://www.tflash.site/og-image.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-purple-600/10"></div>
        </div>

        {/* عناصر هندسية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center">
            {/* شارة */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
              📄 صفحة معلومات
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              اتصل بنا
            </h1>

            {/* الوصف */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              تواصل معنا عبر البريد الإلكتروني للاستفسارات والاقتراحات والتعاون في مجال الذكاء الاصطناعي
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4">
        {/* Main Content */}
        <main className="mb-16">
          <div className="modern-card p-8 lg:p-12">
            <div className="prose prose-lg max-w-none text-right text-gray-800 leading-relaxed" style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
              <p className="mb-6">إذا كان لديك أي استفسار، اقتراح، أو ترغب بالتواصل معنا بخصوص التعاون، الرعاية، أو تقديم ملاحظات لتحسين المحتوى، يسعدنا تواصلك عبر البريد الإلكتروني:</p>

              <p className="mb-6">📧 contact@tfai.pro

</p>

            

              <p className="mb-6">📌 تنويه:<br/>
              لا نقدّم دعمًا فنيًا مباشرًا للأدوات.<br/>
              التواصل فقط لأغراض:<br/>
              • الرعاية الإعلانية<br/>
              • الاقتراحات<br/>
              • البلاغات المتعلقة بالمحتوى</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center">
          <div className="modern-card p-8">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
                🕒 آخر تحديث: ١٤ يوليو ٢٠٢٥
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/"
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="relative z-10">العودة للرئيسية</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <Link
                  href="/contact"
                  className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-indigo-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  تواصل معنا
                  <span className="inline-block mr-2 transition-transform group-hover:translate-x-1">←</span>
                </Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'اتصل بنا - TechnoFlash',
  description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
  keywords: 'اتصل بنا, تواصل, TechnoFlash, استفسارات, خدمات تقنية, دعم',
  openGraph: {
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    url: 'https://www.tfai.pro/contact',
    siteName: 'TechnoFlash', 
    images: [
      {
        url: 'https://www.tflash.site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - اتصل بنا',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اتصل بنا - TechnoFlash',
    description: 'تواصل مع فريق TechnoFlash للاستفسارات، الاقتراحات، أو طلب الخدمات التقنية المتخصصة.',
    images: ['https://www.tflash.site/og-image.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/10 to-purple-600/10"></div>
        </div>

        {/* عناصر هندسية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center">
            {/* شارة */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
              📄 صفحة معلومات
            </div>

            {/* العنوان الرئيسي */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              اتصل بنا
            </h1>

            {/* الوصف */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              تواصل معنا عبر البريد الإلكتروني للتعاون في مجال الذكاء الاصطناعي
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4">
        {/* Main Content */}
        <main className="mb-16">
          <div className="modern-card p-8 lg:p-12">
            <div className="prose prose-lg max-w-none text-right text-gray-800 leading-relaxed" style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
              <p className="mb-6">إذا كان لديك أي اقتراح، أو ترغب بالتواصل معنا بخصوص التعاون، الرعاية، أو تقديم ملاحظات لتحسين المحتوى، يسعدنا تواصلك عبر البريد الإلكتروني:</p>

              <p className="mb-6">📧 contect@tfai.pro </p>

             

              <p className="mb-6">📌 تنويه:<br/>
              لا نقدّم دعمًا فنيًا مباشرًا للأدوات.<br/>
              التواصل فقط لأغراض:<br/>
              • الرعاية الإعلانية<br/>
              • الاقتراحات<br/>
              • البلاغات المتعلقة بالمحتوى</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center">
          <div className="modern-card p-8">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
                🕒 آخر تحديث: ١٤ يوليو ٢٠٢٥
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/"
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="relative z-10">العودة للرئيسية</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <Link
                  href="/contact"
                  className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-indigo-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  تواصل معنا
                  <span className="inline-block mr-2 transition-transform group-hover:translate-x-1">←</span>
                </Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
