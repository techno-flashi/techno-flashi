// هذا هو الملف الرئيسي الذي يلتف حول كل صفحات الموقع
// نضع فيه الأشياء المشتركة مثل الخطوط، الهيدر، الفوتر، ودعم اللغة العربية

import type { Metadata } from "next";
// استيراد الخطوط من جوجل
import { Inter } from "next/font/google";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { TechnoFlashHeaderBanner, TechnoFlashFooterBanner } from "@/components/ads/TechnoFlashBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
// import GoogleAnalyticsTracker from "@/components/GoogleAnalyticsTracker";
import ScrollTracker from "@/components/ScrollTracker";
import JsonLd, { websiteJsonLd, organizationJsonLd } from "@/components/JsonLd";
import { Toaster } from 'react-hot-toast';
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { AccessibilityHelper } from "@/components/AccessibilityHelper";
import HydrationFix, { SuppressHydrationWarning } from "@/components/HydrationFix";
import { DevHydrationSuppressor } from "@/components/HydrationSafeWrapper";
import AdSenseScript, { InitializeAdSense } from "@/components/AdSenseScript";

// إعداد الخطوط
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-tajawal",
});

// إعداد بيانات SEO المحسنة للموقع
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
  alternates: {
    canonical: 'https://www.tflash.site',
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
    // إضافة dir="rtl" لدعم اللغة العربية بشكل كامل
    <html lang="ar" dir="rtl" className={`${inter.variable} ${tajawal.variable}`}>
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://zgktrwpladrkhhemhnni.supabase.co" />

        {/* Ezoic Privacy Scripts - Must be loaded first for compliance */}
        <script
          src="https://cmp.gatekeeperconsent.com/min.js"
          data-cfasync="false"
        />
        <script
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          data-cfasync="false"
        />

        {/* Ezoic Header Script - Main ad system initialization */}
        <script
          async
          src="//www.ezojs.com/ezoic/sa.min.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
            `,
          }}
        />
      </head>

      {/* تم استخدام أسماء الألوان والخطوط من ملف tailwind.config.ts لتوحيد التصميم */}
      <body className="bg-white text-gray-900 font-sans">
        <GoogleAnalytics />
        <AdSenseScript publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-YOUR_PUBLISHER_ID"} />
        <InitializeAdSense publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-YOUR_PUBLISHER_ID"} />
        {/* <GoogleAnalyticsTracker /> */}
        <ScrollTracker />
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1F2937',
              color: '#F9FAFB',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'var(--font-tajawal)',
              direction: 'rtl'
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#F9FAFB',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#F9FAFB',
              },
            },
          }}
        />
        {/* هنا الحل! نضع AuthProvider ليغلف كل شيء */}
        <SuppressHydrationWarning>
        <AuthProvider>
          {/* إعلان الهيدر المتحرك */}
          <TechnoFlashHeaderBanner />

          <Header />

          <main className="min-h-screen">
            {children}
          </main>

        {/* إعلان الفوتر المتحرك */}
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
                      href="https://www.youtube.com/@Techno_flash"
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
                  <a href="/page/about-us" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">من نحن</a>
                  <span className="text-gray-600">|</span>
                  <a href="/page/contact" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">اتصل بنا</a>
                  <span className="text-gray-600">|</span>
                  <a href="/page/privacy-policy" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">سياسة الخصوصية</a>
                  <span className="text-gray-600">|</span>
                  <a href="/page/terms-of-use" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">شروط الاستخدام</a>
                  <span className="text-gray-600">|</span>
                  <a href="/page/services" className="text-dark-text-secondary hover:text-primary transition-colors duration-300">الخدمات</a>
                  <span className="text-gray-600">|</span>
                  <a href="/youtube" className="text-dark-text-secondary hover:text-red-400 transition-colors duration-300">قناة اليوتيوب</a>
                </div>
              </div>

              <p className="text-dark-text-secondary">
                © 2025 TechnoFlash. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </footer>
        </AuthProvider>
        </SuppressHydrationWarning>

        {/* مكونات تحسين الأداء وإمكانية الوصول */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <PerformanceMonitor showDebugInfo={true} />
            <AccessibilityHelper enabled={true} />
          </>
        )}

        {/* إصلاح مشاكل الـ hydration */}
        <HydrationFix />
        <DevHydrationSuppressor />
      </body>
    </html>
  );
}
