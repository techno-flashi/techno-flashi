'use client';

// صفحة لوحة التحكم الرئيسية
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Link from 'next/link';

function AdminDashboard() {
  const { user, signOut } = useAuth(); // استدعاء وظيفة الخروج من المصدر المركزي

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">أهلاً بك في لوحة التحكم</h1>
        <button
          onClick={signOut}
          className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          تسجيل الخروج
        </button>
      </div>

      {user && <p>تم تسجيل دخولك بنجاح باستخدام البريد الإلكتروني: {user.email}</p>}
      <p className="mt-4">من هنا يمكنك إدارة المقالات والأدوات والخدمات والإعلانات.</p>

      {/* لوحة التحكم السريعة */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Link
          href="/admin/articles"
          className="bg-dark-card p-6 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 text-center group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📝</div>
          <h3 className="text-lg font-semibold text-white mb-2">المقالات</h3>
          <p className="text-white/70 text-sm">إدارة المقالات والمحتوى</p>
        </Link>

        <Link
          href="/admin/ai-tools"
          className="bg-dark-card p-6 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 text-center group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🤖</div>
          <h3 className="text-lg font-semibold text-white mb-2">أدوات الذكاء الاصطناعي</h3>
          <p className="text-white/70 text-sm">إدارة أدوات الذكاء الاصطناعي</p>
        </Link>

        <Link
          href="/admin/services"
          className="bg-dark-card p-6 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 text-center group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🛠️</div>
          <h3 className="text-lg font-semibold text-white mb-2">الخدمات</h3>
          <p className="text-white/70 text-sm">إدارة الخدمات المقدمة</p>
        </Link>

        <Link
          href="/admin/ads"
          className="bg-dark-card p-6 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 text-center group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📢</div>
          <h3 className="text-lg font-semibold text-white mb-2">الإعلانات العامة</h3>
          <p className="text-white/70 text-sm">إدارة الإعلانات والحملات العامة</p>
        </Link>

        <Link
          href="/admin/ads/ai-tools"
          className="bg-dark-card p-6 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 text-center group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🤖</div>
          <h3 className="text-lg font-semibold text-white mb-2">إعلانات الأدوات</h3>
          <p className="text-white/70 text-sm">إعلانات مخصصة لأدوات الذكاء الاصطناعي</p>
        </Link>

        <Link
          href="/admin/pages"
          className="bg-dark-card p-6 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 text-center group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📄</div>
          <h3 className="text-lg font-semibold text-white mb-2">الصفحات</h3>
          <p className="text-white/70 text-sm">إدارة الصفحات الثابتة</p>
        </Link>

        <Link
          href="/admin/media"
          className="bg-dark-card p-6 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 text-center group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🖼️</div>
          <h3 className="text-lg font-semibold text-white mb-2">الوسائط</h3>
          <p className="text-white/70 text-sm">رفع الصور وإدارة الفيديوهات</p>
        </Link>

        <Link
          href="/test-ads-comprehensive"
          className="bg-dark-card p-6 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 text-center group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🧪</div>
          <h3 className="text-lg font-semibold text-white mb-2">اختبار الإعلانات</h3>
          <p className="text-white/70 text-sm">اختبار شامل لجميع أنواع الإعلانات</p>
        </Link>

        <Link
          href="/test-advertisement-fixes"
          className="bg-dark-card p-6 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 text-center group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🔧</div>
          <h3 className="text-lg font-semibold text-white mb-2">اختبار الإصلاحات</h3>
          <p className="text-white/70 text-sm">اختبار إصلاحات نظام الإعلانات</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
