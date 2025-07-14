'use client';

import { useState } from 'react';

interface Stats {
  total: number;
  withSvgIcons: number;
  needsUpdate: number;
  categories: Record<string, number>;
}

interface UpdateResult {
  tool: string;
  status: 'success' | 'error';
  icon?: string;
  iconUrl?: string;
  error?: string;
}

export default function UpdateIconsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [results, setResults] = useState<UpdateResult[]>([]);
  const [message, setMessage] = useState('');

  // جلب الإحصائيات
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/update-icons');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        setMessage('خطأ في جلب الإحصائيات: ' + data.error);
      }
    } catch (error) {
      setMessage('خطأ في الاتصال: ' + error);
    }
    setLoading(false);
  };

  // تحديث جميع الأدوات
  const updateAllTools = async () => {
    setUpdating(true);
    setResults([]);
    setMessage('');
    
    try {
      const response = await fetch('/api/update-icons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'update-all' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ تم تحديث ${data.updated} أداة بنجاح من أصل ${data.total}`);
        setResults(data.results || []);
        // تحديث الإحصائيات
        await fetchStats();
      } else {
        setMessage('❌ خطأ في التحديث: ' + data.error);
      }
    } catch (error) {
      setMessage('❌ خطأ في الاتصال: ' + error);
    }
    
    setUpdating(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🎨 تحديث أيقونات أدوات الذكاء الاصطناعي
        </h1>

        {/* أزرار التحكم */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? '⏳ جاري التحميل...' : '📊 عرض الإحصائيات'}
          </button>
          
          <button
            onClick={updateAllTools}
            disabled={updating || !stats}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {updating ? '⏳ جاري التحديث...' : '🚀 تحديث جميع الأدوات'}
          </button>
        </div>

        {/* الرسائل */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('✅') ? 'bg-green-900/50 border border-green-500' : 
            'bg-red-900/50 border border-red-500'
          }`}>
            {message}
          </div>
        )}

        {/* الإحصائيات */}
        {stats && (
          <div className="bg-dark-card rounded-lg p-6 mb-8 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">📈 إحصائيات الأدوات</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-900/30 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                <div className="text-sm text-gray-400">إجمالي الأدوات</div>
              </div>
              
              <div className="bg-green-900/30 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">{stats.withSvgIcons}</div>
                <div className="text-sm text-gray-400">مع أيقونات SVG</div>
              </div>
              
              <div className="bg-orange-900/30 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-400">{stats.needsUpdate}</div>
                <div className="text-sm text-gray-400">تحتاج تحديث</div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">📂 الفئات:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} className="bg-gray-800 p-2 rounded text-sm">
                  <span className="font-medium">{category}:</span> {count}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نتائج التحديث */}
        {results.length > 0 && (
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">📋 نتائج التحديث</h2>
            
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg mb-2 ${
                    result.status === 'success' 
                      ? 'bg-green-900/30 border border-green-500/30' 
                      : 'bg-red-900/30 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{result.tool}</span>
                      {result.status === 'success' && result.icon && (
                        <span className="text-sm text-gray-400 ml-2">
                          → {result.icon}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {result.status === 'success' ? (
                        <>
                          {result.iconUrl && (
                            <img 
                              src={result.iconUrl} 
                              alt={result.icon}
                              className="w-6 h-6 filter invert"
                            />
                          )}
                          <span className="text-green-400">✅</span>
                        </>
                      ) : (
                        <span className="text-red-400">❌</span>
                      )}
                    </div>
                  </div>
                  
                  {result.error && (
                    <div className="text-sm text-red-300 mt-1">
                      {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>🎨 الأيقونات من: <a href="https://www.svgrepo.com/" target="_blank" className="text-blue-400 hover:underline">SVG Repo</a></p>
          <p>⚡ يتم اختيار الأيقونة المناسبة تلقائياً بناءً على اسم الأداة ووصفها</p>
        </div>
      </div>
    </div>
  );
}
