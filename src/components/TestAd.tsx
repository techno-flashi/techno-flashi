'use client';

// مكون إعلان تجريبي للاختبار
export function TestAd() {
  return (
    <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-lg text-center my-8">
      <h3 className="text-xl font-bold mb-2">إعلان تجريبي</h3>
      <p className="mb-4">هذا إعلان تجريبي للتأكد من أن الإعلانات تعمل</p>
      <button className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
        انقر هنا
      </button>
    </div>
  );
}
