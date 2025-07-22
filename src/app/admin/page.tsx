'use client';

// صفحة لوحة التحكم الرئيسية
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="admin-container bg-dark-background min-h-screen" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>أهلاً بك في لوحة التحكم</h1>
          <button
            onClick={signOut}
            className="px-4 py-2 font-bold bg-red-600 rounded-md hover:bg-red-700"
            style={{ color: '#ffffff' }}
          >
            تسجيل الخروج
          </button>
        </div>

        {isClient && user && (
          <p style={{ color: '#000000' }}>
            تم تسجيل دخولك بنجاح باستخدام البريد الإلكتروني: {user.email}
          </p>
        )}
        <p className="mt-4" style={{ color: '#000000' }}>
          من هنا يمكنك إدارة المقالات والأدوات والخدمات والصفحات.
        </p>

        {/* لوحة التحكم السريعة */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Link
            href="/admin/articles"
            className="bg-white p-6 rounded-lg border border-gray-300 hover:border-blue-500 transition-all duration-300 text-center group"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📝</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>المقالات</h3>
            <p className="text-sm" style={{ color: '#666666' }}>إدارة المقالات والمحتوى</p>
          </Link>

          <Link
            href="/admin/ai-tools"
            className="bg-white p-6 rounded-lg border border-gray-300 hover:border-blue-500 transition-all duration-300 text-center group"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🤖</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>أدوات الذكاء الاصطناعي</h3>
            <p className="text-sm" style={{ color: '#666666' }}>إدارة أدوات الذكاء الاصطناعي</p>
          </Link>

          <Link
            href="/admin/services"
            className="bg-white p-6 rounded-lg border border-gray-300 hover:border-blue-500 transition-all duration-300 text-center group"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🛠️</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>الخدمات</h3>
            <p className="text-sm" style={{ color: '#666666' }}>إدارة الخدمات المقدمة</p>
          </Link>



          <Link
            href="/admin/pages"
            className="bg-white p-6 rounded-lg border border-gray-300 hover:border-blue-500 transition-all duration-300 text-center group"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📄</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>الصفحات</h3>
            <p className="text-sm" style={{ color: '#666666' }}>إدارة الصفحات الثابتة</p>
          </Link>

          <Link
            href="/admin/media"
            className="bg-white p-6 rounded-lg border border-gray-300 hover:border-blue-500 transition-all duration-300 text-center group"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🖼️</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>الوسائط</h3>
            <p className="text-sm" style={{ color: '#666666' }}>رفع الصور وإدارة الفيديوهات</p>
          </Link>


        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
