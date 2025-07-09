'use client';

// صفحة إضافة أداة ذكاء اصطناعي جديدة
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { createAITool } from '@/lib/database';
import { AIToolFormData } from '@/types';

function NewAIToolForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<AIToolFormData>({
    name: '',
    slug: '',
    description: '',
    category: '',
    website_url: '',
    logo_url: '',
    pricing: 'free',
    rating: '5',
    features: [],
    status: 'draft',
  });

  const [featuresInput, setFeaturesInput] = useState('');

  // توليد slug تلقائياً من الاسم
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleFeaturesChange = (features: string) => {
    setFeaturesInput(features);
    const featuresArray = features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);
    
    setFormData(prev => ({
      ...prev,
      features: featuresArray,
    }));
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        status,
      };

      await createAITool(dataToSubmit);
      router.push('/admin/ai-tools');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] p-6">
      <div className="max-w-4xl mx-auto">
        {/* هيدر الصفحة */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">أداة ذكاء اصطناعي جديدة</h1>
            <p className="text-gray-400 mt-2">إضافة أداة ذكاء اصطناعي جديدة للموقع</p>
          </div>
          <Link
            href="/admin/ai-tools"
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            ← العودة للأدوات
          </Link>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* نموذج الأداة */}
        <form className="space-y-6">
          <div className="bg-[#161B22] rounded-lg border border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* اسم الأداة */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  اسم الأداة *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                  placeholder="أدخل اسم الأداة"
                  required
                />
              </div>

              {/* الرابط */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  رابط الأداة (Slug)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                  placeholder="tool-slug"
                />
              </div>

              {/* الفئة */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الفئة *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                  placeholder="مثل: كتابة، تصميم، برمجة"
                  required
                />
              </div>

              {/* رابط الموقع */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  رابط الموقع *
                </label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                  placeholder="https://example.com"
                  required
                />
              </div>

              {/* رابط الشعار */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  رابط الشعار
                </label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              {/* التسعير */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نوع التسعير
                </label>
                <select
                  value={formData.pricing}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricing: e.target.value as 'free' | 'freemium' | 'paid' }))}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                >
                  <option value="free">مجاني</option>
                  <option value="freemium">مجاني جزئياً</option>
                  <option value="paid">مدفوع</option>
                </select>
              </div>

              {/* التقييم */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  التقييم (من 1 إلى 5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value || '5' }))}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                />
              </div>

              {/* الوصف */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  وصف الأداة *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent resize-none"
                  placeholder="وصف مفصل عن الأداة وما تقوم به"
                  required
                />
              </div>

              {/* المميزات */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  المميزات (كل ميزة في سطر منفصل)
                </label>
                <textarea
                  value={featuresInput}
                  onChange={(e) => handleFeaturesChange(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent resize-none"
                  placeholder="ميزة رقم 1&#10;ميزة رقم 2&#10;ميزة رقم 3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  اكتب كل ميزة في سطر منفصل
                </p>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex justify-end space-x-4 space-x-reverse">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading || !formData.name.trim()}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ كمسودة'}
            </button>
            
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={loading || !formData.name.trim()}
              className="px-6 py-3 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري النشر...' : 'نشر الأداة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewAIToolPage() {
  return (
    <ProtectedRoute>
      <NewAIToolForm />
    </ProtectedRoute>
  );
}
