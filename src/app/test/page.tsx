'use client';

// صفحة اختبار الاتصال بـ Supabase
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState('جاري الاختبار...');
  const [details, setDetails] = useState<any>({});

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // اختبار الاتصال الأساسي
      const { data, error } = await supabase.from('articles').select('count').limit(1);
      
      if (error) {
        setStatus('❌ خطأ في الاتصال');
        setDetails({ error: error.message });
        return;
      }

      // اختبار المصادقة
      const { data: { session } } = await supabase.auth.getSession();
      
      setStatus('✅ الاتصال يعمل بنجاح');
      setDetails({
        database: 'متصل',
        session: session ? 'مسجل دخول' : 'غير مسجل دخول',
        user: session?.user?.email || 'لا يوجد',
      });
      
    } catch (err: any) {
      setStatus('❌ خطأ في الاتصال');
      setDetails({ error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">اختبار الاتصال بـ Supabase</h1>
        
        <div className="bg-[#161B22] rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">حالة الاتصال</h2>
          <p className="text-lg mb-4">{status}</p>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">التفاصيل:</h3>
            <pre className="bg-[#0D1117] p-4 rounded text-green-400 text-sm overflow-x-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
          
          <div className="mt-6 space-y-4">
            <button
              onClick={testConnection}
              className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white px-4 py-2 rounded transition-colors duration-300"
            >
              إعادة الاختبار
            </button>
            
            <div className="text-sm text-gray-400">
              <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
              <p><strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-[#161B22] rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">الخطوات التالية:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>إذا كان الاتصال يعمل، اذهب إلى <a href="/login" className="text-[#38BDF8] hover:underline">/login</a></li>
            <li>سجل دخول بالمستخدم الذي أنشأته في Supabase</li>
            <li>بعد تسجيل الدخول، اذهب إلى <a href="/admin" className="text-[#38BDF8] hover:underline">/admin</a></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
