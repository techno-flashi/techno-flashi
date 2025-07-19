'use client';

import { useState, useEffect } from 'react';
import { useMonetagManager, checkMonetagStatus, trackMonetagEvent, type MonetagAdConfig } from '@/components/ads/MonetagManager';
import { QuickAdderButton } from '@/components/ads/QuickAdder';

export default function MonetagAdminPage() {
  const { adConfigs, updateAdConfig, toggleAd, saveConfigs } = useMonetagManager();
  const [status, setStatus] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'configs' | 'status' | 'performance' | 'add-code'>('configs');
  const [newAdCode, setNewAdCode] = useState('');
  const [newAdName, setNewAdName] = useState('');
  const [newAdPosition, setNewAdPosition] = useState<'header' | 'sidebar' | 'footer' | 'in-content'>('header');

  useEffect(() => {
    // Check Monetag status
    setStatus(checkMonetagStatus());
    
    // Load performance data
    const perfData = JSON.parse(localStorage.getItem('monetagPerformance') || '[]');
    setPerformance(perfData);
  }, []);

  const handleSaveConfigs = () => {
    saveConfigs();
    alert('تم حفظ إعدادات Monetag بنجاح!');
  };

  const handleTestAd = (adId: string) => {
    trackMonetagEvent(adId, 'click');
    alert(`تم اختبار الإعلان: ${adId}`);
  };

  const clearPerformanceData = () => {
    localStorage.removeItem('monetagPerformance');
    setPerformance([]);
    alert('تم مسح بيانات الأداء');
  };

  const addNewAdCode = () => {
    if (!newAdCode.trim() || !newAdName.trim()) {
      alert('يرجى إدخال اسم الإعلان والكود');
      return;
    }

    // Extract zone ID from script if possible
    const zoneMatch = newAdCode.match(/\/400\/(\d+)/);
    const zoneId = zoneMatch ? zoneMatch[1] : Date.now().toString();

    const newAd: MonetagAdConfig = {
      id: `monetag-custom-${Date.now()}`,
      name: newAdName,
      position: newAdPosition,
      enabled: true,
      pages: ['/', '/articles', '/ai-tools'],
      script: newAdCode,
      zoneId: zoneId
    };

    // Add to current configs
    const updatedConfigs = [...adConfigs, newAd];
    localStorage.setItem('monetagAdConfigs', JSON.stringify(updatedConfigs));

    // Reset form
    setNewAdCode('');
    setNewAdName('');
    setNewAdPosition('header');

    alert('تم إضافة الإعلان بنجاح! يرجى إعادة تحميل الصفحة لرؤية التغييرات.');
    window.location.reload();
  };

  const deleteAd = (adId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      const updatedConfigs = adConfigs.filter(ad => ad.id !== adId);
      localStorage.setItem('monetagAdConfigs', JSON.stringify(updatedConfigs));
      alert('تم حذف الإعلان بنجاح! يرجى إعادة تحميل الصفحة لرؤية التغييرات.');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة إعلانات Monetag</h1>
              <p className="text-gray-600">إدارة وتتبع إعلانات Monetag على الموقع</p>
            </div>
            <div>
              <QuickAdderButton />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'add-code', label: '➕ إضافة كود إعلان' },
                { id: 'configs', label: 'إعدادات الإعلانات' },
                { id: 'status', label: 'حالة النظام' },
                { id: 'performance', label: 'تتبع الأداء' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Add Code Tab */}
            {activeTab === 'add-code' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">إضافة كود إعلان Monetag جديد</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-2">كيفية الحصول على كود الإعلان:</h3>
                  <ol className="list-decimal list-inside text-blue-800 text-sm space-y-1">
                    <li>اذهب إلى لوحة تحكم Monetag</li>
                    <li>انشئ إعلان جديد أو اختر إعلان موجود</li>
                    <li>انسخ الكود الذي يبدأ بـ &lt;script&gt;</li>
                    <li>الصق الكود في الحقل أدناه</li>
                  </ol>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الإعلان
                    </label>
                    <input
                      type="text"
                      value={newAdName}
                      onChange={(e) => setNewAdName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: إعلان الهيدر الجديد"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      موضع الإعلان
                    </label>
                    <select
                      value={newAdPosition}
                      onChange={(e) => setNewAdPosition(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="header">Header - أعلى الصفحة</option>
                      <option value="sidebar">Sidebar - الشريط الجانبي</option>
                      <option value="in-content">In-Content - داخل المحتوى</option>
                      <option value="footer">Footer - أسفل الصفحة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كود الإعلان (Script)
                    </label>
                    <textarea
                      value={newAdCode}
                      onChange={(e) => setNewAdCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      rows={6}
                      placeholder="الصق كود Monetag هنا...
مثال:
<script>(function(d,z,s){s.src='https://'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('vemtoutcheeg.com',9593378,document.createElement('script'))</script>"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">مثال على الكود الصحيح:</h4>
                    <code className="text-sm text-yellow-800 bg-yellow-100 p-2 rounded block">
                      &lt;script&gt;(function(d,z,s)&#123;s.src='https://'+d+'/400/'+z;try&#123;(document.body||document.documentElement).appendChild(s)&#125;catch(e)&#123;&#125;&#125;)('vemtoutcheeg.com',9593378,document.createElement('script'))&lt;/script&gt;
                    </code>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={addNewAdCode}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
                    >
                      ✅ إضافة الإعلان
                    </button>
                    <button
                      onClick={() => {
                        setNewAdCode('');
                        setNewAdName('');
                        setNewAdPosition('header');
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                    >
                      مسح الحقول
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Configs Tab */}
            {activeTab === 'configs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">إعدادات الإعلانات</h2>
                  <button
                    onClick={handleSaveConfigs}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    حفظ الإعدادات
                  </button>
                </div>

                <div className="space-y-4">
                  {adConfigs.map((ad) => (
                    <div key={ad.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{ad.name}</h3>
                          <p className="text-sm text-gray-500">
                            الموضع: {ad.position} | Zone ID: {ad.zoneId}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleTestAd(ad.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded"
                          >
                            اختبار
                          </button>
                          <button
                            onClick={() => deleteAd(ad.id)}
                            className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
                          >
                            حذف
                          </button>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ad.enabled}
                              onChange={() => toggleAd(ad.id)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            الصفحات
                          </label>
                          <input
                            type="text"
                            value={ad.pages.join(', ')}
                            onChange={(e) => updateAdConfig(ad.id, {
                              pages: e.target.value.split(',').map(p => p.trim())
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="/, /articles, /ai-tools"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            التأخير (ثانية)
                          </label>
                          <input
                            type="number"
                            value={ad.delay || 0}
                            onChange={(e) => updateAdConfig(ad.id, {
                              delay: parseInt(e.target.value) || 0
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            min="0"
                            max="10"
                          />
                        </div>
                      </div>

                      {ad.script && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            كود الإعلان
                          </label>
                          <textarea
                            value={ad.script}
                            onChange={(e) => updateAdConfig(ad.id, { script: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                            rows={3}
                            placeholder="الصق كود Monetag الجديد هنا..."
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            يمكنك تعديل الكود مباشرة هنا. لا تنس الضغط على "حفظ الإعدادات" بعد التعديل.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Tab */}
            {activeTab === 'status' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">حالة نظام Monetag</h2>
                
                {status && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Meta Tag</h3>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          status.metaTagPresent 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {status.metaTagPresent ? '✓ موجود' : '✗ غير موجود'}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Scripts</h3>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          status.scriptsLoaded 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {status.scriptsLoaded ? '✓ محملة' : '✗ غير محملة'}
                        </div>
                      </div>
                    </div>

                    {status.errors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-medium text-red-900 mb-2">الأخطاء</h3>
                        <ul className="list-disc list-inside text-red-700 text-sm">
                          {status.errors.map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">معلومات إضافية</h3>
                      <div className="text-blue-700 text-sm space-y-1">
                        <p>• تأكد من وجود Meta Tag في &lt;head&gt;</p>
                        <p>• تحقق من تحميل Scripts بشكل صحيح</p>
                        <p>• راجع Console للأخطاء</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">تتبع الأداء</h2>
                  <button
                    onClick={clearPerformanceData}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                  >
                    مسح البيانات
                  </button>
                </div>

                {performance.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            الإعلان
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            الحدث
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            الصفحة
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            الوقت
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {performance.slice(-20).reverse().map((event, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {event.adId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                event.event === 'load' ? 'bg-blue-100 text-blue-800' :
                                event.event === 'view' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {event.event}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {event.page}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(event.timestamp).toLocaleString('ar-SA')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    لا توجد بيانات أداء متاحة
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
