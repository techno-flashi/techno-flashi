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
import JsonLd, { websiteJsonLd } from "@/components/JsonLd";
import { Toaster } from 'react-hot-toast';

// إعداد خط Cairo باستخدام Next.js Font Optimization
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-cairo',
  fallback: ['Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
});

// إعداد بيانات SEO المحسنة للموقع مع إصلاح ترميز UTF-8
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
  metadataBase: new URL('https://www.tflash.site'),
  alternates: {
    canonical: 'https://www.tflash.site',
  },
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
    locale: 'ar_EG',
    url: 'https://www.tflash.site',
    siteName: 'TechnoFlash',
    title: 'TechnoFlash | بوابتك للمستقبل التقني',
    description: 'منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة في عالم البرمجة والتكنولوجيا.',
    images: [
      {
        url: 'https://www.tflash.site/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'TechnoFlash - بوابتك للمستقبل التقني',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@technoflash',
    creator: '@technoflash',
    title: 'TechnoFlash | بوابتك للمستقبل التقني',
    description: 'منصة ويب متكاملة تقدم مقالات تقنية حصرية، ودليل شامل لأدوات الذكاء الاصطناعي، وخدمات متخصصة.',
    images: ['https://www.tflash.site/og-image.svg'],
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
        {/* Ensure UTF-8 encoding for proper Arabic text display */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

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
        <Toaster position="top-center" />

        <AuthProvider>
          <ProfessionalHeader />
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* بداية الفوتر الجديد */}
          <footer className="bg-neutral-100 border-t border-neutral-200">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* معلومات الموقع */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-2xl">T</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-900">TechnoFlash</h3>
                      <p className="text-sm text-neutral-600">بوابتك للمستقبل التقني</p>
                    </div>
                  </div>
                  <p className="text-neutral-600 leading-relaxed max-w-md">
                    منصة ويب متكاملة تقدم مقالات تقنية، ودليل لأدوات الذكاء الاصطناعي، وخدمات متخصصة لمساعدتك في رحلتك التقنية.
                  </p>
                </div>

                {/* روابط سريعة */}
                <div>
                  <h4 className="text-neutral-900 font-semibold mb-4 text-lg">روابط سريعة</h4>
                  <ul className="space-y-3">
                    <li><a href="/" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 block py-1">الرئيسية</a></li>
                    <li><a href="/articles" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 block py-1">المقالات</a></li>
                    <li><a href="/ai-tools" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 block py-1">أدوات الذكاء الاصطناعي</a></li>
                    <li><a href="/services" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 block py-1">الخدمات</a></li>
                  </ul>
                </div>

                {/* تواصل معنا */}
                <div>
                  <h4 className="text-neutral-900 font-semibold mb-4 text-lg">تواصل معنا</h4>
                  <ul className="space-y-3">
                    <li><a href="/contact" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 block py-1">اتصل بنا</a></li>
                    <li><a href="/privacy-policy" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 block py-1">سياسة الخصوصية</a></li>
                    <li><a href="/terms-of-use" className="text-neutral-600 hover:text-primary-600 transition-colors duration-300 block py-1">شروط الاستخدام</a></li>
                  </ul>
                </div>
              </div>

              <hr className="my-8 border-neutral-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* وسائل التواصل الاجتماعي */}
                <div>
                  <h4 className="text-neutral-900 font-semibold mb-4 text-lg text-center md:text-right">تابعنا على المنصات</h4>
                  <ul className="flex flex-wrap justify-center md:justify-start gap-4">
                    {/* يوتيوب */}
                    <li>
                      <a href="http://www.youtube.com/@TechnoFlashAITech" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-red-600 hover:bg-red-50 block group" aria-label="يوتيوب">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                      </a>
                    </li>
                    {/* فيسبوك */}
                    <li>
                      <a href="https://www.facebook.com/people/%D8%AA%D9%83%D9%86%D9%88%D9%81%D9%84%D8%A7%D8%B4-%D8%B0%D9%83%D8%A7%D8%A1-%D8%B5%D9%86%D8%A7%D8%B9%D9%8A-%D9%88%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D9%8A%D9%88%D9%85%D9%8A%D8%A9/61578726568961/" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-blue-600 hover:bg-blue-50 block group" aria-label="فيسبوك">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                      </a>
                    </li>
                    {/* منصة X */}
                    <li>
                      <a href="https://x.com/TflashDev" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-black hover:bg-neutral-100 block group" aria-label="منصة X">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                      </a>
                    </li>
                     {/* إنستجرام */}
                    <li>
                      <a href="https://www.instagram.com/ali23wed/" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-pink-600 hover:bg-pink-50 block group" aria-label="إنستجرام">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.851 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.851.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </a>
                    </li>
                     {/* تيك توك */}
                    <li>
                      <a href="https://www.tiktok.com/@technoflashaitech" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-black hover:bg-neutral-100 block group" aria-label="تيك توك">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.76v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.14c0 3.49-2.89 6.33-6.38 6.33-3.49 0-6.38-2.84-6.38-6.33 0-3.49 2.89-6.33 6.38-6.33 1.1 0 2.15.28 3.09.82v4.15c-.48-.24-1.03-.37-1.6-.37-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c1.93 0 3.5-1.57 3.5-3.5V4.35c0-1.36-.48-2.63-1.37-3.66-.9-1.03-2.15-1.64-3.53-1.72l1.21 1.05z"/></svg>
                      </a>
                    </li>
                     {/* تيليجرام */}
                    <li>
                      <a href="https://t.me/tecnflash" target="_blank" rel="noopener noreferrer" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-blue-500 hover:bg-blue-50 block group" aria-label="تيليجرام">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                      </a>
                    </li>
                     {/* البريد الإلكتروني */}
                    <li>
                      <a href="mailto:contact@tfai.pro" className="bg-white p-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-green-600 hover:bg-green-50 block group" aria-label="البريد الإلكتروني">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                      </a>
                    </li>
                  </ul>
                </div>
                
                {/* حقوق النشر */}
                <div className="text-center md:text-left">
                  <p className="text-neutral-500 text-sm">
                    © {new Date().getFullYear()} TechnoFlash. جميع الحقوق محفوظة.
                  </p>
                   <p className="text-neutral-400 text-xs mt-2">
                    صُمم وطُوّر بواسطة <a href="https://www.youtube.com/@TechnoFlashAITech" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">TflashDev</a>
                  </p>
                </div>

              </div>
            </div>
          </footer>
          {/* نهاية الفوتر الجديد */}

        </AuthProvider>

      </body>
    </html>
  );
}
