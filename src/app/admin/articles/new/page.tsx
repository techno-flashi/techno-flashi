'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// صفحة إعادة توجيه من الرابط القديم إلى الجديد
export default function RedirectToNewPage() {
  const router = useRouter();

  useEffect(() => {
    // إعادة توجيه فورية إلى الصفحة الجديدة
    router.replace('/admin/articles/create');
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-white">جاري إعادة التوجيه إلى الصفحة الجديدة...</p>
      </div>
    </div>
  );
}
