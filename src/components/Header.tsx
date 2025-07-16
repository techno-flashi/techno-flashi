'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePages } from '@/hooks/usePages';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { getPageByKey, getPageUrl } = usePages();

  // الحصول على الصفحات المطلوبة
  const aboutPage = getPageByKey('about-us');
  const contactPage = getPageByKey('contact-us');

  // إغلاق القائمة عند تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <header className="bg-dark-background/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* الشعار */}
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 space-x-reverse hover:opacity-80 transition-opacity duration-300 focus-ring rounded-lg p-1"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg sm:text-xl">T</span>
            </div>
            <div className="hidden xs:block">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">TechnoFlash</div>
              <p className="text-xs text-dark-text-secondary hidden sm:block">بوابتك للمستقبل التقني</p>
            </div>
          </Link>

          {/* التنقل الرئيسي - سطح المكتب */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link
              href="/"
              className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium focus-ring rounded px-2 py-1 relative group"
            >
              الرئيسية
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/articles"
              className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium focus-ring rounded px-2 py-1 relative group"
            >
              المقالات
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="relative group">
              <Link
                href="/ai-tools"
                className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium focus-ring rounded px-2 py-1 relative group"
              >
                أدوات الذكاء الاصطناعي
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* قائمة فرعية للأدوات */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-dark-card border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link
                  href="/ai-tools/compare"
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-t-lg transition-colors"
                >
                  مقارنة الأدوات
                </Link>
                <Link
                  href="/ai-tools/categories"
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-b-lg transition-colors"
                >
                  فئات الأدوات
                </Link>
              </div>
            </div>
            <Link
              href="/services"
              className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium focus-ring rounded px-2 py-1 relative group"
            >
              الخدمات
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {aboutPage && (
              <Link
                href={getPageUrl('about-us')}
                className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium focus-ring rounded px-2 py-1 relative group"
              >
                {aboutPage.title_ar}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          {/* أزرار الإجراءات */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4 space-x-reverse">
            {contactPage && (
              <Link
                href={getPageUrl('contact-us')}
                className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium focus-ring rounded px-2 lg:px-3 py-2 relative group text-sm lg:text-base"
              >
                {contactPage.title_ar}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}

            {loading ? (
              <div className="w-6 h-6 lg:w-8 lg:h-8 animate-spin rounded-full border-b-2 border-primary" role="status" aria-label="جاري التحميل"></div>
            ) : user ? (
              <div className="flex items-center space-x-2 lg:space-x-4 space-x-reverse">
                <Link
                  href="/admin"
                  className="bg-primary hover:bg-blue-600 text-white px-3 lg:px-6 py-2 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-primary/25 focus-ring transform hover:scale-105 text-sm lg:text-base"
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={signOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 lg:px-6 py-2 rounded-lg transition-all duration-300 font-medium focus-ring transform hover:scale-105 text-sm lg:text-base"
                  aria-label="تسجيل الخروج من الحساب"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : null}
          </div>

          {/* زر القائمة للهواتف */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 focus-ring min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            className="md:hidden py-3 sm:py-4 border-t border-gray-800 bg-dark-background/98 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300"
          >
            <nav className="flex flex-col space-y-1 sm:space-y-2">
              <Link
                href="/"
                className="text-dark-text-secondary hover:text-white hover:bg-gray-800/50 transition-all duration-300 font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus-ring min-h-[44px] flex items-center text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                href="/articles"
                className="text-dark-text-secondary hover:text-white hover:bg-gray-800/50 transition-all duration-300 font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus-ring min-h-[44px] flex items-center text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                المقالات
              </Link>
              <Link
                href="/ai-tools"
                className="text-dark-text-secondary hover:text-white hover:bg-gray-800/50 transition-all duration-300 font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus-ring min-h-[44px] flex items-center text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                أدوات الذكاء الاصطناعي
              </Link>
              <Link
                href="/services"
                className="text-dark-text-secondary hover:text-white hover:bg-gray-800/50 transition-all duration-300 font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus-ring min-h-[44px] flex items-center text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                الخدمات
              </Link>
              {aboutPage && (
                <Link
                  href={getPageUrl('about-us')}
                  className="text-dark-text-secondary hover:text-white hover:bg-gray-800/50 transition-all duration-300 font-medium px-4 py-3 rounded-lg focus-ring"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {aboutPage.title_ar}
                </Link>
              )}
              {contactPage && (
                <Link
                  href={getPageUrl('contact-us')}
                  className="text-dark-text-secondary hover:text-white hover:bg-gray-800/50 transition-all duration-300 font-medium px-4 py-3 rounded-lg focus-ring"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {contactPage.title_ar}
                </Link>
              )}

              {/* أزرار الإجراءات للموبايل */}
              {user && (
                <div className="pt-4 mt-4 border-t border-gray-700 space-y-2">
                  <Link
                    href="/admin"
                    className="bg-primary hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-all duration-300 font-medium block text-center focus-ring"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all duration-300 font-medium w-full focus-ring"
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
