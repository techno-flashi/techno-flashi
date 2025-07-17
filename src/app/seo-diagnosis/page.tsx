'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SEODiagnosisPage() {
  const [seoIssues, setSeoIssues] = useState<any[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.origin);
    
    // تحليل مشاكل SEO المحتملة
    const issues = [
      {
        type: 'فهرسة',
        severity: 'متوسط',
        title: 'صفحات feeds/comments تظهر في نتائج البحث',
        description: 'صفحات التعليقات والـ feeds لا يجب فهرستها',
        solution: 'تم إضافة قواعد في robots.txt لمنع فهرسة هذه الصفحات',
        status: 'محلول',
        urls: [
          '/feeds/510147107781489866/comments/default'
        ]
      },
      {
        type: 'نسخ مكررة',
        severity: 'عالي',
        title: 'صفحات مكررة بدون canonical URL',
        description: 'صفحات مكررة تظهر بمعاملات مختلفة مثل ?m=1',
        solution: 'تم إضافة canonical URLs لجميع الصفحات',
        status: 'محلول',
        urls: [
          '/?m=1',
          '/2025/06/meta-namedescription-content-context.html'
        ]
      },
      {
        type: 'sitemap',
        severity: 'منخفض',
        title: 'تحسين خريطة الموقع',
        description: 'إضافة خريطة موقع شاملة تتضمن جميع الصفحات المهمة',
        solution: 'تم إنشاء sitemap.xml ديناميكي',
        status: 'محلول',
        urls: [
          '/sitemap.xml'
        ]
      }
    ];
    
    setSeoIssues(issues);
  }, []);

  const testCanonicalUrl = (url: string) => {
    const testUrl = new URL(url, currentUrl);
    
    // إزالة المعاملات غير المرغوبة
    const paramsToRemove = ['m', 'utm_source', 'utm_medium', 'utm_campaign', 'ref', 'source'];
    paramsToRemove.forEach(param => {
      testUrl.searchParams.delete(param);
    });
    
    return testUrl.toString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'عالي': return 'text-red-400 bg-red-900';
      case 'متوسط': return 'text-yellow-400 bg-yellow-900';
      case 'منخفض': return 'text-green-400 bg-green-900';
      default: return 'text-text-description bg-background-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'محلول': return 'text-green-400 bg-green-900';
      case 'قيد العمل': return 'text-yellow-400 bg-yellow-900';
      case 'مفتوح': return 'text-red-400 bg-red-900';
      default: return 'text-text-description bg-background-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* رأس الصفحة */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🔍 تشخيص مشاكل SEO
            </h1>
            <p className="text-dark-text-secondary text-lg">
              تحليل وحل مشاكل Google Search Console
            </p>
          </div>

          {/* ملخص المشاكل */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <div className="text-2xl font-bold text-primary mb-1">{seoIssues.length}</div>
              <div className="text-text-description text-sm">إجمالي المشاكل</div>
            </div>
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {seoIssues.filter(issue => issue.status === 'محلول').length}
              </div>
              <div className="text-text-description text-sm">مشاكل محلولة</div>
            </div>
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {seoIssues.filter(issue => issue.status === 'قيد العمل').length}
              </div>
              <div className="text-text-description text-sm">قيد العمل</div>
            </div>
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {seoIssues.filter(issue => issue.status === 'مفتوح').length}
              </div>
              <div className="text-text-description text-sm">مشاكل مفتوحة</div>
            </div>
          </div>

          {/* قائمة المشاكل */}
          <div className="space-y-6">
            {seoIssues.map((issue, index) => (
              <div key={index} className="bg-dark-card rounded-xl p-6 border border-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-2">
                      <h3 className="text-xl font-semibold text-white">{issue.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                    <p className="text-text-secondary mb-3">{issue.description}</p>
                    <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 mb-3">
                      <h4 className="text-blue-300 font-semibold mb-1">الحل المطبق:</h4>
                      <p className="text-blue-100 text-sm">{issue.solution}</p>
                    </div>
                  </div>
                </div>

                {/* URLs المتأثرة */}
                {issue.urls && issue.urls.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">URLs المتأثرة:</h4>
                    <div className="space-y-2">
                      {issue.urls.map((url: string, urlIndex: number) => (
                        <div key={urlIndex} className="bg-background-secondary rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <code className="text-text-secondary text-sm break-all">{url}</code>
                            <div className="flex space-x-2 space-x-reverse ml-4">
                              <button
                                onClick={() => navigator.clipboard.writeText(testCanonicalUrl(url))}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                              >
                                نسخ Canonical
                              </button>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-text-secondary hover:bg-text-primary text-white px-3 py-1 rounded text-xs"
                              >
                                فتح
                              </a>
                            </div>
                          </div>
                          {url.includes('?') && (
                            <div className="mt-2 text-xs">
                              <span className="text-text-description">Canonical URL: </span>
                              <code className="text-green-400">{testCanonicalUrl(url)}</code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* الحلول المطبقة */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">✅ الحلول المطبقة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-3">ملف robots.txt محسن</h3>
                <ul className="text-text-secondary space-y-2 text-sm">
                  <li>• منع فهرسة صفحات feeds والتعليقات</li>
                  <li>• منع فهرسة المعاملات غير المرغوبة (?m=1)</li>
                  <li>• منع فهرسة الصفحات الإدارية</li>
                  <li>• السماح بفهرسة الصفحات المهمة فقط</li>
                  <li>• إضافة مراجع لخرائط الموقع</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Canonical URLs</h3>
                <ul className="text-text-secondary space-y-2 text-sm">
                  <li>• إضافة canonical URLs لجميع المقالات</li>
                  <li>• إضافة canonical URLs لجميع أدوات AI</li>
                  <li>• تنظيف URLs من المعاملات غير المرغوبة</li>
                  <li>• إضافة alternate URLs للموبايل</li>
                  <li>• إضافة hreflang للغات مختلفة</li>
                </ul>
              </div>
            </div>
          </div>

          {/* أدوات الاختبار */}
          <div className="mt-8 bg-dark-card rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">🧪 أدوات الاختبار</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={`${currentUrl}/robots.txt`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-center transition-colors"
              >
                🤖 فحص robots.txt
              </a>
              <a
                href={`${currentUrl}/sitemap.xml`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center transition-colors"
              >
                🗺️ فحص sitemap.xml
              </a>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-center transition-colors"
              >
                📊 Google Search Console
              </a>
            </div>
          </div>

          {/* خطوات المتابعة */}
          <div className="mt-8 bg-yellow-900 border border-yellow-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">📋 خطوات المتابعة</h2>
            
            <ol className="text-yellow-100 space-y-3">
              <li>1. <strong>رفع الملفات المحدثة:</strong> تأكد من رفع robots.txt و sitemap.xml للخادم</li>
              <li>2. <strong>طلب إعادة الفهرسة:</strong> استخدم Google Search Console لطلب إعادة فهرسة الصفحات</li>
              <li>3. <strong>مراقبة النتائج:</strong> راقب تحسن ترتيب الصفحات في نتائج البحث</li>
              <li>4. <strong>اختبار الروابط:</strong> تأكد من عمل جميع canonical URLs بشكل صحيح</li>
              <li>5. <strong>متابعة دورية:</strong> راجع Google Search Console أسبوعياً للمشاكل الجديدة</li>
            </ol>
          </div>

          {/* روابط سريعة */}
          <div className="mt-8 text-center">
            <div className="space-x-4 space-x-reverse">
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                الصفحة الرئيسية
              </Link>
              <Link
                href="/test-dashboard"
                className="inline-block px-4 py-2 bg-text-secondary text-white rounded-lg hover:bg-text-primary transition-colors"
              >
                لوحة الاختبار
              </Link>
              <a
                href="https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                دليل robots.txt
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
