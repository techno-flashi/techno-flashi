// هذا هو الملف الرئيسي الذي يلتف حول كل صفحات الموقع
// نضع فيه الأشياء المشتركة مثل الخطوط، الهيدر، الفوتر، ودعم اللغة العربية

import type { Metadata } from "next";
// استيراد الخطوط من جوجل للموقع التقني الحديث
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import "../styles/article-content.css";
import "../styles/admin-override.css";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { TechnoFlashHeaderBanner, TechnoFlashFooterBanner } from "@/components/ads/TechnoFlashBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ScrollTracker from "@/components/ScrollTracker";
import JsonLd, { websiteJsonLd, organizationJsonLd } from "@/components/JsonLd";
import { Toaster } from 'react-hot-toast';
import DynamicCodeInjection from "@/components/ads/DynamicCodeInjection";
import AdScriptLoader, { AdScriptDebugger, MonetagVerifier } from "@/components/ads/AdScriptLoader";
import AdvancedAdRenderer from "@/components/ads/AdvancedAdRenderer";

// إعداد الخطوط للموقع التقني الحديث
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: 'swap',
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
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`}>
      <head>
        {/* Dynamic Code Injection - HEAD START */}
        <DynamicCodeInjection position="head_start" />

        {/* Advanced Resource Hints for 99 Lighthouse Score */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://zgktrwpladrkhhemhnni.supabase.co" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Emergency: Only preload critical Arabic font */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6Hkvalr5TbCmxdt0UX8.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Prefetch next likely resources */}
        <link rel="prefetch" href="/ai-tools" />
        <link rel="prefetch" href="/articles" />



        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `
          }}
        />
        
        {/* Emergency Critical CSS - Minimal for 90+ score */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face{font-family:'Cairo';font-style:normal;font-weight:400;font-display:swap;src:url('https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6Hkvalr5TbCmxdt0UX8.woff2') format('woff2')}
            body{font-family:'Cairo',system-ui,sans-serif;font-display:swap;margin:0;padding:0}
            *{box-sizing:border-box}
            img{max-width:100%;height:auto;display:block}
            .header{height:80px;min-height:80px}
            @media (min-width:768px){.header{height:88px;min-height:88px}}
          `
        }} />

        {/* تم إزالة جميع سكريبتات الطرف الثالث الثقيلة لتحسين الأداء والـ SEO */}

        {/* Dynamic Code Injection - HEAD END */}
        <DynamicCodeInjection position="head_end" />
      </head>

      <body className="bg-white text-text-primary font-sans">
        {/* Dynamic Code Injection - BODY START */}
        <DynamicCodeInjection position="body_start" />

        {/* Advanced Ad Renderer - Header */}
        <AdvancedAdRenderer position="header" />

        <GoogleAnalytics />
        <ScrollTracker />
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <Toaster position="top-center" />

        <AuthProvider>
          <TechnoFlashHeaderBanner />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <TechnoFlashFooterBanner />
         <footer className="bg-dark-card border-t border-gray-800">
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* معلومات الموقع */}
      <div className="md:col-span-2">
        <div className="flex items-center space-x-3 space-x-reverse mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">TechnoFlash</h3>
            <p className="text-sm text-dark-text-secondary">بوابتك للمستقبل التقني</p>
          </div>
        </div>
        <p className="text-dark-text-secondary mb-4 leading-relaxed">
          منصة ويب متكاملة تقدم مقالات تقنية، ودليل لأدوات الذكاء الاصطناعي، وخدمات متخصصة لمساعدتك في رحلتك التقنية.
        </p>
      </div>

      {/* روابط سريعة */}
      <div>
        <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
        <ul className="space-y-2">
          <li><a href="/" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">الرئيسية</a></li>
          <li><a href="/articles" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">المقالات</a></li>
          <li><a href="/ai-tools" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">أدوات الذكاء الاصطناعي</a></li>
          <li><a href="/services" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">الخدمات</a></li>
        </ul>
      </div>

      {/* تواصل معنا */}
      <div>
        <h4 className="text-white font-semibold mb-4">تواصل معنا</h4>
        <ul className="space-y-2">
          <li><a href="/page/about-us" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">من نحن</a></li>
          <li><a href="/page/contact" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">اتصل بنا</a></li>
          <li><a href="/page/privacy-policy" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">سياسة الخصوصية</a></li>
          <li><a href="/page/terms-of-use" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">شروط الاستخدام</a></li>
          <li><a href="/page/services" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">الخدمات</a></li>
        </ul>
      </div>

      {/* وسائل التواصل الاجتماعي */}
      <div>
        <h4 className="text-white font-semibold mb-4">تابعنا</h4>
        <ul className="space-y-2">
          <li>
            <a
              href="http://www.youtube.com/@Techno_flash" // 👈 ضع رابط قناتك الصحيح هنا
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-text-secondary hover:text-red-400 transition-colors duration-300 flex items-center gap-2"
            >
              <span className="text-red-500">▶️</span>
              قناة اليوتيوب (19K+)
            </a>
          </li>
          <li>
            <a
              href="/youtube"
              className="text-dark-text-secondary hover:text-primary transition-colors duration-300 flex items-center gap-2"
            >
              <span className="text-blue-500">📺</span>
              صفحة القناة
            </a>
          </li>
          <li>
            <a
              href="mailto:i2s2mail22@gmail.com"
              className="text-dark-text-secondary hover:text-primary transition-colors duration-300 flex items-center gap-2"
            >
              <span className="text-green-500">📧</span>
              البريد الإلكتروني
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
      {/* روابط الصفحات الأساسية */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="/page/about-us" className="text-white/80 hover:text-primary transition-colors duration-300">من نحن</a>
          <span className="text-white/60">|</span>
          <a href="/page/contact" className="text-white/80 hover:text-primary transition-colors duration-300">اتصل بنا</a>
          <span className="text-white/60">|</span>
          <a href="/page/privacy-policy" className="text-white/80 hover:text-primary transition-colors duration-300">سياسة الخصوصية</a>
          <span className="text-white/60">|</span>
          <a href="/page/terms-of-use" className="text-white/80 hover:text-primary transition-colors duration-300">شروط الاستخدام</a>
          <span className="text-white/60">|</span>
          <a href="/page/services" className="text-white/80 hover:text-primary transition-colors duration-300">الخدمات</a>
          <span className="text-white/60">|</span>
          <a href="/youtube" className="text-white/80 hover:text-red-400 transition-colors duration-300">قناة اليوتيوب</a>
        </div>
      </div>

      <p className="text-white/70">
        © 2025 TechnoFlash. جميع الحقوق محفوظة.
      </p>
    </div>
  </div>
</footer>
        </AuthProvider>

        {/* Advanced Ad Renderer - Footer */}
        <AdvancedAdRenderer position="footer" />

        {/* Dynamic Code Injection - FOOTER */}
        <DynamicCodeInjection position="footer" />

        {/* Enhanced Ad Script Loader - Ensures proper script execution */}
        <AdScriptLoader position="footer" />
        <AdScriptLoader position="head_end" />

        {/* Ad Verification and Debug Components */}
        <AdScriptDebugger />
        <MonetagVerifier />
      </body>
    </html>
  );
}