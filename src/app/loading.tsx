export default function Loading() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#38BDF8] mb-4"></div>
        <p className="text-gray-400">جاري التحميل...</p>
      </div>
    </div>
  )
}
