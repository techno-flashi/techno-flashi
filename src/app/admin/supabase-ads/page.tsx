'use client';

import { useState, useEffect } from 'react';
import { 
  getAds, 
  createAd, 
  updateAd, 
  deleteAd, 
  initializeAdsSystem,
  type SupabaseAd,
  CREATE_ADS_TABLE_SQL,
  CREATE_SQL_FUNCTIONS
} from '@/lib/supabase-ads';

export default function SupabaseAdsAdminPage() {
  const [ads, setAds] = useState<SupabaseAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'setup'>('list');
  const [editingAd, setEditingAd] = useState<SupabaseAd | null>(null);
  const [systemInitialized, setSystemInitialized] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'custom' as 'adsense' | 'custom',
    position: 'header' as 'header' | 'sidebar' | 'footer' | 'in-content' | 'popup',
    zone_id: '',
    script_code: '',
    enabled: true,
    pages: ['*'],
    priority: 5,
    delay_seconds: 0
  });

  // Load ads
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      const initialized = await initializeAdsSystem();
      setSystemInitialized(initialized);
      
      if (initialized) {
        const fetchedAds = await getAds();
        setAds(fetchedAds);
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

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

  if (!systemInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ إعداد قاعدة البيانات مطلوب</h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">خطوات الإعداد:</h3>
              <ol className="list-decimal list-inside text-blue-800 space-y-1">
                <li>اذهب إلى Supabase Dashboard</li>
                <li>افتح SQL Editor</li>
                <li>انسخ والصق الكود أدناه</li>
                <li>اضغط Run</li>
                <li>أعد تحميل هذه الصفحة</li>
              </ol>
            </div>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto mb-4 max-h-96">
              <pre>{CREATE_ADS_TABLE_SQL}</pre>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔄 إعادة فحص النظام
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 إدارة الإعلانات - Supabase</h1>
          <p className="text-gray-600">نظام إدارة شامل للإعلانات مع قاعدة بيانات Supabase</p>
        </div>

        {/* Quick Actions - Monetag removed */}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'list', label: `📋 قائمة الإعلانات (${ads.length})` },
                { id: 'add', label: editingAd ? '✏️ تعديل إعلان' : '➕ إضافة إعلان' },
                { id: 'setup', label: '⚙️ إعداد النظام' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
                {isLoading ? (
                  <div className="text-center py-8">⏳ جاري التحميل...</div>
                ) : ads.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    📭 لا توجد إعلانات. استخدم الإضافة السريعة أعلاه للبدء.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ads.map((ad) => (
                      <div key={ad.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-gray-900 flex items-center">
                              📢 {ad.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {ad.type.toUpperCase()} | 📍 {ad.position} | 🎯 Zone: {ad.zone_id} | ⭐ Priority: {ad.priority}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              ad.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {ad.enabled ? '✅ نشط' : '❌ معطل'}
                            </span>
                            <button
                              onClick={() => toggleEnabled(ad)}
                              className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded"
                            >
                              {ad.enabled ? '⏸️ إيقاف' : '▶️ تشغيل'}
                            </button>
                            <button
                              onClick={() => handleEdit(ad)}
                              className="text-green-600 hover:text-green-800 text-sm px-2 py-1 rounded"
                            >
                              ✏️ تعديل
                            </button>
                            <button
                              onClick={() => handleDelete(ad.id)}
                              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
                            >
                              🗑️ حذف
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-3 rounded">
                          <div>
                            <span className="font-medium">📄 الصفحات:</span> {ad.pages.join(', ')}
                          </div>
                          <div>
                            <span className="font-medium">👁️ المشاهدات:</span> {ad.view_count}
                          </div>
                          <div>
                            <span className="font-medium">👆 النقرات:</span> {ad.click_count}
                          </div>
                          <div>
                            <span className="font-medium">⏱️ التأخير:</span> {ad.delay_seconds}s
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
                        📝 اسم الإعلان
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="مثال: Monetag Header Banner"
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

                        <option value="adsense">🎯 Google AdSense</option>
                        <option value="custom">🔧 مخصص</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📍 الموضع
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
                        🎯 Zone ID
                      </label>
                      <input
                        type="text"
                        value={formData.zone_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, zone_id: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="9593378"
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
                      💻 كود الإعلان (JavaScript)
                    </label>
                    <textarea
                      value={formData.script_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, script_code: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
                      rows={6}
                      placeholder="(function(d,z,s){s.src='https://'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('vemtoutcheeg.com',9593378,document.createElement('script'));"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📄 الصفحات (مفصولة بفاصلة)
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
                      className="mr-2"
                    />
                    <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                      ✅ تفعيل الإعلان
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      {editingAd ? '💾 تحديث الإعلان' : '➕ إضافة الإعلان'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    >
                      ❌ إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Setup Tab */}
            {activeTab === 'setup' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">⚙️ إعداد النظام</h2>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">✅ النظام جاهز</h3>
                    <p className="text-green-800 text-sm">
                      تم إعداد قاعدة البيانات بنجاح. يمكنك الآن إدارة الإعلانات.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">📊 معلومات النظام</h3>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>🗄️ جدول الإعلانات: ads</li>
                      <li>📈 جدول الأداء: ad_performance</li>
                      <li>✅ الإعلانات النشطة: {ads.filter(ad => ad.enabled).length}</li>
                      <li>📋 إجمالي الإعلانات: {ads.length}</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-900 mb-2">🔧 إعدادات CSP</h3>
                    <p className="text-yellow-800 text-sm mb-2">
                      تم تحديث Content Security Policy لدعم Monetag:
                    </p>
                    <code className="text-xs bg-yellow-100 p-2 rounded block">
                      https://vemtoutcheeg.com, https://*.vemtoutcheeg.com
                    </code>
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
