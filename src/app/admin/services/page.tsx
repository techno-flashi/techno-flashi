'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Service } from '@/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      
      if (!response.ok) {
        throw new Error('فشل في جلب الخدمات');
      }

      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('حدث خطأ في جلب الخدمات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('فشل في حذف الخدمة');
      }

      // إعادة جلب الخدمات بعد الحذف
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('حدث خطأ في حذف الخدمة');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'bg-green-900 text-green-300',
      inactive: 'bg-red-900 text-red-300',
      draft: 'bg-yellow-900 text-yellow-300'
    };

    const statusText = {
      active: 'نشط',
      inactive: 'غير نشط',
      draft: 'مسودة'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-800 text-gray-300'}`}>
        {statusText[status as keyof typeof statusText] || status}
      </span>
    );
  };

  const getPricingDisplay = (service: Service) => {
    switch (service.pricing_type) {
      case 'free':
        return 'مجاني';
      case 'paid':
        return service.pricing_amount ? 
          `${service.pricing_amount} ${service.pricing_currency}` : 
          'مدفوع';
      case 'custom':
      default:
        return 'حسب الطلب';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">جاري تحميل الخدمات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchServices}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">إدارة الخدمات</h1>
            <p className="text-dark-text-secondary mt-2">
              إدارة وتحرير جميع الخدمات المتاحة في الموقع
            </p>
          </div>
          <Link
            href="/admin/services/new"
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            إضافة خدمة جديدة
          </Link>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <div className="text-2xl font-bold text-primary mb-2">
              {services.length}
            </div>
            <div className="text-dark-text-secondary">إجمالي الخدمات</div>
          </div>
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <div className="text-2xl font-bold text-green-500 mb-2">
              {services.filter(s => s.status === 'active').length}
            </div>
            <div className="text-dark-text-secondary">خدمات نشطة</div>
          </div>
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <div className="text-2xl font-bold text-yellow-500 mb-2">
              {services.filter(s => s.featured).length}
            </div>
            <div className="text-dark-text-secondary">خدمات مميزة</div>
          </div>
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <div className="text-2xl font-bold text-blue-500 mb-2">
              {services.filter(s => s.pricing_type === 'free').length}
            </div>
            <div className="text-dark-text-secondary">خدمات مجانية</div>
          </div>
        </div>

        {/* جدول الخدمات */}
        {services.length === 0 ? (
          <div className="bg-dark-card rounded-lg border border-gray-800 p-12 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              لا توجد خدمات
            </h3>
            <p className="text-dark-text-secondary mb-6">
              ابدأ بإضافة خدمة جديدة لعرضها في الموقع
            </p>
            <Link
              href="/admin/services/new"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              إضافة خدمة جديدة
            </Link>
          </div>
        ) : (
          <div className="bg-dark-card rounded-lg border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-dark-background">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الخدمة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      التصنيف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      السعر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark-card divide-y divide-gray-700">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-white flex items-center">
                              {service.name}
                              {service.featured && (
                                <span className="mr-2 bg-yellow-900 text-yellow-300 px-2 py-1 rounded-full text-xs">
                                  مميز
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-dark-text-secondary">
                              {service.short_description || service.description.substring(0, 50) + '...'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {service.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {getPricingDisplay(service)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(service.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <Link
                            href={`/services/${service.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            target="_blank"
                          >
                            عرض
                          </Link>
                          <Link
                            href={`/admin/services/${service.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            تعديل
                          </Link>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
