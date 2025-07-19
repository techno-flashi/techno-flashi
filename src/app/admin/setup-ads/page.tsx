'use client';

import { useState } from 'react';
import { CREATE_ADS_TABLE_SQL, CREATE_SQL_FUNCTIONS } from '@/lib/supabase-ads';

export default function SetupAdsPage() {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [key]: true });
      setTimeout(() => {
        setCopied({ ...copied, [key]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 إعداد نظام الإعلانات</h1>
          <p className="text-gray-600">إعداد قاعدة بيانات Supabase لإدارة الإعلانات</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">خطوات الإعداد</h2>
            <span className="text-sm text-gray-500">الخطوة {step} من 4</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-12 h-1 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">📋 الخطوة 1: فتح Supabase Dashboard</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">التعليمات:</h4>
                  <ol className="list-decimal list-inside text-blue-800 space-y-2">
                    <li>اذهب إلى <a href="https://supabase.com/dashboard" target="_blank" className="underline">Supabase Dashboard</a></li>
                    <li>اختر مشروعك: <strong>tflash.dev</strong></li>
                    <li>اذهب إلى <strong>SQL Editor</strong> من القائمة الجانبية</li>
                    <li>اضغط <strong>New Query</strong></li>
                  </ol>
                </div>
                
                <button
                  onClick={() => setStep(2)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  التالي: إنشاء الجداول ➡️
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">🗄️ الخطوة 2: إنشاء جداول قاعدة البيانات</h3>
              <div className="space-y-4">
                <p className="text-gray-600">انسخ والصق الكود التالي في SQL Editor:</p>
                
                <div className="relative">
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto max-h-96">
                    <pre>{CREATE_ADS_TABLE_SQL}</pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(CREATE_ADS_TABLE_SQL, 'tables')}
                    className="absolute top-2 right-2 bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                  >
                    {copied.tables ? '✅ تم النسخ' : '📋 نسخ'}
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>مهم:</strong> اضغط <strong>Run</strong> في Supabase بعد لصق الكود
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    ⬅️ السابق
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    التالي: إنشاء الدوال ➡️
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">⚙️ الخطوة 3: إنشاء الدوال المساعدة</h3>
              <div className="space-y-4">
                <p className="text-gray-600">انسخ والصق الكود التالي في SQL Editor (استعلام جديد):</p>
                
                <div className="relative">
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto max-h-96">
                    <pre>{CREATE_SQL_FUNCTIONS}</pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(CREATE_SQL_FUNCTIONS, 'functions')}
                    className="absolute top-2 right-2 bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                  >
                    {copied.functions ? '✅ تم النسخ' : '📋 نسخ'}
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>مهم:</strong> اضغط <strong>Run</strong> في Supabase بعد لصق الكود
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    ⬅️ السابق
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    التالي: الانتهاء ➡️
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">🎉 الخطوة 4: تم الإعداد بنجاح!</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">✅ تم إنشاء النظام بنجاح</h4>
                  <p className="text-green-800 text-sm">
                    تم إعداد قاعدة البيانات وإنشاء الجداول والدوال المطلوبة.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">📊 ما تم إنشاؤه:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>🗄️ جدول <code>ads</code> - لحفظ الإعلانات</li>
                    <li>📈 جدول <code>ad_performance</code> - لتتبع الأداء</li>
                    <li>⚙️ دوال مساعدة لإدارة الإحصائيات</li>
                    <li>🔒 سياسات الأمان (RLS)</li>
                    <li>📋 3 إعلانات Monetag افتراضية</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">🚀 الخطوات التالية:</h4>
                  <ol className="text-yellow-800 text-sm space-y-1 list-decimal list-inside">
                    <li>اذهب إلى <strong>إدارة الإعلانات</strong> لإضافة إعلانات جديدة</li>
                    <li>تحقق من ظهور الإعلانات في الصفحة الرئيسية</li>
                    <li>راقب الأداء والإحصائيات</li>
                  </ol>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(3)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    ⬅️ السابق
                  </button>
                  <a
                    href="/admin/supabase-ads"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 inline-block text-center"
                  >
                    🎯 إدارة الإعلانات
                  </a>
                  <a
                    href="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block text-center"
                  >
                    🏠 الصفحة الرئيسية
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">❓ تحتاج مساعدة؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🔗 روابط مفيدة</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
                <li><a href="/admin/supabase-ads" className="text-blue-600 hover:underline">إدارة الإعلانات</a></li>
                <li><a href="/" className="text-blue-600 hover:underline">الصفحة الرئيسية</a></li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🛠️ استكشاف الأخطاء</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• تأكد من تشغيل جميع الاستعلامات</li>
                <li>• تحقق من عدم وجود أخطاء في Console</li>
                <li>• أعد تحميل الصفحة بعد الإعداد</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
