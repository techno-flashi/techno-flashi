'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePages } from '@/hooks/usePages';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { getPageByKey, getPageUrl } = usePages();

  // الحصول على الصفحات المطلوبة
  const aboutPage = getPageByKey('about-us');
  const contactPage = getPageByKey('contact-us');

  return (
    <header className="bg-dark-background/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* الشعار */}
          <Link href="/" className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">TechnoFlash</h1>
              <p className="text-xs text-dark-text-secondary">بوابتك للمستقبل التقني</p>
            </div>
          </Link>

          {/* التنقل الرئيسي - سطح المكتب */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link
              href="/"
              className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
            >
              الرئيسية
            </Link>
            <Link
              href="/articles"
              className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
            >
              المقالات
            </Link>
            <Link
              href="/ai-tools"
              className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
            >
              أدوات الذكاء الاصطناعي
            </Link>
            <Link
              href="/services"
              className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
            >
              الخدمات
            </Link>
            {aboutPage && (
              <Link
                href={getPageUrl('about-us')}
                className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
              >
                {aboutPage.title_ar}
              </Link>
            )}
          </nav>

          {/* أزرار الإجراءات */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {contactPage && (
              <Link
                href={getPageUrl('contact-us')}
                className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
              >
                {contactPage.title_ar}
              </Link>
            )}

            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-b-2 border-primary"></div>
            ) : user ? (
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link
                  href="/admin"
                  className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-primary/25"
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={signOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300 font-medium"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : null}
          </div>

          {/* زر القائمة للهواتف */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                href="/articles"
                className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                المقالات
              </Link>
              <Link
                href="/ai-tools"
                className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                أدوات الذكاء الاصطناعي
              </Link>
              <Link
                href="/services"
                className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                الخدمات
              </Link>
              {aboutPage && (
                <Link
                  href={getPageUrl('about-us')}
                  className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {aboutPage.title_ar}
                </Link>
              )}
              {contactPage && (
                <Link
                  href={getPageUrl('contact-us')}
                  className="text-dark-text-secondary hover:text-white transition-colors duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {contactPage.title_ar}
                </Link>
              )}

            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
