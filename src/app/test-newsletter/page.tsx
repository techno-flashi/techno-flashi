'use client';

import { useState, useEffect } from 'react';
import { NewsletterSubscription } from '@/components/NewsletterSubscription';
import { getSubscriberStats } from '@/lib/newsletterService';

export default function TestNewsletterPage() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const newStats = await getSubscriberStats();
      setStats(newStats);
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-dark-background">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          اختبار نظام النشرة البريدية
        </h1>

        {/* الإحصائيات */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">إحصائيات المشتركين</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-dark-card rounded-lg p-6 border border-gray-800 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {loading ? '...' : stats.total}
              </div>
              <div className="text-dark-text-secondary">إجمالي المشتركين</div>
            </div>
            
            <div className="bg-dark-card rounded-lg p-6 border border-gray-800 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {loading ? '...' : stats.active}
              </div>
              <div className="text-dark-text-secondary">مشتركين نشطين</div>
            </div>
            
            <div className="bg-dark-card rounded-lg p-6 border border-gray-800 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {loading ? '...' : stats.pending}
              </div>
              <div className="text-dark-text-secondary">في انتظار التأكيد</div>
            </div>
            
            <div className="bg-dark-card rounded-lg p-6 border border-gray-800 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {loading ? '...' : stats.unsubscribed}
              </div>
              <div className="text-dark-text-secondary">ألغوا الاشتراك</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={loadStats}
              className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              تحديث الإحصائيات
            </button>
          </div>
        </div>

        {/* اختبار الأشكال المختلفة */}
        <div className="space-y-12">
          {/* النموذج المميز */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">النموذج المميز (Featured)</h2>
            <NewsletterSubscription 
              variant="featured" 
              source="test-featured" 
              showName={true}
            />
          </div>

          {/* النموذج الافتراضي */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">النموذج الافتراضي (Default)</h2>
            <div className="max-w-md mx-auto">
              <NewsletterSubscription 
                variant="default" 
                source="test-default"
                title="اشترك في النشرة البريدية"
                description="احصل على أحدث المقالات التقنية أسبوعياً"
              />
            </div>
          </div>

          {/* النموذج المضغوط */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">النموذج المضغوط (Compact)</h2>
            <div className="max-w-lg mx-auto">
              <NewsletterSubscription 
                variant="compact" 
                source="test-compact"
              />
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-16 bg-dark-card rounded-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">معلومات النظام</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-white font-medium mb-2">الميزات المتاحة:</h4>
              <ul className="text-dark-text-secondary space-y-1">
                <li>✅ التحقق من صحة البريد الإلكتروني</li>
                <li>✅ منع الاشتراك المكرر</li>
                <li>✅ إعادة تفعيل الاشتراك الملغي</li>
                <li>✅ حفظ مصدر الاشتراك</li>
                <li>✅ تتبع IP والمتصفح</li>
                <li>✅ رسائل تأكيد واضحة</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">الأشكال المتاحة:</h4>
              <ul className="text-dark-text-secondary space-y-1">
                <li><strong>Featured:</strong> للصفحة الرئيسية مع مميزات كاملة</li>
                <li><strong>Default:</strong> للصفحات العادية</li>
                <li><strong>Compact:</strong> للشريط الجانبي أو المساحات الصغيرة</li>
              </ul>
            </div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="mt-8 text-center space-x-4 space-x-reverse">
          <a
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 inline-block"
          >
            العودة للرئيسية
          </a>
          <a
            href="/articles"
            className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 inline-block"
          >
            صفحة المقالات
          </a>
        </div>
      </div>
    </div>
  );
}
