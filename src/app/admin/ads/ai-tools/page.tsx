'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface AITool {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: string;
}

interface Advertisement {
  id: string;
  title: string;
  content: string;
  type: string;
  position: string;
  target_ai_tool_slug: string | null;
  target_all_ai_tools: boolean;
  is_active: boolean;
  is_paused: boolean;
  priority: number;
  view_count: number;
  click_count: number;
  created_at: string;
}

export default function AIToolsAdsPage() {
  const [aiTools, setAiTools] = useState<AITool[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'html',
    position: 'article-body-start',
    target_ai_tool_slug: '',
    target_all_ai_tools: false,
    priority: 1,
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // تحميل أدوات الذكاء الاصطناعي
      const { data: toolsData, error: toolsError } = await supabase
        .from('ai_tools')
        .select('id, name, slug, category, status')
        .eq('status', 'published')
        .order('name');

      if (toolsError) throw toolsError;
      setAiTools(toolsData || []);

      // تحميل الإعلانات المخصصة لأدوات الذكاء الاصطناعي
      const { data: adsData, error: adsError } = await supabase
        .from('advertisements')
        .select('*')
        .or('target_all_ai_tools.eq.true,target_ai_tool_slug.not.is.null')
        .order('created_at', { ascending: false });

      if (adsError) throw adsError;
      setAdvertisements(adsData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.target_all_ai_tools && !formData.target_ai_tool_slug) {
      toast.error('يرجى اختيار أداة ذكاء اصطناعي أو تحديد "جميع الأدوات"');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('advertisements')
        .insert([{
          title: formData.title,
          content: formData.content,
          type: formData.type,
          position: formData.position,
          target_ai_tool_slug: formData.target_all_ai_tools ? null : formData.target_ai_tool_slug,
          target_all_ai_tools: formData.target_all_ai_tools,
          priority: formData.priority,
          is_active: formData.is_active,
          view_count: 0,
          click_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('تم إنشاء الإعلان بنجاح');
      setShowCreateForm(false);
      setFormData({
        title: '',
        content: '',
        type: 'html',
        position: 'article-body-start',
        target_ai_tool_slug: '',
        target_all_ai_tools: false,
        priority: 1,
        is_active: true
      });
      loadData();

    } catch (error) {
      console.error('Error creating ad:', error);
      toast.error('خطأ في إنشاء الإعلان');
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('تم حذف الإعلان بنجاح');
      loadData();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast.error('خطأ في حذف الإعلان');
    }
  };

  const toggleAdStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`تم ${!currentStatus ? 'تفعيل' : 'إلغاء تفعيل'} الإعلان`);
      loadData();
    } catch (error) {
      console.error('Error updating ad status:', error);
      toast.error('خطأ في تحديث حالة الإعلان');
    }
  };

  const filteredAds = selectedTool === '__all_ai_tools__'
    ? advertisements.filter(ad => ad.target_all_ai_tools)
    : selectedTool
    ? advertisements.filter(ad => ad.target_ai_tool_slug === selectedTool)
    : advertisements;

  const getToolName = (ad: Advertisement) => {
    if (ad.target_all_ai_tools) {
      return 'جميع أدوات الذكاء الاصطناعي';
    }
    if (ad.target_ai_tool_slug) {
      const tool = aiTools.find(t => t.slug === ad.target_ai_tool_slug);
      return tool ? tool.name : ad.target_ai_tool_slug;
    }
    return 'غير محدد';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                إعلانات أدوات الذكاء الاصطناعي
              </h1>
              <p className="text-dark-text-secondary">
                إدارة الإعلانات المخصصة لصفحات أدوات الذكاء الاصطناعي الفردية
              </p>
            </div>
            <div className="flex space-x-4 space-x-reverse">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                إضافة إعلان مخصص
              </button>
              <Link
                href="/admin/ads"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                الإعلانات العامة
              </Link>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-dark-card rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex items-center space-x-4 space-x-reverse">
              <label className="text-white font-medium">فلترة حسب الأداة:</label>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="bg-dark-background border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              >
                <option value="">جميع الإعلانات</option>
                <option value="__all_ai_tools__">إعلانات جميع الأدوات</option>
                {aiTools.map((tool) => (
                  <option key={tool.slug} value={tool.slug}>
                    {tool.name} ({tool.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <div className="text-2xl font-bold text-primary mb-2">{advertisements.length}</div>
              <div className="text-dark-text-secondary">إجمالي الإعلانات المخصصة</div>
            </div>
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <div className="text-2xl font-bold text-green-500 mb-2">
                {advertisements.filter(ad => ad.is_active).length}
              </div>
              <div className="text-dark-text-secondary">الإعلانات النشطة</div>
            </div>
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <div className="text-2xl font-bold text-blue-500 mb-2">{aiTools.length}</div>
              <div className="text-dark-text-secondary">أدوات الذكاء الاصطناعي</div>
            </div>
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <div className="text-2xl font-bold text-yellow-500 mb-2">
                {advertisements.reduce((sum, ad) => sum + (ad.view_count || 0), 0)}
              </div>
              <div className="text-dark-text-secondary">إجمالي المشاهدات</div>
            </div>
          </div>

          {/* Create Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-dark-card rounded-xl p-8 border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">إضافة إعلان مخصص</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">نوع الاستهداف</label>
                    <div className="space-y-3">
                      <label className="flex items-center text-white">
                        <input
                          type="radio"
                          name="targetType"
                          checked={formData.target_all_ai_tools}
                          onChange={() => setFormData({...formData, target_all_ai_tools: true, target_ai_tool_slug: ''})}
                          className="mr-2"
                        />
                        جميع أدوات الذكاء الاصطناعي
                      </label>
                      <label className="flex items-center text-white">
                        <input
                          type="radio"
                          name="targetType"
                          checked={!formData.target_all_ai_tools}
                          onChange={() => setFormData({...formData, target_all_ai_tools: false})}
                          className="mr-2"
                        />
                        أداة محددة
                      </label>
                    </div>
                  </div>

                  {!formData.target_all_ai_tools && (
                    <div>
                      <label className="block text-white font-medium mb-2">اختيار الأداة</label>
                      <select
                        value={formData.target_ai_tool_slug}
                        onChange={(e) => setFormData({...formData, target_ai_tool_slug: e.target.value})}
                        className="w-full bg-dark-background border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                        required={!formData.target_all_ai_tools}
                      >
                        <option value="">اختر أداة ذكاء اصطناعي</option>
                        {aiTools.map((tool) => (
                          <option key={tool.slug} value={tool.slug}>
                            {tool.name} ({tool.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-white font-medium mb-2">عنوان الإعلان</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-dark-background border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">موضع الإعلان</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full bg-dark-background border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                    >
                      <option value="article-body-start">بداية الصفحة</option>
                      <option value="article-body-mid">وسط الصفحة</option>
                      <option value="article-body-end">نهاية الصفحة</option>
                      <option value="sidebar-right">الشريط الجانبي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">محتوى الإعلان (HTML)</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full bg-dark-background border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary h-32"
                      placeholder="أدخل كود HTML للإعلان..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">الأولوية</label>
                      <input
                        type="number"
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                        className="w-full bg-dark-background border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                        min="1"
                        max="10"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center text-white">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                          className="mr-2"
                        />
                        نشط
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4 space-x-reverse">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      إنشاء الإعلان
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Ads List */}
          <div className="bg-dark-card rounded-xl border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">
                الإعلانات المخصصة ({filteredAds.length})
              </h2>
            </div>

            {filteredAds.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  {selectedTool ? 'لا توجد إعلانات لهذه الأداة' : 'لا توجد إعلانات مخصصة'}
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  إضافة أول إعلان مخصص
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredAds.map((ad) => (
                  <div key={ad.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 space-x-reverse mb-2">
                          <h3 className="text-lg font-semibold text-white">{ad.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ad.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {ad.is_active ? 'نشط' : 'غير نشط'}
                          </span>
                          <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                            {ad.position}
                          </span>
                        </div>
                        
                        <div className="text-dark-text-secondary mb-2">
                          <strong>الأداة:</strong> {getToolName(ad)}
                        </div>
                        
                        <div className="text-dark-text-secondary text-sm mb-4">
                          المشاهدات: {ad.view_count || 0} | النقرات: {ad.click_count || 0} | 
                          الأولوية: {ad.priority}
                        </div>
                        
                        <div className="bg-dark-background rounded-lg p-3 text-sm text-gray-300 max-h-20 overflow-y-auto">
                          {ad.content.substring(0, 200)}...
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 space-x-reverse ml-4">
                        <button
                          onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            ad.is_active 
                              ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {ad.is_active ? 'إلغاء تفعيل' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => deleteAd(ad.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
