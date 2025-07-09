// Hook لجلب الصفحات من قاعدة البيانات
import { useState, useEffect } from 'react';

export interface PageLink {
  id: string;
  page_key: string;
  title_ar: string;
  is_active: boolean;
  display_order: number;
}

export function usePages() {
  const [pages, setPages] = useState<PageLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/pages');
        const result = await response.json();

        if (result.success) {
          // ترتيب الصفحات حسب display_order
          const sortedPages = result.data.sort((a: PageLink, b: PageLink) => 
            a.display_order - b.display_order
          );
          setPages(sortedPages);
        } else {
          setError(result.message || 'فشل في جلب الصفحات');
        }
      } catch (error) {
        console.error('خطأ في جلب الصفحات:', error);
        setError('حدث خطأ أثناء جلب الصفحات');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  // دالة للحصول على صفحة معينة
  const getPageByKey = (pageKey: string): PageLink | undefined => {
    return pages.find(page => page.page_key === pageKey && page.is_active);
  };

  // دالة للحصول على رابط الصفحة
  const getPageUrl = (pageKey: string): string => {
    return `/page/${pageKey}`;
  };

  // دالة للحصول على الصفحات النشطة فقط
  const getActivePages = (): PageLink[] => {
    return pages.filter(page => page.is_active);
  };

  return {
    pages: getActivePages(),
    allPages: pages,
    loading,
    error,
    getPageByKey,
    getPageUrl,
    getActivePages
  };
}
