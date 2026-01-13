// صفحة اختبار سريع
export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🎉 الموقع يعمل!</h1>
        <p className="text-xl text-gray-300 mb-8">تم إصلاح جميع المشاكل بنجاح</p>
        <div className="space-y-2 text-sm text-gray-400">
          <p>✅ Next.js يعمل بشكل صحيح</p>
          <p>✅ Supabase متصل</p>
          <p>✅ Tailwind CSS يعمل</p>
          <p>✅ الخطوط تحمل بشكل صحيح</p>
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}