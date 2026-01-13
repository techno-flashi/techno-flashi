import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-300 mb-4">
        الصفحة غير موجودة
      </h2>
      <p className="text-gray-400 mb-8">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
      </p>
      <Link 
        href="/" 
        className="inline-block bg-[#38BDF8] text-white px-6 py-3 rounded-lg hover:bg-[#0EA5E9] transition-colors duration-300"
      >
        العودة للصفحة الرئيسية
      </Link>
    </div>
  )
}
