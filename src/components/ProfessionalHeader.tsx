'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';


export function ProfessionalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navigationItems = [
    { href: '/', label: 'الرئيسية', icon: '🏠' },
    { href: '/articles', label: 'المقالات', icon: '📰' },
    { href: '/ai-tools', label: 'أدوات الذكاء الاصطناعي', icon: '🤖' },
    { href: '/services', label: 'الخدمات', icon: '⚙️' },
    { href: '/about', label: 'من نحن', icon: '👥' },
    { href: '/contact', label: 'اتصل بنا', icon: '📞' },
  ];

  return (
    <>
      <header className={`header header-interactive gradient-bg-interactive gpu-accelerated ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-icon">
              <span>ت</span>
            </div>
            <div className="logo-text">
              <div className="logo-title">تكنو فلاش</div>
              <p className="logo-subtitle">أحدث أخبار التكنولوجيا</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link header-link gpu-accelerated"
              >
                <span className="ml-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <button className="btn btn-ghost btn-sm user-menu interactive-shadow gpu-accelerated">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden lg:inline">بحث</span>
            </button>

            {/* User Menu */}
            {!loading && (
              <div className="user-menu">
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link href="/admin" className="btn btn-outline btn-sm interactive-shadow gpu-accelerated">
                      لوحة التحكم
                    </Link>
                    <button
                      onClick={signOut}
                      className="btn btn-ghost btn-sm text-error interactive-shadow gpu-accelerated"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`mobile-menu-toggle ${isMenuOpen ? 'open' : ''}`}
              aria-label="فتح القائمة"
            >
              <div className="mobile-menu-icon">
                <span className="mobile-menu-line"></span>
                <span className="mobile-menu-line"></span>
                <span className="mobile-menu-line"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay lg:hidden">
          <div 
            className="absolute inset-0"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="mobile-menu-panel">
            <div className="mobile-menu-content">
              <nav className="mobile-nav">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-nav-link"
                  >
                    <span className="mobile-nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile User Menu */}
                <div className="mobile-user-menu">
                  {!loading && (
                    <>
                      {user ? (
                        <div className="flex flex-col gap-2">
                          <Link 
                            href="/admin"
                            onClick={() => setIsMenuOpen(false)}
                            className="mobile-nav-link"
                          >
                            <span className="mobile-nav-icon">⚙️</span>
                            لوحة التحكم
                          </Link>
                          <button 
                            onClick={() => {
                              signOut();
                              setIsMenuOpen(false);
                            }}
                            className="mobile-nav-link text-error"
                          >
                            <span className="mobile-nav-icon">🚪</span>
                            تسجيل الخروج
                          </button>
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
