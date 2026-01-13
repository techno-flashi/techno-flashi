// مكون للتنقل السريع بين الصفحات
'use client';

import Link from 'next/link';
import { usePages } from '@/hooks/usePages';

interface QuickPageNavigationProps {
  currentPageKey?: string;
  className?: string;
  title?: string;
  showTitle?: boolean;
}

export function QuickPageNavigation({ 
  currentPageKey,
  className = '',
  title = 'صفحات مفيدة',
  showTitle = true
}: QuickPageNavigationProps) {
  const { pages, loading, error } = usePages();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-700 rounded w-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || pages.length === 0) {
    return null;
  }

  // تصفية الصفحة الحالية من القائمة
  const filteredPages = currentPageKey 
    ? pages.filter(page => page.page_key !== currentPageKey)
    : pages;

  if (filteredPages.length === 0) {
    return null;
  }

  return (
    <div className={`bg-dark-card rounded-lg p-6 border border-gray-800 ${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {title}
        </h3>
      )}
      
      <div className="space-y-3">
        {filteredPages.map((page) => (
          <Link
            key={page.id}
            href={`/page/${page.page_key}`}
            className="flex items-center text-dark-text-secondary hover:text-primary transition-colors duration-300 group"
          >
            <svg className="w-4 h-4 text-gray-500 group-hover:text-primary mr-2 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            {page.title_ar}
          </Link>
        ))}
      </div>
    </div>
  );
}

// مكون مخصص للشريط الجانبي
export function SidebarPageLinks({ currentPageKey, className = '' }: { currentPageKey?: string; className?: string }) {
  return (
    <QuickPageNavigation
      currentPageKey={currentPageKey}
      className={className}
      title="صفحات أخرى"
      showTitle={true}
    />
  );
}

// مكون مخصص لنهاية المقالات
export function ArticleFooterLinks({ className = '' }: { className?: string }) {
  const { getPageByKey } = usePages();
  
  const aboutPage = getPageByKey('about-us');
  const contactPage = getPageByKey('contact-us');

  return (
    <div className={`bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-4 text-center">
        هل أعجبك المحتوى؟
      </h3>
      <p className="text-dark-text-secondary text-center mb-6">
        تعرف على المزيد حول TechnoFlash أو تواصل معنا
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {aboutPage && (
          <Link
            href={`/page/${aboutPage.page_key}`}
            className="border border-gray-600 hover:border-primary text-white hover:text-primary px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-center"
          >
            {aboutPage.title_ar}
          </Link>
        )}
        
        {contactPage && (
          <Link
            href={`/page/${contactPage.page_key}`}
            className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-center"
          >
            {contactPage.title_ar}
          </Link>
        )}
      </div>
    </div>
  );
}
