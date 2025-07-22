// هذا هو الملف الرئيسي الذي يلتف حول كل صفحات الموقع
// نضع فيه الأشياء المشتركة مثل الخطوط، الهيدر، الفوتر، ودعم اللغة العربية

import type { Metadata } from "next";
import { Cairo } from 'next/font/google';
// الخطوط المحلية - لا حاجة لاستيراد من Google Fonts
import "./globals.css";
import "../styles/article-content.css";
import "../styles/admin-override.css";
import "../styles/interactive-effects.css";
import { ProfessionalHeader } from "@/components/ProfessionalHeader";
import { AuthProvider } from "@/contexts/AuthContext";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import ScrollTracker from "@/components/ScrollTracker";
import JsonLd, { websiteJsonLd, organizationJsonLd } from "@/components/JsonLd";
import { Toaster } from 'react-hot-toast';



// إعداد خط Cairo باستخدام Next.js Font Optimization
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-cairo',
  fallback: ['Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
});



// إعداد بيانات SEO المحسنة للموقع (هذا الجزء ممتاز ولا يحتاج تعديل)
export const metadata: Metadata = {
  title: {
    default: "TechnoFlash | أدوات ذكاء اصطناعي وتقنية حديثة",
    template: "%s | TechnoFlash",
  },
  description: "منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة في عالم البرمجة والتكنولوجيا. اكتشف أحدث التقنيات والأدوات المبتكرة.",
  keywords: [
    "تقنية", "ذكاء اصطناعي", "برمجة", "Next.js", "Supabase",
    "أخبار تقنية", "أدوات AI", "تطوير ويب", "تكنولوجيا",
    "مقالات تقنية", "خدمات برمجة", "حلول رقمية"
  ],
  authors: [{ name: 'TechnoFlash Team' }],
  creator: 'TechnoFlash',
  publisher: 'TechnoFlash',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://www.tflash.site',
    siteName: 'TechnoFlash',
    title: 'TechnoFlash | بوابتك للمستقبل التقني',
    description: 'منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة في عالم البرمجة والتكنولوجيا.',
    images: [
      {
        url: 'https://www.tflash.site/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - بوابتك للمستقبل التقني',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechnoFlash | بوابتك للمستقبل التقني',
    description: 'منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة.',
    images: ['https://www.tflash.site/og-image.jpg'],
  },

  verification: {
    google: '717743998652694e',
    other: {
      'msvalidate.01': '9095C91643DF2A9AE8095A2816651511',
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icon-192x192.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>




        {/* Font optimization handled by Next.js */}

        {/* Advanced Resource Hints for Performance */}
        <link rel="preconnect" href="https://zgktrwpladrkhhemhnni.supabase.co" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Prefetch next likely resources */}
        <link rel="prefetch" href="/ai-tools" />
        <link rel="prefetch" href="/articles" />




        
        {/* Critical CSS - Minimal for Performance */}
        <style dangerouslySetInnerHTML={{
          __html: `
            *{box-sizing:border-box}
            body{
              font-family:'Cairo',system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
              margin:0;
              padding:0;
              line-height:1.6;
              font-display:swap;
            }
            img{max-width:100%;height:auto;display:block}
            .header{height:80px;min-height:80px}
            @media (min-width:768px){.header{height:88px;min-height:88px}}
            .loading{opacity:0.7;pointer-events:none}
          `
        }} />

        {/* تم إزالة جميع سكريبتات الطرف الثالث الثقيلة لتحسين الأداء والـ SEO */}


      </head>

      <body className={`${cairo.variable} bg-white text-text-primary font-sans`} suppressHydrationWarning={true}>




        <GoogleAnalytics />
        <ScrollTracker />
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <Toaster position="top-center" />

        <AuthProvider>
          <ProfessionalHeader />
          <main className="min-h-screen">
            {children}
          </main>
         <footer className="bg-neutral-100 border-t border-neutral-200">
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* معلومات الموقع */}
      <div className="md:col-span-2">
        <div className="flex items-center space-x-3 space-x-reverse mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">TechnoFlash</h3>
            <p className="text-sm text-neutral-600">بوابتك للمستقبل التقني</p>
          </div>
        </div>
        <p className="text-neutral-600 mb-4 leading-relaxed">
          منصة ويب متكاملة تقدم مقالات تقنية، ودليل لأدوات الذكاء الاصطناعي، وخدمات متخصصة لمساعدتك في رحلتك التقنية.
        </p>
      </div>

      {/* روابط سريعة */}
      <div>
        <h4 className="text-neutral-900 font-semibold mb-3">روابط سريعة</h4>
        <ul className="space-y-2">
          <li><a href="/" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">الرئيسية</a></li>
          <li><a href="/articles" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">المقالات</a></li>
          <li><a href="/ai-tools" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">أدوات الذكاء الاصطناعي</a></li>
          <li><a href="/services" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">الخدمات</a></li>
        </ul>
      </div>

      {/* تواصل معنا */}
      <div>
        <h4 className="text-neutral-900 font-semibold mb-3">تواصل معنا</h4>
        <ul className="space-y-2">
          <li><a href="/page/about-us" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">من نحن</a></li>
          <li><a href="/page/contact" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">اتصل بنا</a></li>
          <li><a href="/page/privacy-policy" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">سياسة الخصوصية</a></li>
          <li><a href="/page/terms-of-use" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">شروط الاستخدام</a></li>
          <li><a href="/page/services" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">الخدمات</a></li>
        </ul>
      </div>

      {/* وسائل التواصل الاجتماعي */}
      <div>
        <h4 className="text-neutral-900 font-semibold mb-3">تابعنا</h4>
        <ul className="space-y-2">
          <li>
            <a
              href="http://www.youtube.com/@Techno_flash" // 👈 ضع رابط قناتك الصحيح هنا
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-red-600 transition-colors duration-300 flex items-center gap-2"
            >
              <span className="text-red-500">▶️</span>
              قناة اليوتيوب (19K+)
            </a>
          </li>
          <li>
            <a
              href="/youtube"
              className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2"
            >
              <span className="text-blue-500">📺</span>
              صفحة القناة
            </a>
          </li>
          <li>
            <a
              href="mailto:i2s2mail22@gmail.com"
              className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 flex items-center gap-2"
            >
              <span className="text-green-500">📧</span>
              البريد الإلكتروني
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-neutral-300 mt-6 pt-6 text-center">
      {/* روابط الصفحات الأساسية */}
      <div className="mb-4">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="/page/about-us" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">من نحن</a>
          <span className="text-neutral-400">|</span>
          <a href="/page/contact" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">اتصل بنا</a>
          <span className="text-neutral-400">|</span>
          <a href="/page/privacy-policy" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">سياسة الخصوصية</a>
          <span className="text-neutral-400">|</span>
          <a href="/page/terms-of-use" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">شروط الاستخدام</a>
          <span className="text-neutral-400">|</span>
          <a href="/page/services" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300">الخدمات</a>
          <span className="text-neutral-400">|</span>
          <a href="/youtube" className="text-neutral-600 hover:text-red-600 transition-colors duration-300">قناة اليوتيوب</a>
        </div>
      </div>

      <p className="text-neutral-500">
        © 2025 TechnoFlash. جميع الحقوق محفوظة.
      </p>
    </div>
  </div>
</footer>
        </AuthProvider>




      </body>
    </html>
  );
}