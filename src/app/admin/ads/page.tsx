'use client';

import { useState, useEffect } from 'react';
import {
  getAds,
  createAd,
  updateAd,
  deleteAd,
  initializeAdsSystem,
  getAllCodeInjections,
  createCodeInjection,
  updateCodeInjection,
  deleteCodeInjection,
  type SupabaseAd,
  type CodeInjection
} from '@/lib/supabase-ads';
import { CODE_INJECTION_TEMPLATES } from '@/components/ads/DynamicCodeInjection';

export default function IntegratedAdsAdminPage() {
  const [ads, setAds] = useState<SupabaseAd[]>([]);
  const [codeInjections, setCodeInjections] = useState<CodeInjection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'analytics' | 'code-injections'>('list');
  const [editingAd, setEditingAd] = useState<SupabaseAd | null>(null);
  const [editingInjection, setEditingInjection] = useState<CodeInjection | null>(null);
  const [systemInitialized, setSystemInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterEnabled, setFilterEnabled] = useState<string>('all');

  // Form state for new/edit ad
  const [formData, setFormData] = useState({
    name: '',
    type: 'custom' as 'adsense' | 'custom',
    position: 'header' as 'header' | 'sidebar' | 'footer' | 'in-content' | 'popup',
    zone_id: '',
    script_code: '',
    html_code: '',
    enabled: true,
    pages: ['*'],
    priority: 5,
    delay_seconds: 0
  });

  // Form state for code injections
  const [injectionFormData, setInjectionFormData] = useState({
    name: '',
    position: 'head_end' as 'head_start' | 'head_end' | 'body_start' | 'footer',
    code: '',
    enabled: true,
    pages: ['*'],
    priority: 5
  });

  // Monetag templates removed

  // Load ads and code injections
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      const initialized = await initializeAdsSystem();
      setSystemInitialized(initialized);

      if (initialized) {
        const [fetchedAds, fetchedInjections] = await Promise.all([
          getAds(),
          getAllCodeInjections()
        ]);
        setAds(fetchedAds);
        setCodeInjections(fetchedInjections);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  // Filter ads
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.zone_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === 'all' || ad.position === filterPosition;
    const matchesEnabled = filterEnabled === 'all' ||
                          (filterEnabled === 'enabled' && ad.enabled) ||
                          (filterEnabled === 'disabled' && !ad.enabled);

    return matchesSearch && matchesPosition && matchesEnabled;
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAd) {
        const updated = await updateAd(editingAd.id, formData);
        if (updated) {
          setAds(prev => prev.map(ad => ad.id === editingAd.id ? updated : ad));
          setEditingAd(null);
          resetForm();
          alert('تم تحديث الإعلان بنجاح!');
        }
      } else {
        const newAd = await createAd(formData);
        if (newAd) {
          setAds(prev => [...prev, newAd]);
          resetForm();
          alert('تم إضافة الإعلان بنجاح!');
        }
      }
      setActiveTab('list');
    } catch (error) {
      console.error('Error saving ad:', error);
      alert('حدث خطأ في حفظ الإعلان');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'custom',
      position: 'header',
      zone_id: '',
      script_code: '',
      html_code: '',
      enabled: true,
      pages: ['*'],
      priority: 5,
      delay_seconds: 0
    });
    setEditingAd(null);
  };

  const handleEdit = (ad: SupabaseAd) => {
    setFormData({
      name: ad.name,
      type: ad.type,
      position: ad.position,
      zone_id: ad.zone_id || '',
      script_code: ad.script_code,
      html_code: ad.html_code || '',
      enabled: ad.enabled,
      pages: ad.pages,
      priority: ad.priority,
      delay_seconds: ad.delay_seconds || 0
    });
    setEditingAd(ad);
    setActiveTab('add');
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      const success = await deleteAd(id);
      if (success) {
        setAds(prev => prev.filter(ad => ad.id !== id));
        alert('تم حذف الإعلان بنجاح!');
      }
    }
  };

  const toggleEnabled = async (ad: SupabaseAd) => {
    const updated = await updateAd(ad.id, { enabled: !ad.enabled });
    if (updated) {
      setAds(prev => prev.map(a => a.id === ad.id ? updated : a));
    }
  };

  // Monetag functionality removed

  // Code injection handlers
  const handleInjectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingInjection) {
        const updated = await updateCodeInjection(editingInjection.id, injectionFormData);
        if (updated) {
          setCodeInjections(prev => prev.map(inj => inj.id === editingInjection.id ? updated : inj));
          setEditingInjection(null);
          resetInjectionForm();
          alert('تم تحديث حقن الكود بنجاح!');
        }
      } else {
        const newInjection = await createCodeInjection(injectionFormData);
        if (newInjection) {
          setCodeInjections(prev => [...prev, newInjection]);
          resetInjectionForm();
          alert('تم إضافة حقن الكود بنجاح!');
        }
      }
    } catch (error) {
      console.error('Error saving code injection:', error);
      alert('حدث خطأ في حفظ حقن الكود');
    }
  };

  const resetInjectionForm = () => {
    setInjectionFormData({
      name: '',
      position: 'head_end',
      code: '',
      enabled: true,
      pages: ['*'],
      priority: 5
    });
    setEditingInjection(null);
  };

  const handleEditInjection = (injection: CodeInjection) => {
    setInjectionFormData({
      name: injection.name,
      position: injection.position,
      code: injection.code,
      enabled: injection.enabled,
      pages: injection.pages,
      priority: injection.priority
    });
    setEditingInjection(injection);
    setActiveTab('code-injections');
  };

  const handleDeleteInjection = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف حقن الكود هذا؟')) {
      const success = await deleteCodeInjection(id);
      if (success) {
        setCodeInjections(prev => prev.filter(inj => inj.id !== id));
        alert('تم حذف حقن الكود بنجاح!');
      }
    }
  };

  const toggleInjectionEnabled = async (injection: CodeInjection) => {
    const updated = await updateCodeInjection(injection.id, { enabled: !injection.enabled });
    if (updated) {
      setCodeInjections(prev => prev.map(inj => inj.id === injection.id ? updated : inj));
    }
  };

  const createFromTemplate = (templateKey: keyof typeof CODE_INJECTION_TEMPLATES) => {
    const template = CODE_INJECTION_TEMPLATES[templateKey];
    setInjectionFormData({
      name: template.name,
      position: template.position,
      code: template.code,
      enabled: true,
      pages: ['*'],
      priority: template.priority
    });
  };

  if (!systemInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ النظام غير مُعد</h1>
            <p className="text-gray-600 mb-4">
              يجب إعداد قاعدة البيانات أولاً.
              <a href="/admin/setup-ads" className="text-blue-600 hover:underline ml-2">
                اذهب إلى صفحة الإعداد
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 إدارة الإعلانات المتكاملة</h1>
              <p className="text-gray-600">نظام شامل لإدارة الإعلانات</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                إجمالي الإعلانات: <span className="font-semibold">{ads.length}</span>
              </div>
              <div className="text-sm text-gray-500">
                نشط: <span className="font-semibold text-green-600">{ads.filter(ad => ad.enabled).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Templates - Monetag removed */}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'list', label: `📋 قائمة الإعلانات (${filteredAds.length})`, icon: '📋' },
                { id: 'add', label: editingAd ? '✏️ تعديل إعلان' : '➕ إضافة إعلان', icon: editingAd ? '✏️' : '➕' },
                { id: 'code-injections', label: `🔧 حقن الكود (${codeInjections.length})`, icon: '🔧' },

                { id: 'analytics', label: '📊 الإحصائيات', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* List Tab */}
            {activeTab === 'list' && (
              <div>
                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">🔍 البحث</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="ابحث بالاسم أو Zone ID..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📍 الموضع</label>
                    <select
                      value={filterPosition}
                      onChange={(e) => setFilterPosition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">جميع المواضع</option>
                      <option value="header">Header</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="in-content">In-Content</option>
                      <option value="footer">Footer</option>
                      <option value="popup">Popup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">⚡ الحالة</label>
                    <select
                      value={filterEnabled}
                      onChange={(e) => setFilterEnabled(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="enabled">نشط</option>
                      <option value="disabled">معطل</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => setActiveTab('add')}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
                    >
                      ➕ إضافة إعلان جديد
                    </button>
                  </div>
                </div>

                {/* Ads List */}
                {isLoading ? (
                  <div className="text-center py-8">⏳ جاري التحميل...</div>
                ) : filteredAds.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm || filterPosition !== 'all' || filterEnabled !== 'all'
                      ? '🔍 لا توجد إعلانات تطابق المرشحات المحددة'
                      : '📭 لا توجد إعلانات. استخدم القوالب السريعة أعلاه للبدء.'
                    }
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAds.map((ad) => (
                      <div key={ad.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900 flex items-center">
                                📢 {ad.name}
                              </h3>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                ad.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {ad.enabled ? '✅ نشط' : '❌ معطل'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <div>📍 الموضع: <span className="font-medium">{ad.position}</span></div>
                              <div>🎯 Zone ID: <span className="font-medium">{ad.zone_id}</span></div>
                              <div>⭐ الأولوية: <span className="font-medium">{ad.priority}</span></div>
                              <div>📄 الصفحات: <span className="font-medium">{ad.pages.join(', ')}</span></div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleEnabled(ad)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                ad.enabled
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {ad.enabled ? '⏸️ إيقاف' : '▶️ تشغيل'}
                            </button>
                            <button
                              onClick={() => handleEdit(ad)}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                            >
                              ✏️ تعديل
                            </button>
                            <button
                              onClick={() => handleDelete(ad.id)}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                              🗑️ حذف
                            </button>
                          </div>
                        </div>

                        {/* Performance Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-3 rounded">
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{ad.view_count}</div>
                            <div className="text-gray-500">👁️ مشاهدات</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{ad.click_count}</div>
                            <div className="text-gray-500">👆 نقرات</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900">
                              {ad.view_count > 0 ? ((ad.click_count / ad.view_count) * 100).toFixed(2) : '0.00'}%
                            </div>
                            <div className="text-gray-500">📈 CTR</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{ad.delay_seconds}s</div>
                            <div className="text-gray-500">⏱️ تأخير</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add/Edit Tab */}
            {activeTab === 'add' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">
                  {editingAd ? '✏️ تعديل الإعلان' : '➕ إضافة إعلان جديد'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📝 اسم الإعلان *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="مثال: Header Banner"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🏷️ نوع الإعلان
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="monetag">💰 Monetag</option>
                        <option value="adsense">🎯 Google AdSense</option>
                        <option value="custom">🔧 مخصص</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📍 الموضع *
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="header">🔝 Header</option>
                        <option value="sidebar">📋 Sidebar</option>
                        <option value="in-content">📄 In-Content</option>
                        <option value="footer">🔻 Footer</option>
                        <option value="popup">🪟 Popup</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🎯 Zone ID {formData.type === 'monetag' && '*'}
                      </label>
                      <input
                        type="text"
                        value={formData.zone_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, zone_id: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="9593378"
                        required={formData.type === 'monetag'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ⭐ الأولوية (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ⏱️ التأخير (ثانية)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.delay_seconds}
                        onChange={(e) => setFormData(prev => ({ ...prev, delay_seconds: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💻 كود الإعلان (JavaScript) *
                    </label>
                    <textarea
                      value={formData.script_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, script_code: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
                      rows={6}
                      placeholder="أدخل كود الإعلان هنا..."
                      required
                    />
                    {formData.type === 'monetag' && formData.zone_id && (
                      <button
                        type="button"
                        onClick={() => {
                          const template = monetagTemplates[formData.position as keyof typeof monetagTemplates];
                          if (template) {
                            setFormData(prev => ({
                              ...prev,
                              script_code: template.script(formData.zone_id)
                            }));
                          }
                        }}
                        className="mt-2 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
                      >
                        🔄 إنشاء كود Monetag تلقائياً
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📄 الصفحات المستهدفة
                    </label>
                    <input
                      type="text"
                      value={formData.pages.join(', ')}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pages: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="*, /articles, /ai-tools"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enabled"
                      checked={formData.enabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                      ✅ تفعيل الإعلان فور الإضافة
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      {editingAd ? '💾 تحديث الإعلان' : '➕ إضافة الإعلان'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setActiveTab('list');
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    >
                      ❌ إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Code Injections Tab */}
            {activeTab === 'code-injections' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">🔧 إدارة حقن الكود الديناميكي</h2>
                  <div className="text-sm text-gray-500">
                    إجمالي حقن الكود: <span className="font-semibold">{codeInjections.length}</span>
                  </div>
                </div>

                {/* Templates */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-3">⚡ قوالب جاهزة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(CODE_INJECTION_TEMPLATES).map(([key, template]) => (
                      <button
                        key={key}
                        onClick={() => createFromTemplate(key as keyof typeof CODE_INJECTION_TEMPLATES)}
                        className="text-left p-3 bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-medium text-blue-900">{template.name}</div>
                        <div className="text-sm text-blue-700">{template.position}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Injection Form */}
                {(editingInjection || injectionFormData.name) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingInjection ? '✏️ تعديل حقن الكود' : '➕ إضافة حقن كود جديد'}
                    </h3>

                    <form onSubmit={handleInjectionSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            📝 اسم حقن الكود *
                          </label>
                          <input
                            type="text"
                            value={injectionFormData.name}
                            onChange={(e) => setInjectionFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="مثال: Google Analytics 4"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            📍 موضع الحقن *
                          </label>
                          <select
                            value={injectionFormData.position}
                            onChange={(e) => setInjectionFormData(prev => ({ ...prev, position: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="head_start">🔝 Head Start - بداية &lt;head&gt;</option>
                            <option value="head_end">📄 Head End - نهاية &lt;head&gt;</option>
                            <option value="body_start">🚀 Body Start - بداية &lt;body&gt;</option>
                            <option value="footer">🔻 Footer - نهاية &lt;body&gt;</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ⭐ الأولوية (1-10)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={injectionFormData.priority}
                            onChange={(e) => setInjectionFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            📄 الصفحات المستهدفة
                          </label>
                          <input
                            type="text"
                            value={injectionFormData.pages.join(', ')}
                            onChange={(e) => setInjectionFormData(prev => ({
                              ...prev,
                              pages: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            placeholder="*, /articles, /ai-tools"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          💻 كود HTML/JavaScript *
                        </label>
                        <textarea
                          value={injectionFormData.code}
                          onChange={(e) => setInjectionFormData(prev => ({ ...prev, code: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
                          rows={8}
                          placeholder="أدخل كود HTML أو JavaScript هنا..."
                          required
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="injection-enabled"
                          checked={injectionFormData.enabled}
                          onChange={(e) => setInjectionFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="injection-enabled" className="text-sm font-medium text-gray-700">
                          ✅ تفعيل حقن الكود فور الإضافة
                        </label>
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-gray-200">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          {editingInjection ? '💾 تحديث حقن الكود' : '➕ إضافة حقن الكود'}
                        </button>
                        <button
                          type="button"
                          onClick={resetInjectionForm}
                          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                        >
                          ❌ إلغاء
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Injections List */}
                <div className="space-y-4">
                  {codeInjections.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      📭 لا توجد حقن كود. استخدم القوالب الجاهزة أعلاه للبدء.
                    </div>
                  ) : (
                    codeInjections.map((injection) => (
                      <div key={injection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900">🔧 {injection.name}</h3>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                injection.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {injection.enabled ? '✅ نشط' : '❌ معطل'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <div>📍 الموضع: <span className="font-medium">{injection.position}</span></div>
                              <div>⭐ الأولوية: <span className="font-medium">{injection.priority}</span></div>
                              <div>📄 الصفحات: <span className="font-medium">{injection.pages.join(', ')}</span></div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleInjectionEnabled(injection)}
                              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                injection.enabled
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {injection.enabled ? '⏸️ إيقاف' : '▶️ تشغيل'}
                            </button>
                            <button
                              onClick={() => handleEditInjection(injection)}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                            >
                              ✏️ تعديل
                            </button>
                            <button
                              onClick={() => handleDeleteInjection(injection.id)}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                              🗑️ حذف
                            </button>
                          </div>
                        </div>

                        {/* Code Preview */}
                        <div className="bg-gray-50 p-3 rounded border">
                          <div className="text-xs text-gray-500 mb-1">معاينة الكود:</div>
                          <pre className="text-xs text-gray-700 overflow-x-auto">
                            {injection.code.length > 200
                              ? injection.code.substring(0, 200) + '...'
                              : injection.code
                            }
                          </pre>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">📊 الإحصائيات والأداء</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{ads.length}</div>
                    <div className="text-blue-800 text-sm">إجمالي الإعلانات</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{ads.filter(ad => ad.enabled).length}</div>
                    <div className="text-green-800 text-sm">إعلانات نشطة</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {ads.reduce((sum, ad) => sum + ad.view_count, 0)}
                    </div>
                    <div className="text-purple-800 text-sm">إجمالي المشاهدات</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {ads.reduce((sum, ad) => sum + ad.click_count, 0)}
                    </div>
                    <div className="text-orange-800 text-sm">إجمالي النقرات</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
