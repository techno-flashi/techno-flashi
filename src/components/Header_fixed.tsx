'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import PromoAd from './PromoAd';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // تأثير لظل الهيدر عند التمرير مع دعم الثيم الفاتح
  const [headerClass, setHeaderClass] = useState("bg-white/90 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b border-gray-200");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHeaderClass("bg-white/95 backdrop-blur-lg sticky top-0 z-50 shadow-lg border-b border-gray-300 transition-all duration-300");
      } else {
        setHeaderClass("bg-white/90 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b border-gray-200 transition-all duration-300");
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تأثير لإغلاق القائمة عند الضغط على زر Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
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
    <header className={headerClass}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
            <span className="bg-gradient-to-br from-purple-600 to-pink-500 text-white font-bold text-2xl rounded-md p-2 group-hover:scale-110 transition-transform duration-300">T</span>
            <span className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">TechnoFlash</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-semibold">🏠 الرئيسية</Link>
            <Link href="/articles" className="text-gray-700 hover:text-purple-600 transition-colors">📰 أحدث المقالات</Link>
            <Link href="/ai-tools" className="text-gray-700 hover:text-purple-600 transition-colors">🤖 أدوات الذكاء الاصطناعي</Link>
            <Link href="/services" className="text-gray-700 hover:text-purple-600 transition-colors">⚙️ الخدمات</Link>
          </div>

          {/* Contact Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link href="/contact" className="hidden sm:block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105">
              📞 اتصل بنا
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="block py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 الرئيسية
              </Link>
              <Link 
                href="/articles" 
                className="block py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📰 أحدث المقالات
              </Link>
              <Link 
                href="/ai-tools" 
                className="block py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🤖 أدوات الذكاء الاصطناعي
              </Link>
              <Link 
                href="/services" 
                className="block py-3 px-4 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ⚙️ الخدمات
              </Link>
              <Link 
                href="/contact" 
                className="block py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all text-center font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                📞 اتصل بنا
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* إعلان في أعلى الصفحة */}
      <div className="border-t border-gray-200">
        <PromoAd type="hostinger" />
      </div>
    </header>
  )
}