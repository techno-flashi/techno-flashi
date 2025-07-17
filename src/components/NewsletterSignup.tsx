'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setStatus('loading');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          {
            email: email.toLowerCase().trim(),
            subscribed_at: new Date().toISOString(),
            is_active: true
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setStatus('error');
          setMessage('هذا البريد الإلكتروني مسجل مسبقاً');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setMessage('تم الاشتراك بنجاح! شكراً لك');
        setEmail('');
      }
    } catch (error) {
      setStatus('error');
      setMessage('حدث خطأ، يرجى المحاولة مرة أخرى');
      console.error('Newsletter signup error:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">
          📧 اشترك في نشرتنا البريدية
        </h3>
        <p className="text-blue-100 mb-6">
          احصل على آخر المقالات والمراجعات حول أدوات الذكاء الاصطناعي مباشرة في بريدك الإلكتروني
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            className="flex-1 px-4 py-3 rounded-lg text-text-primary placeholder-text-description focus:outline-none focus:ring-2 focus:ring-white"
            disabled={status === 'loading'}
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-background-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'جاري الاشتراك...' : 'اشترك الآن'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg ${
            status === 'success' 
              ? 'bg-green-500 bg-opacity-20 text-green-100' 
              : 'bg-red-500 bg-opacity-20 text-red-100'
          }`}>
            {message}
          </div>
        )}

        <p className="text-blue-200 text-sm mt-4">
          💡 نرسل مقالاً واحداً أسبوعياً فقط، ولا نشارك بريدك مع أي طرف ثالث
        </p>
      </div>
    </div>
  );
}
