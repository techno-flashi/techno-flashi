'use client';

// صفحة تعديل أداة الذكاء الاصطناعي
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getAIToolById, updateAITool } from '@/lib/database';
import { AITool, AIToolFormData } from '@/types';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageUploadResult } from '@/lib/imageService';

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
  const [activeTab, setActiveTab] = useState<'basic' | 'media'>('basic');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState<ImageUploadResult[]>([]);
  const [imageUrl, setImageUrl] = useState('');

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
          rating: toolData.rating?.toString() || '5',
          features: toolData.features || [],
          status: toolData.status,
        });

        // تعبئة حقل الميزات
        setFeaturesInput((toolData.features || []).join(', '));
        
      } catch (error) {
        console.error('Error loading tool:', error);
        setError('فشل في تحميل بيانات الأداة');
      } finally {
        setInitialLoading(false);
      }
    }

    loadTool();
  }, [params]);

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setFormData(prev => ({
      ...prev,
      name,
      slug,
    }));
  };

  const handleFeaturesChange = (value: string) => {
    setFeaturesInput(value);
    
    const featuresArray = value
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);
    
    setFormData(prev => ({
      ...prev,
      features: featuresArray,
    }));
  };

  // معالجة رفع الصور
  const handleImageUpload = async (results: ImageUploadResult[]) => {
    const successfulUploads = results.filter(result => result.success && result.url);
    setUploadedImages(prev => [...prev, ...successfulUploads]);

    // تحديث logo_url بأول صورة مرفوعة
    if (successfulUploads.length > 0 && successfulUploads[0].url) {
      setFormData(prev => ({
        ...prev,
        logo_url: successfulUploads[0].url!
      }));
    }
  };

  // معالجة رابط اليوتيوب
  const handleYoutubeSubmit = () => {
    if (!youtubeUrl.trim()) {
      alert('يرجى إدخال رابط فيديو يوتيوب');
      return;
    }

    // التحقق من صحة رابط اليوتيوب
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(youtubeUrl)) {
      alert('يرجى إدخال رابط يوتيوب صحيح');
      return;
    }

    // يمكن إضافة الرابط إلى وصف الأداة أو حفظه في حقل منفصل
    const currentDescription = formData.description;
    const newDescription = currentDescription + 
      (currentDescription ? '\n\n' : '') + 
      `🎥 فيديو تعريفي: ${youtubeUrl}`;
    
    setFormData(prev => ({
      ...prev,
      description: newDescription
    }));

    setYoutubeUrl('');
    alert('تم إضافة رابط الفيديو إلى الوصف');
  };

  // حذف صورة مرفوعة
  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // تعيين صورة كشعار
  const setAsLogo = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      logo_url: imageUrl
    }));
    alert('تم تعيين الصورة كشعار للأداة');
  };

  // إضافة صورة من URL
  const handleImageUrlSubmit = () => {
    if (!imageUrl.trim()) {
      alert('يرجى إدخال رابط الصورة');
      return;
    }

    // التحقق من صحة رابط الصورة
    const imageRegex = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const isValidUrl = imageUrl.startsWith('http') && (imageRegex.test(imageUrl) || imageUrl.includes('unsplash.com') || imageUrl.includes('placehold.co'));
    
    if (!isValidUrl) {
      alert('يرجى إدخال رابط صورة صحيح (jpg, png, gif, webp, svg)');
      return;
    }

    // إضافة الصورة إلى قائمة الصور المرفوعة
    const newImage: ImageUploadResult = {
      success: true,
      url: imageUrl,
      path: imageUrl,
      width: 0,
      height: 0,
      size: 0
    };

    setUploadedImages(prev => [...prev, newImage]);
    setImageUrl('');
    alert('تم إضافة الصورة بنجاح');
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
            <Link
              href={`/ai-tools/${tool.slug}`}
              className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              معاينة الأداة
            </Link>

            <Link
              href="/admin/ai-tools"
              className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              العودة للقائمة
            </Link>
          </div>
        </div>

        {/* التبويبات */}
        <div className="flex space-x-4 space-x-reverse border-b border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-3 font-medium transition-colors duration-300 border-b-2 ${
              activeTab === 'basic'
                ? 'text-primary border-primary'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            المعلومات الأساسية
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-6 py-3 font-medium transition-colors duration-300 border-b-2 ${
              activeTab === 'media'
                ? 'text-primary border-primary'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            الصور والوسائط ({uploadedImages.length})
          </button>
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
          {activeTab === 'basic' && (
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
                  <option value="كتابة المحتوى">كتابة المحتوى</option>
                  <option value="تصميم جرافيك">تصميم جرافيك</option>
                  <option value="تحليل البيانات">تحليل البيانات</option>
                  <option value="برمجة">برمجة</option>
                  <option value="تسويق رقمي">تسويق رقمي</option>
                  <option value="فيديو وصوت">فيديو وصوت</option>
                  <option value="ترجمة">ترجمة</option>
                  <option value="خدمة عملاء">خدمة عملاء</option>
                </select>
              </div>

              {/* نوع التسعير */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  نوع التسعير *
                </label>
                <select
                  value={formData.pricing}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricing: e.target.value as 'free' | 'freemium' | 'paid' }))}
                  className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
                  required
                >
                  <option value="free">مجاني</option>
                  <option value="freemium">مجاني جزئياً</option>
                  <option value="paid">مدفوع</option>
                </select>
              </div>

              {/* رابط الموقع */}
              <div className="md:col-span-2">
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
              <div className="md:col-span-2">
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

              {/* الوصف */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الوصف *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300 resize-vertical"
                  placeholder="وصف مفصل للأداة وميزاتها"
                  required
                />
              </div>

              {/* الميزات */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الميزات (مفصولة بفواصل)
                </label>
                <textarea
                  value={featuresInput}
                  onChange={(e) => handleFeaturesChange(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300 resize-vertical"
                  placeholder="ميزة 1, ميزة 2, ميزة 3"
                />
              </div>

              {/* التقييم */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  التقييم (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
                />
              </div>

              {/* الحالة */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الحالة
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
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-8">
              {/* رفع الصور */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">رفع الصور</h3>

                <div className="space-y-6">
                  {/* الشعار الحالي */}
                  {formData.logo_url && (
                    <div className="bg-[#0D1117] rounded-lg p-6 border border-gray-600">
                      <h4 className="text-lg font-medium text-white mb-4">الشعار الحالي</h4>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800">
                          <img
                            src={formData.logo_url}
                            alt="شعار الأداة"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300 text-sm break-all mb-2">{formData.logo_url}</p>
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              حذف الشعار
                            </button>
                            <a
                              href={formData.logo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-blue-400 text-sm"
                            >
                              عرض الصورة
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* رفع صور جديدة */}
                  <div className="bg-[#0D1117] rounded-lg p-6 border border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-4">رفع صور جديدة</h4>
                    <ImageUploader
                      onImagesUploaded={() => {}}
                      onUploadResults={handleImageUpload}
                      maxImages={5}
                      folder="ai-tools"
                      className=""
                    />
                  </div>

                  {/* إضافة صورة من URL */}
                  <div className="bg-[#0D1117] rounded-lg p-6 border border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-4">إضافة صورة من رابط</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          رابط الصورة
                        </label>
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 bg-[#161B22] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleImageUrlSubmit}
                        disabled={!imageUrl.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        إضافة الصورة
                      </button>

                      <p className="text-gray-400 text-sm">
                        يمكنك إضافة صور من روابط خارجية (jpg, png, gif, webp, svg)
                      </p>
                    </div>
                  </div>

                  {/* الصور المرفوعة */}
                  {uploadedImages.length > 0 && (
                    <div className="bg-[#0D1117] rounded-lg p-6 border border-gray-600">
                      <h4 className="text-lg font-medium text-white mb-4">الصور المرفوعة</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-800">
                              {image.url && (
                                <img
                                  src={image.url}
                                  alt={`صورة ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}

                              {/* أزرار التحكم */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2 space-x-reverse">
                                <button
                                  type="button"
                                  onClick={() => image.url && setAsLogo(image.url)}
                                  className="bg-primary hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                >
                                  تعيين كشعار
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeUploadedImage(index)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                >
                                  حذف
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* إضافة فيديو يوتيوب */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">إضافة فيديو يوتيوب</h3>

                <div className="bg-[#0D1117] rounded-lg p-6 border border-gray-600">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        رابط فيديو يوتيوب
                      </label>
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 bg-[#161B22] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#38BDF8] transition-colors duration-300"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleYoutubeSubmit}
                      disabled={!youtubeUrl.trim()}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إضافة الفيديو إلى الوصف
                    </button>

                    <p className="text-gray-400 text-sm">
                      سيتم إضافة رابط الفيديو إلى وصف الأداة. يمكن للمستخدمين مشاهدة الفيديو لفهم كيفية استخدام الأداة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
