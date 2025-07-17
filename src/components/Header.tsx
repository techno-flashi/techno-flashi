'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePages } from '@/hooks/usePages';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { getPageByKey, getPageUrl } = usePages();

  // الكلاس الافتراضي الذي يعرضه الخادم (ثابت)
  const initialClass = "bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50";
  // الكلاس الذي يطبق بعد السكرول في المتصفح (نفس الأساس مع إضافات)
  const scrolledClass = "bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-lg";

  const [headerClass, setHeaderClass] = useState(initialClass);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderClass(window.scrollY > 10 ? scrolledClass : initialClass);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // المصفوفة الفارغة [] تضمن أن هذا الكود يعمل مرة واحدة فقط بعد العرض الأولي

  // الحصول على الصفحات المطلوبة
  const aboutPage = getPageByKey('about-us');
  const contactPage = getPageByKey('contact-us');

  // إغلاق القائمة عند الضغط على Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // منع التمرير عند فتح القائمة
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className={headerClass} suppressHydrationWarning>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* الشعار المحدث */}
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 space-x-reverse hover:opacity-80 transition-opacity duration-300 rounded-lg p-1"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">T</span>
            </div>
            <div className="hidden xs:block">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">TechnoFlash</div>
              <p className="text-xs text-gray-600 hidden sm:block">بوابتك للمستقبل التقني</p>
            </div>
          </Link>

          {/* التنقل الرئيسي المحدث - سطح المكتب */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse" suppressHydrationWarning>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium rounded-lg px-3 py-2 relative group"
            >
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              الرئيسية
            </Link>
            <Link
              href="/articles"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium rounded-lg px-3 py-2 relative group"
            >
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              المقالات
            </Link>

            <Link
              href="/services"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium rounded-lg px-3 py-2 relative group"
            >
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              الخدمات
            </Link>
            {aboutPage && (
              <Link
                href={getPageUrl('about-us')}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium rounded-lg px-3 py-2 relative group"
              >
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                {aboutPage.title_ar}
              </Link>
            )}
          </nav>

          {/* أزرار الإجراءات */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 space-x-reverse">
            <Link
              href="/contact"
              className="text-gray-600 hover:text-black transition-colors duration-300 font-medium rounded px-2 lg:px-3 py-2 relative group text-sm lg:text-base"
            >
              تواصل معنا
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* عرض معلومات المستخدم فقط بعد التحميل الكامل */}
            {!loading && user ? (
              <div className="flex items-center space-x-2 lg:space-x-4 space-x-reverse" suppressHydrationWarning>
                <Link
                  href="/admin"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 lg:px-6 py-2 text-sm lg:text-base rounded-lg transition-colors duration-300 font-medium"
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={signOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 lg:px-6 py-2 rounded-lg transition-colors duration-300 font-medium text-sm lg:text-base"
                  aria-label="تسجيل الخروج من الحساب"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : null}
          </div>

          {/* زر القائمة المحدث للهواتف */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-colors duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* القائمة المنسدلة للهواتف */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden py-3 sm:py-4 border-t border-light-border bg-white/98 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300"
            suppressHydrationWarning
          >
            <nav className="flex flex-col space-y-1 sm:space-y-2">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300 font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-lg min-h-[44px] flex items-center text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                href="/articles"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300 font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-lg min-h-[44px] flex items-center text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                المقالات
              </Link>

              <Link
                href="/services"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300 font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-lg min-h-[44px] flex items-center text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                الخدمات
              </Link>
              {aboutPage && (
                <Link
                  href={getPageUrl('about-us')}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300 font-medium px-4 py-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {aboutPage.title_ar}
                </Link>
              )}
              <Link
                href="/contact"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300 font-medium px-4 py-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                تواصل معنا
              </Link>

              {/* أزرار الإجراءات للموبايل */}
              {!loading && user && (
                <div className="pt-4 mt-4 border-t border-gray-700 space-y-2">
                  <Link
                    href="/admin"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-300 font-medium block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors duration-300 font-medium w-full"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
