'use client';

import { useEffect } from 'react';
import { trackArticleView } from '@/lib/gtag';

interface ArticleTrackerProps {
  articleTitle: string;
  articleSlug: string;
}

export default function ArticleTracker({ articleTitle, articleSlug }: ArticleTrackerProps) {
  useEffect(() => {
    // تتبع مشاهدة المقال
    trackArticleView(articleTitle);
    
    // تتبع وقت القراءة
    const startTime = Date.now();
    
    return () => {
      const readTime = Math.round((Date.now() - startTime) / 1000);
      if (readTime > 10) { // إذا قضى أكثر من 10 ثوان
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'article_read_time', {
            event_category: 'engagement',
            event_label: articleTitle,
            value: readTime,
          });
        }
      }
    };
  }, [articleTitle, articleSlug]);

  return null; // هذا المكون لا يعرض شيئاً، فقط يتتبع
}
