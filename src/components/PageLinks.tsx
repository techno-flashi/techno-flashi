// مكون لعرض روابط الصفحات الديناميكية
'use client';

import Link from 'next/link';
import { usePages } from '@/hooks/usePages';

interface PageLinksProps {
  variant?: 'horizontal' | 'vertical' | 'footer';
  className?: string;
  showAll?: boolean;
  excludeKeys?: string[];
  includeKeys?: string[];
}

export function PageLinks({ 
  variant = 'horizontal', 
  className = '',
  showAll = true,
  excludeKeys = [],
  includeKeys = []
}: PageLinksProps) {
  const { pages, loading, error } = usePages();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-700 rounded w-20"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('خطأ في تحميل الصفحات:', error);
    return null;
  }

  // تصفية الصفحات حسب المعايير
  let filteredPages = pages;

  if (includeKeys.length > 0) {
    filteredPages = pages.filter(page => includeKeys.includes(page.page_key));
  } else if (excludeKeys.length > 0) {
    filteredPages = pages.filter(page => !excludeKeys.includes(page.page_key));
  }

  if (!showAll) {
    filteredPages = filteredPages.slice(0, 4); // عرض أول 4 صفحات فقط
  }

  // تحديد أنماط CSS حسب النوع
  const getContainerClass = () => {
    switch (variant) {
      case 'vertical':
        return 'flex flex-col space-y-2';
      case 'footer':
        return 'grid grid-cols-2 md:grid-cols-4 gap-4';
      default:
        return 'flex flex-wrap gap-4 md:gap-6';
    }
  };

  const getLinkClass = () => {
    switch (variant) {
      case 'footer':
        return 'text-dark-text-secondary hover:text-primary transition-colors duration-300 text-sm';
      case 'vertical':
        return 'text-white hover:text-primary transition-colors duration-300 py-1';
      default:
        return 'text-white hover:text-primary transition-colors duration-300 font-medium';
    }
  };

  if (filteredPages.length === 0) {
    return null;
  }

  return (
    <div className={`${getContainerClass()} ${className}`}>
      {filteredPages.map((page) => (
        <Link
          key={page.id}
          href={`/page/${page.page_key}`}
          className={getLinkClass()}
        >
          {page.title_ar}
        </Link>
      ))}
    </div>
  );
}

// مكون مخصص لروابط الفوتر
export function FooterPageLinks({ className = '' }: { className?: string }) {
  return (
    <PageLinks
      variant="footer"
      className={className}
      showAll={true}
    />
  );
}

// مكون مخصص لروابط الهيدر
export function HeaderPageLinks({ className = '' }: { className?: string }) {
  return (
    <PageLinks
      variant="horizontal"
      className={className}
      includeKeys={['about-us', 'contact']} // عرض صفحتين فقط في الهيدر
    />
  );
}

// مكون مخصص لروابط سريعة
export function QuickPageLinks({ className = '' }: { className?: string }) {
  return (
    <PageLinks
      variant="vertical"
      className={className}
      includeKeys={['about-us', 'contact-us', 'privacy-policy', 'terms-of-use']}
    />
  );
}
