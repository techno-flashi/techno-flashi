"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // إذا لم يكن هناك مستخدم، اذهب لصفحة الدخول
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-dark-text-secondary">جاري التحقق من صلاحيات الوصول...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // لا تعرض شيئًا أثناء إعادة التوجيه
  }

  return <>{children}</>;
}
