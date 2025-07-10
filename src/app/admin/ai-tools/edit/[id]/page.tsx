'use client';

// صفحة تعديل أداة الذكاء الاصطناعي
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getAIToolById, updateAITool } from '@/lib/database';
import { AITool, AIToolFormData } from '@/types';

interface EditAIToolFormProps {
  params: Promise<{ id: string }>;
}

function EditAIToolForm({ params }: EditAIToolFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tool, setTool] = useState<AITool | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  
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

  // جلب بيانات الأداة عند تحميل الصفحة
  useEffect(() => {
    async function loadTool() {
      try {
        const resolvedParams = await params;
        const toolData = await getAIToolById(resolvedParams.id);
        setTool(toolData);
        
        // تعبئة النموذج بالبيانات الحالية
        setFormData({
          name: toolData.name,
          slug: toolData.slug,
          description: toolData.description,
          category: toolData.category,
          website_url: toolData.website_url,
          logo_url: toolData.logo_url || '',
          pricing: toolData.pricing,
          rating: toolData.rating,
          features: toolData.features,
          status: toolData.status,
        });
        
        // تعبئة حقل الميزات
        setFeaturesInput(toolData.features.join('\n'));
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setInitialLoading(false);
      }
    }

    loadTool();
  }, [params]);

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
    setSuccess('');
    setLoading(true);

    try {
      if (!tool) {
        throw new Error('لم يتم العثور على الأداة');
      }

      const dataToSubmit = {
        ...formData,
        status,
      };

      await updateAITool(tool.id, dataToSubmit);
      setSuccess('تم تحديث الأداة بنجاح');
      
      // إعادة توجيه بعد ثانيتين
      setTimeout(() => {
        router.push('/admin/ai-tools');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white text-xl">جاري تحميل بيانات الأداة...</div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">لم يتم العثور على الأداة</div>
          <Link
            href="/admin/ai-tools"
            className="text-[#38BDF8] hover:text-[#0EA5E9] transition-colors duration-200"
          >
            العودة إلى قائمة الأدوات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] p-6">
      <div className="max-w-4xl mx-auto">
        {/* هيدر الصفحة */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">تعديل أداة الذكاء الاصطناعي</h1>
            <p className="text-gray-400 mt-2">تعديل بيانات الأداة: {tool.name}</p>
          </div>
          
          <div className="flex gap-4">
            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              زيارة الموقع
            </a>
            
            <Link
              href="/admin/ai-tools"
              className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              العودة للقائمة
            </Link>
          </div>
        </div>

        {/* رسائل النجاح والخطأ */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {/* نموذج التعديل */}
        <form className="bg-[#161B22] rounded-lg border border-gray-700 p-8">
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
                className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
                placeholder="أدخل اسم الأداة"
                required
              />
            </div>

            {/* الرابط المختصر */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الرابط المختصر (Slug)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
                placeholder="الرابط المختصر"
              />
            </div>

            {/* الفئة */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الفئة *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
                required
              >
                <option value="">اختر الفئة</option>
                <option value="كتابة ومحادثة">كتابة ومحادثة</option>
                <option value="تصميم وإبداع">تصميم وإبداع</option>
                <option value="برمجة وتطوير">برمجة وتطوير</option>
                <option value="تحليل البيانات">تحليل البيانات</option>
                <option value="تسويق ومبيعات">تسويق ومبيعات</option>
                <option value="إنتاجية">إنتاجية</option>
                <option value="تعليم">تعليم</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            {/* نوع التسعير */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                نوع التسعير
              </label>
              <select
                value={formData.pricing}
                onChange={(e) => setFormData(prev => ({ ...prev, pricing: e.target.value as 'free' | 'freemium' | 'paid' }))}
                className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
              >
                <option value="free">مجاني</option>
                <option value="freemium">مجاني جزئياً</option>
                <option value="paid">مدفوع</option>
              </select>
            </div>
          </div>

          {/* الوصف */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              الوصف *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300 resize-vertical"
              placeholder="أدخل وصف الأداة"
              required
            />
          </div>

          {/* رابط الموقع */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              رابط الموقع *
            </label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
              placeholder="https://example.com"
              required
            />
          </div>

          {/* رابط الشعار */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              رابط الشعار
            </label>
            <input
              type="url"
              value={formData.logo_url}
              onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* التقييم */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              التقييم (1-5)
            </label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
            >
              <option value="1">1 نجمة</option>
              <option value="2">2 نجمة</option>
              <option value="3">3 نجوم</option>
              <option value="4">4 نجوم</option>
              <option value="5">5 نجوم</option>
            </select>
          </div>

          {/* الميزات */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              الميزات (كل ميزة في سطر منفصل)
            </label>
            <textarea
              value={featuresInput}
              onChange={(e) => handleFeaturesChange(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300 resize-vertical"
              placeholder="ميزة 1&#10;ميزة 2&#10;ميزة 3"
            />
            <p className="text-sm text-gray-400 mt-2">
              أدخل كل ميزة في سطر منفصل
            </p>
          </div>

          {/* حالة النشر */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              حالة النشر
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
              className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
            >
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
            </select>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex justify-end space-x-4 space-x-reverse mt-8">
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

export default function EditAIToolPage({ params }: EditAIToolFormProps) {
  return (
    <ProtectedRoute>
      <EditAIToolForm params={params} />
    </ProtectedRoute>
  );
}
