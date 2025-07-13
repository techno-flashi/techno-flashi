'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Ad, AdStatus, AdType, PlacementPosition } from '@/types';
import Link from 'next/link';
import { AdPreview } from '@/components/admin/AdPreview';

interface AdFilters {
  status: AdStatus | 'all';
  type: AdType | 'all';
  placement: PlacementPosition | 'all';
  search: string;
}

export default function EnhancedAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdFilters>({
    status: 'all',
    type: 'all',
    placement: 'all',
    search: ''
  });
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedAds, setSelectedAds] = useState<string[]>([]);

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [ads, filters]);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // تحويل البيانات لتتوافق مع النوع المتوقع
      const transformedData = data?.map(ad => ({
        id: ad.id,
        title: ad.title,
        description: ad.content,
        type: ad.type as AdType,
        placement: ad.position as PlacementPosition,
        status: ad.is_active ? 'active' as AdStatus : 'paused' as AdStatus,
        sponsor_name: 'TechnoFlash',
        start_date: ad.start_date,
        end_date: ad.end_date,
        click_count: ad.click_count || 0,
        impression_count: ad.view_count || 0,
        created_at: ad.created_at,
        updated_at: ad.updated_at,
        // حقول إضافية
        content: ad.content,
        target_url: ad.target_url,
        image_url: ad.image_url,
        video_url: ad.video_url,
        custom_css: ad.custom_css,
        custom_js: ad.custom_js,
        priority: ad.priority || 1,
        is_active: ad.is_active,
        target_blank: ad.target_blank || false,
        animation_delay: ad.animation_delay || 0
      })) || [];

      setAds(transformedData);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...ads];

    if (filters.status !== 'all') {
      filtered = filtered.filter(ad => ad.status === filters.status);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(ad => ad.type === filters.type);
    }

    if (filters.placement !== 'all') {
      filtered = filtered.filter(ad => ad.placement === filters.placement);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(searchLower) ||
        ad.description?.toLowerCase().includes(searchLower) ||
        ad.sponsor_name?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAds(filtered);
  };

  const deleteAd = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAds(ads.filter(ad => ad.id !== id));
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  const toggleAdStatus = async (id: string, currentStatus: AdStatus) => {
    const newStatus: AdStatus = currentStatus === 'active' ? 'paused' : 'active';
    const isActive = newStatus === 'active';

    try {
      const { error } = await supabase
        .from('advertisements')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // تحديث الحالة المحلية
      setAds(ads.map(ad =>
        ad.id === id
          ? { ...ad, status: newStatus, is_active: isActive }
          : ad
      ));
    } catch (error) {
      console.error('Error updating ad status:', error);
    }
  };

  const handleBulkAction = async (action: 'delete' | 'activate' | 'pause') => {
    if (selectedAds.length === 0) return;

    const confirmMessage = action === 'delete'
      ? `هل أنت متأكد من حذف ${selectedAds.length} إعلان؟`
      : `هل أنت متأكد من ${action === 'activate' ? 'تفعيل' : 'إيقاف'} ${selectedAds.length} إعلان؟`;

    if (!confirm(confirmMessage)) return;

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('ads')
          .delete()
          .in('id', selectedAds);

        if (error) throw error;
        setAds(ads.filter(ad => !selectedAds.includes(ad.id)));
      } else {
        const newStatus: AdStatus = action === 'activate' ? 'active' : 'paused';
        const { error } = await supabase
          .from('ads')
          .update({ status: newStatus })
          .in('id', selectedAds);

        if (error) throw error;
        setAds(ads.map(ad =>
          selectedAds.includes(ad.id) ? { ...ad, status: newStatus } : ad
        ));
      }

      setSelectedAds([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const getStatusColor = (status: AdStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: AdStatus) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'paused': return 'متوقف';
      case 'draft': return 'مسودة';
      case 'expired': return 'منتهي';
      default: return status;
    }
  };

  const handleSelectAll = () => {
    if (selectedAds.length === filteredAds.length) {
      setSelectedAds([]);
    } else {
      setSelectedAds(filteredAds.map(ad => ad.id));
    }
  };

  const handleSelectAd = (id: string) => {
    setSelectedAds(prev =>
      prev.includes(id)
        ? prev.filter(adId => adId !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">جاري تحميل الإعلانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">إدارة الإعلانات المتقدمة</h1>
            <p className="text-dark-text-secondary">إدارة شاملة للإعلانات مع خيارات الاستهداف والتحليلات</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/ads/new"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              إضافة إعلان جديد
            </Link>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-card rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm">إجمالي الإعلانات</p>
                <p className="text-2xl font-bold text-white">{ads.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm">الإعلانات النشطة</p>
                <p className="text-2xl font-bold text-green-400">{ads.filter(ad => ad.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm">الإعلانات المتوقفة</p>
                <p className="text-2xl font-bold text-yellow-400">{ads.filter(ad => ad.status === 'paused').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-dark-card rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm">إجمالي النقرات</p>
                <p className="text-2xl font-bold text-blue-400">{ads.reduce((sum, ad) => sum + ad.click_count, 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* فلاتر متقدمة */}
        <div className="bg-dark-card rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* شريط البحث */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="البحث في الإعلانات..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full bg-dark-background border border-gray-600 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* فلاتر */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="bg-dark-background border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-w-[150px]"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="paused">متوقف</option>
                <option value="draft">مسودة</option>
                <option value="expired">منتهي</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                className="bg-dark-background border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-w-[150px]"
              >
                <option value="all">جميع الأنواع</option>
                <option value="banner">بانر</option>
                <option value="sidebar">شريط جانبي</option>
                <option value="inline">مدمج</option>
                <option value="popup">منبثق</option>
                <option value="native">أصلي</option>
                <option value="video">فيديو</option>
              </select>

              <select
                value={filters.placement}
                onChange={(e) => setFilters({ ...filters, placement: e.target.value as any })}
                className="bg-dark-background border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-w-[150px]"
              >
                <option value="all">جميع المواضع</option>
                <option value="header_top">أعلى الهيدر</option>
                <option value="header_bottom">أسفل الهيدر</option>
                <option value="content_top">أعلى المحتوى</option>
                <option value="content_middle">وسط المحتوى</option>
                <option value="content_bottom">أسفل المحتوى</option>
                <option value="sidebar_top">أعلى الشريط الجانبي</option>
                <option value="sidebar_middle">وسط الشريط الجانبي</option>
                <option value="sidebar_bottom">أسفل الشريط الجانبي</option>
                <option value="footer_top">أعلى الفوتر</option>
                <option value="footer_bottom">أسفل الفوتر</option>
              </select>

              {/* أزرار العرض */}
              <div className="flex items-center bg-dark-background border border-gray-600 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === 'table'
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* إجراءات مجمعة */}
          {selectedAds.length > 0 && (
            <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-primary font-medium">
                  تم تحديد {selectedAds.length} إعلان
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                  >
                    تفعيل الكل
                  </button>
                  <button
                    onClick={() => handleBulkAction('pause')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 text-sm"
                  >
                    إيقاف الكل
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                  >
                    حذف الكل
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* قائمة الإعلانات */}
        <div className="bg-dark-card rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                الإعلانات ({filteredAds.length})
              </h2>
              {filteredAds.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-primary hover:text-blue-400 transition-colors duration-200"
                >
                  {selectedAds.length === filteredAds.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                </button>
              )}
            </div>
          </div>

          {filteredAds.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">لا توجد إعلانات</h3>
              <p className="text-dark-text-secondary mb-6">
                {filters.search || filters.status !== 'all' || filters.type !== 'all' || filters.placement !== 'all'
                  ? 'لا توجد إعلانات مطابقة للفلاتر المحددة'
                  : 'لم يتم إنشاء أي إعلانات بعد'
                }
              </p>
              <Link
                href="/admin/ads/new"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                إنشاء أول إعلان
              </Link>
            </div>
          ) : viewMode === 'table' ? (
            <AdTableView
              ads={filteredAds}
              selectedAds={selectedAds}
              onSelectAd={handleSelectAd}
              onToggleStatus={toggleAdStatus}
              onDelete={deleteAd}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          ) : (
            <AdGridView
              ads={filteredAds}
              selectedAds={selectedAds}
              onSelectAd={handleSelectAd}
              onToggleStatus={toggleAdStatus}
              onDelete={deleteAd}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// مكون عرض الجدول
interface AdViewProps {
  ads: Ad[];
  selectedAds: string[];
  onSelectAd: (id: string) => void;
  onToggleStatus: (id: string, status: AdStatus) => void;
  onDelete: (id: string) => void;
  getStatusColor: (status: AdStatus) => string;
  getStatusLabel: (status: AdStatus) => string;
}

function AdTableView({ ads, selectedAds, onSelectAd, onToggleStatus, onDelete, getStatusColor, getStatusLabel }: AdViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedAds.length === ads.length && ads.length > 0}
                onChange={() => {}}
                className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
              />
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">الإعلان</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">الحالة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">النوع</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">الموضع</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">الأداء</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {ads.map((ad) => (
            <tr key={ad.id} className="hover:bg-gray-800/50 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedAds.includes(ad.id)}
                  onChange={() => onSelectAd(ad.id)}
                  className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {ad.image_url && (
                    <div className="w-16 h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={ad.image_url}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{ad.title}</h3>
                    {ad.description && (
                      <p className="text-xs text-dark-text-secondary truncate mt-1">{ad.description}</p>
                    )}
                    {ad.sponsor_name && (
                      <p className="text-xs text-blue-400 mt-1">برعاية: {ad.sponsor_name}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ad.status)}`}>
                  {getStatusLabel(ad.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-dark-text-secondary">{ad.type}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-dark-text-secondary">{ad.placement}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">
                  <div className="text-white">{ad.click_count.toLocaleString()} نقرة</div>
                  <div className="text-dark-text-secondary">{ad.impression_count.toLocaleString()} ظهور</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleStatus(ad.id, ad.status)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors duration-200 ${
                      ad.status === 'active'
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {ad.status === 'active' ? 'إيقاف' : 'تفعيل'}
                  </button>
                  <Link
                    href={`/admin/ads/${ad.id}/edit`}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    تعديل
                  </Link>
                  <button
                    onClick={() => onDelete(ad.id)}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
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
  );
}

// مكون عرض الشبكة
function AdGridView({ ads, selectedAds, onSelectAd, onToggleStatus, onDelete, getStatusColor, getStatusLabel }: AdViewProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200">
            {/* معاينة الإعلان */}
            <div className="relative h-48 bg-gray-900">
              {ad.image_url ? (
                <img
                  src={ad.image_url}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">لا توجد صورة</p>
                  </div>
                </div>
              )}

              {/* تحديد الإعلان */}
              <div className="absolute top-3 right-3">
                <input
                  type="checkbox"
                  checked={selectedAds.includes(ad.id)}
                  onChange={() => onSelectAd(ad.id)}
                  className="w-5 h-5 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
              </div>

              {/* حالة الإعلان */}
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ad.status)}`}>
                  {getStatusLabel(ad.status)}
                </span>
              </div>
            </div>

            {/* معلومات الإعلان */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-white mb-2 line-clamp-2">{ad.title}</h3>
              {ad.description && (
                <p className="text-xs text-dark-text-secondary mb-3 line-clamp-2">{ad.description}</p>
              )}

              <div className="flex items-center justify-between text-xs text-dark-text-secondary mb-4">
                <span>{ad.type}</span>
                <span>{ad.placement}</span>
              </div>

              {/* إحصائيات */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-white">{ad.click_count.toLocaleString()}</div>
                  <div className="text-xs text-dark-text-secondary">نقرة</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-white">{ad.impression_count.toLocaleString()}</div>
                  <div className="text-xs text-dark-text-secondary">ظهور</div>
                </div>
              </div>

              {/* الإجراءات */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleStatus(ad.id, ad.status)}
                  className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors duration-200 ${
                    ad.status === 'active'
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {ad.status === 'active' ? 'إيقاف' : 'تفعيل'}
                </button>
                <Link
                  href={`/admin/ads/${ad.id}/edit`}
                  className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
                >
                  تعديل
                </Link>
                <button
                  onClick={() => onDelete(ad.id)}
                  className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}