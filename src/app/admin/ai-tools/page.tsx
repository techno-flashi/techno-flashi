'use client';

// صفحة إدارة أدوات الذكاء الاصطناعي
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getAITools, deleteAITool } from '@/lib/database';
import { AITool } from '@/types';

function AIToolsManagement() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // جلب الأدوات عند تحميل الصفحة
  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      const data = await getAITools();
      setTools(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف أداة "${name}"؟`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await deleteAITool(id);
      setTools(tools.filter(tool => tool.id !== id));
    } catch (err: any) {
      alert(`خطأ في حذف الأداة: ${err.message}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          منشور
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        مسودة
      </span>
    );
  };

  const getPricingBadge = (pricing: string) => {
    const badges = {
      free: { color: 'bg-green-100 text-green-800', text: 'مجاني' },
      freemium: { color: 'bg-blue-100 text-blue-800', text: 'مجاني جزئياً' },
      paid: { color: 'bg-red-100 text-red-800', text: 'مدفوع' },
    };
    
    const badge = badges[pricing as keyof typeof badges] || badges.free;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#38BDF8] mb-4"></div>
          <p className="text-gray-400">جاري تحميل أدوات الذكاء الاصطناعي...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] p-6">
      <div className="max-w-7xl mx-auto">
        {/* هيدر الصفحة */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">إدارة أدوات الذكاء الاصطناعي</h1>
            <p className="text-gray-400 mt-2">إدارة جميع أدوات الذكاء الاصطناعي في الموقع</p>
          </div>
          <Link
            href="/admin/ai-tools/new"
            className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center"
          >
            <span className="ml-2">+</span>
            أداة جديدة
          </Link>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* جدول الأدوات */}
        <div className="bg-[#161B22] rounded-lg border border-gray-700 overflow-hidden">
          {tools.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-2">لا توجد أدوات</h3>
              <p className="text-gray-400 mb-6">ابدأ بإضافة أول أداة ذكاء اصطناعي</p>
              <Link
                href="/admin/ai-tools/new"
                className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                إضافة أداة جديدة
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#0D1117]">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الأداة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الفئة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      التسعير
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      التقييم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#161B22] divide-y divide-gray-700">
                  {tools.map((tool) => (
                    <tr key={tool.id} className="hover:bg-[#1C2128] transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={tool.logo_url || "https://placehold.co/40x40/38BDF8/FFFFFF?text=AI"}
                              alt={tool.name}
                            />
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-white">
                              {tool.name}
                            </div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">
                              {tool.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {tool.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPricingBadge(tool.pricing)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="mr-1">{tool.rating}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(tool.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <Link
                            href={`/admin/ai-tools/edit/${tool.id}`}
                            className="text-[#38BDF8] hover:text-[#0EA5E9] transition-colors duration-200"
                          >
                            تعديل
                          </Link>
                          <a
                            href={tool.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 transition-colors duration-200"
                          >
                            زيارة
                          </a>
                          <button
                            onClick={() => handleDelete(tool.id, tool.name)}
                            disabled={deleteLoading === tool.id}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50"
                          >
                            {deleteLoading === tool.id ? 'جاري الحذف...' : 'حذف'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* إحصائيات سريعة */}
        {tools.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">إجمالي الأدوات</h3>
              <p className="text-3xl font-bold text-[#38BDF8]">{tools.length}</p>
            </div>
            
            <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">أدوات مجانية</h3>
              <p className="text-3xl font-bold text-green-500">
                {tools.filter(t => t.pricing === 'free').length}
              </p>
            </div>
            
            <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">أدوات مدفوعة</h3>
              <p className="text-3xl font-bold text-red-500">
                {tools.filter(t => t.pricing === 'paid').length}
              </p>
            </div>
            
            <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">متوسط التقييم</h3>
              <p className="text-3xl font-bold text-yellow-500">
                {tools.length > 0 ? (tools.reduce((sum, t) => sum + parseFloat(t.rating), 0) / tools.length).toFixed(1) : '0'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIToolsPage() {
  return (
    <ProtectedRoute>
      <AIToolsManagement />
    </ProtectedRoute>
  );
}
