'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Service, ServiceFormData } from '@/types';

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [serviceId, setServiceId] = useState<string>('');
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    short_description: '',
    category: 'general',
    icon_url: '',
    image_url: '',
    pricing_type: 'custom',
    pricing_amount: undefined,
    pricing_currency: 'USD',
    status: 'active',
    featured: false,
    cta_text: 'تعرف أكثر',
    cta_link: '',
    display_order: 0,
    tags: [],
    features: []
  });

  const [tagsInput, setTagsInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setServiceId(resolvedParams.id);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/services/${serviceId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/admin/services');
          return;
        }
        throw new Error('فشل في جلب بيانات الخدمة');
      }

      const data = await response.json();
      const serviceData = data.service;
      setService(serviceData);

      // تحديث بيانات النموذج
      setFormData({
        name: serviceData.name,
        description: serviceData.description,
        short_description: serviceData.short_description || '',
        category: serviceData.category,
        icon_url: serviceData.icon_url || '',
        image_url: serviceData.image_url || '',
        pricing_type: serviceData.pricing_type,
        pricing_amount: serviceData.pricing_amount,
        pricing_currency: serviceData.pricing_currency || 'USD',
        status: serviceData.status,
        featured: serviceData.featured,
        cta_text: serviceData.cta_text,
        cta_link: serviceData.cta_link || '',
        display_order: serviceData.display_order,
        tags: serviceData.tags || [],
        features: serviceData.features || []
      });

      // تحديث حقول النص
      setTagsInput((serviceData.tags || []).join(', '));
      setFeaturesInput((serviceData.features || []).join('\n'));

    } catch (error) {
      console.error('Error fetching service:', error);
      alert('حدث خطأ في جلب بيانات الخدمة');
      router.push('/admin/services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // تحويل النصوص إلى مصفوفات
      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      const features = featuresInput.split('\n').map(feature => feature.trim()).filter(feature => feature);

      const submitData = {
        ...formData,
        tags,
        features,
        pricing_amount: formData.pricing_amount || null
      };

      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحديث الخدمة');
      }

      const result = await response.json();
      console.log('Service updated:', result);

      // إعادة توجيه إلى صفحة إدارة الخدمات
      router.push('/admin/services');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('حدث خطأ في تحديث الخدمة: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الخدمة...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">لم يتم العثور على الخدمة</p>
          <Link
            href="/admin/services"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            العودة للقائمة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تعديل الخدمة</h1>
            <p className="text-gray-600 mt-2">
              تعديل بيانات الخدمة: {service.name}
            </p>
          </div>
          <div className="flex space-x-4 space-x-reverse">
            <Link
              href={`/services/${service.id}`}
              target="_blank"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              معاينة الخدمة
            </Link>
            <Link
              href="/admin/services"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
            >
              العودة للقائمة
            </Link>
          </div>
        </div>

        {/* النموذج */}
        <div className="bg-white rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* المعلومات الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الخدمة *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="أدخل اسم الخدمة"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  التصنيف
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="general">عام</option>
                  <option value="web-development">تطوير مواقع</option>
                  <option value="ai-solutions">حلول الذكاء الاصطناعي</option>
                  <option value="mobile-apps">تطبيقات الجوال</option>
                  <option value="consulting">استشارات</option>
                  <option value="design">تصميم</option>
                </select>
              </div>
            </div>

            {/* الوصف */}
            <div>
              <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
                الوصف المختصر
              </label>
              <input
                type="text"
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="وصف مختصر للخدمة (اختياري)"
                maxLength={500}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                الوصف التفصيلي *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="وصف تفصيلي للخدمة"
              />
            </div>

            {/* الصور والروابط */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="icon_url" className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الأيقونة
                </label>
                <input
                  type="url"
                  id="icon_url"
                  name="icon_url"
                  value={formData.icon_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/icon.png"
                />
              </div>

              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الصورة الرئيسية
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* التسعير */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="pricing_type" className="block text-sm font-medium text-gray-700 mb-2">
                  نوع التسعير
                </label>
                <select
                  id="pricing_type"
                  name="pricing_type"
                  value={formData.pricing_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="free">مجاني</option>
                  <option value="paid">مدفوع</option>
                  <option value="custom">حسب الطلب</option>
                </select>
              </div>

              {formData.pricing_type === 'paid' && (
                <>
                  <div>
                    <label htmlFor="pricing_amount" className="block text-sm font-medium text-gray-700 mb-2">
                      السعر
                    </label>
                    <input
                      type="number"
                      id="pricing_amount"
                      name="pricing_amount"
                      min="0"
                      step="0.01"
                      value={formData.pricing_amount || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="pricing_currency" className="block text-sm font-medium text-gray-700 mb-2">
                      العملة
                    </label>
                    <select
                      id="pricing_currency"
                      name="pricing_currency"
                      value={formData.pricing_currency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="EUR">يورو (EUR)</option>
                      <option value="EGP">جنيه مصري (EGP)</option>
                      <option value="SAR">ريال سعودي (SAR)</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* زر العمل */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cta_text" className="block text-sm font-medium text-gray-700 mb-2">
                  نص زر العمل
                </label>
                <input
                  type="text"
                  id="cta_text"
                  name="cta_text"
                  value={formData.cta_text}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="تعرف أكثر"
                />
              </div>

              <div>
                <label htmlFor="cta_link" className="block text-sm font-medium text-gray-700 mb-2">
                  رابط زر العمل
                </label>
                <input
                  type="text"
                  id="cta_link"
                  name="cta_link"
                  value={formData.cta_link}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="/page/contact-us"
                />
              </div>
            </div>

            {/* العلامات والمميزات */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  العلامات (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="تقنية, ويب, تطوير"
                />
              </div>

              <div>
                <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
                  المميزات (كل ميزة في سطر منفصل)
                </label>
                <textarea
                  id="features"
                  rows={4}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="ميزة 1&#10;ميزة 2&#10;ميزة 3"
                />
              </div>
            </div>

            {/* الإعدادات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="draft">مسودة</option>
                </select>
              </div>

              <div>
                <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-2">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  id="display_order"
                  name="display_order"
                  min="0"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="featured" className="mr-2 block text-sm text-gray-900">
                  خدمة مميزة
                </label>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t">
              <Link
                href="/admin/services"
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
              >
                إلغاء
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
