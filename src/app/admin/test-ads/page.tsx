'use client';

import SupabaseAdTester from '@/components/ads/SupabaseAdTester';

export default function TestAdsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 اختبار نظام الإعلانات</h1>
          <p className="text-gray-600">اختبار شامل لنظام إدارة الإعلانات بـ Supabase</p>
        </div>

        {/* Tester Component */}
        <SupabaseAdTester />

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">📋 معلومات النظام</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">🎯 مواضع الإعلانات</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Header - أعلى الصفحات</li>
                <li>• Sidebar - الشريط الجانبي</li>
                <li>• In-Content - داخل المحتوى</li>
                <li>• Footer - أسفل الصفحات</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">📊 تتبع الأداء</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Load - تحميل الإعلان</li>
                <li>• View - مشاهدة الإعلان</li>
                <li>• Click - النقر على الإعلان</li>
                <li>• Performance Analytics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">🔗 روابط سريعة</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="/admin/supabase-ads"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              🎯 إدارة الإعلانات
            </a>
            <a
              href="/admin/setup-ads"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              ⚙️ إعداد النظام
            </a>
            <a
              href="/"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              🏠 الصفحة الرئيسية
            </a>
            <a
              href="/articles"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              📰 المقالات
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
