'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth(); // استدعاء الوظيفة من المصدر المركزي

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // التحقق من البيانات
    if (!email || !password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    setError(null);

    console.log('🔐 محاولة تسجيل الدخول...', { email });

    try {
      await signIn(email, password);
      console.log('✅ تم تسجيل الدخول بنجاح');
      // سيتم إعادة التوجيه تلقائياً من داخل وظيفة signIn
    } catch (err: any) {
      console.error('❌ خطأ في تسجيل الدخول:', err);

      let errorMessage = 'حدث خطأ غير متوقع';

      if (err.message === 'Invalid login credentials') {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage = 'يرجى تأكيد البريد الإلكتروني أولاً.';
      } else if (err.message.includes('Too many requests')) {
        errorMessage = 'محاولات كثيرة جداً. يرجى المحاولة لاحقاً.';
      } else {
        errorMessage = err.message || 'حدث خطأ في الاتصال';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-dark-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">تسجيل الدخول</h1>


        <form onSubmit={handleLogin} className="space-y-6" method="post" action="#">
          <div>
            <label className="block mb-2 text-sm font-medium text-dark-text-secondary">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-dark-text-secondary">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white bg-primary rounded-md hover:bg-primary/90 disabled:bg-gray-500"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
