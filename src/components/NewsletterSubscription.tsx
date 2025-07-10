'use client';

import { useState } from 'react';
import { validateEmail } from '@/lib/newsletterService';
import { trackNewsletterSubscribe } from '@/lib/gtag';

interface NewsletterSubscriptionProps {
  variant?: 'default' | 'compact' | 'featured';
  source?: string;
  className?: string;
  showName?: boolean;
  title?: string;
  description?: string;
}

export function NewsletterSubscription({
  variant = 'default',
  source = 'website',
  className = '',
  showName = false,
  title,
  description
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // النصوص الافتراضية حسب النوع
  const getDefaultContent = () => {
    switch (variant) {
      case 'featured':
        return {
          title: 'انضم إلى مجتمع TechnoFlash',
          description: 'احصل على نشرة أسبوعية مليئة بأحدث المقالات التقنية، أدوات الذكاء الاصطناعي المبتكرة، ونصائح البرمجة العملية مباشرة في بريدك الإلكتروني.'
        };
      case 'compact':
        return {
          title: 'اشترك في النشرة البريدية',
          description: 'أحدث المقالات التقنية أسبوعياً'
        };
      default:
        return {
          title: 'ابق على اطلاع دائم',
          description: 'اشترك في نشرتنا الأسبوعية واحصل على أحدث المقالات التقنية وأدوات الذكاء الاصطناعي'
        };
    }
  };

  const defaultContent = getDefaultContent();
  const finalTitle = title || defaultContent.title;
  const finalDescription = description || defaultContent.description;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('يرجى إدخال البريد الإلكتروني');
      setIsSuccess(false);
      return;
    }

    if (!validateEmail(email)) {
      setMessage('يرجى إدخال بريد إلكتروني صحيح');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          source
        }),
      });

      const result = await response.json();

      setMessage(result.message);
      setIsSuccess(result.success);

      if (result.success) {
        setIsSubscribed(true);
        setEmail('');
        setName('');

        // تتبع الاشتراك في Google Analytics
        trackNewsletterSubscribe(email.trim());
      }

    } catch (error) {
      console.error('خطأ في الاشتراك:', error);
      setMessage('حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // تصميم مضغوط
  if (variant === 'compact') {
    return (
      <div className={`bg-dark-card rounded-lg p-4 border border-gray-800 ${className}`}>
        <div className="flex items-center space-x-3 space-x-reverse mb-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium text-sm">{finalTitle}</h4>
            <p className="text-dark-text-secondary text-xs">{finalDescription}</p>
          </div>
        </div>

        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-dark-background border border-gray-700 rounded-md text-white text-sm placeholder-dark-text-secondary focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? 'جاري...' : 'اشترك'}
              </button>
            </div>
            
            {message && (
              <p className={`text-xs ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </form>
        ) : (
          <div className="text-center py-2">
            <div className="flex items-center justify-center space-x-2 space-x-reverse text-green-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">تم الاشتراك بنجاح!</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // تصميم مميز
  if (variant === 'featured') {
    return (
      <section className={`py-20 px-4 bg-gradient-to-r from-primary/10 to-blue-600/10 ${className}`}>
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            {/* الأيقونة */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="text-4xl font-bold text-white mb-6">
              {finalTitle}
            </h2>
            <p className="text-xl text-dark-text-secondary mb-8">
              {finalDescription}
            </p>

            {/* المميزات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">مقالات حصرية</h3>
                <p className="text-dark-text-secondary text-sm">محتوى تقني متخصص لا تجده في أي مكان آخر</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">أدوات ذكية</h3>
                <p className="text-dark-text-secondary text-sm">اكتشف أحدث أدوات الذكاء الاصطناعي قبل الجميع</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">توقيت مثالي</h3>
                <p className="text-dark-text-secondary text-sm">نشرة أسبوعية كل يوم أحد في الصباح</p>
              </div>
            </div>

            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="space-y-4">
                  {showName && (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="اسمك (اختياري)"
                      disabled={isLoading}
                      className="w-full px-6 py-3 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50"
                    />
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="بريدك الإلكتروني"
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary hover:bg-blue-600 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>جاري الاشتراك...</span>
                        </div>
                      ) : (
                        'اشترك مجاناً'
                      )}
                    </button>
                  </div>
                </div>
                
                {message && (
                  <p className={`mt-4 text-center ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                  </p>
                )}
                
                <p className="text-dark-text-secondary text-sm mt-4">
                  بالاشتراك، أنت توافق على تلقي رسائل بريدية من TechnoFlash. يمكنك إلغاء الاشتراك في أي وقت.
                </p>
              </form>
            ) : (
              <div className="max-w-md mx-auto text-center">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">مرحباً بك في مجتمع TechnoFlash!</h3>
                  <p className="text-green-400 mb-4">{message}</p>
                  <p className="text-dark-text-secondary text-sm">
                    ستصلك أول نشرة بريدية يوم الأحد القادم
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // التصميم الافتراضي
  return (
    <div className={`bg-dark-card rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{finalTitle}</h3>
        <p className="text-dark-text-secondary">{finalDescription}</p>
      </div>

      {!isSubscribed ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {showName && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك (اختياري)"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50"
            />
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-dark-background border border-gray-700 rounded-lg text-white placeholder-dark-text-secondary focus:outline-none focus:border-primary transition-colors duration-300 disabled:opacity-50"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-blue-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? 'جاري...' : 'اشترك'}
            </button>
          </div>
          
          {message && (
            <p className={`text-sm text-center ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </form>
      ) : (
        <div className="text-center py-4">
          <div className="flex items-center justify-center space-x-2 space-x-reverse text-green-400 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">تم الاشتراك بنجاح!</span>
          </div>
          <p className="text-dark-text-secondary text-sm">{message}</p>
        </div>
      )}
    </div>
  );
}
