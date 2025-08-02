'use client';

import React, { useEffect, useState } from 'react';

interface AdProps {
  type: 'hostinger' | 'easysite';
  variant?: 'default' | 'compact' | 'banner';
  className?: string;
}

const PromoAd: React.FC<AdProps> = ({ type, variant = 'default', className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<string>('--:--');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const STORAGE_KEY = "promo_expiry_ts_v2";
    const DURATION_MS = 60 * 60 * 1000; // 60 دقيقة

    const safeGet = (key: string) => {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    };

    const safeSet = (key: string, val: string) => {
      try { localStorage.setItem(key, val); } catch (e) {}
    };

    const getExpiry = () => {
      const stored = safeGet(STORAGE_KEY);
      if (stored) {
        const ts = parseInt(stored, 10);
        if (!isNaN(ts)) return ts;
      }
      return null;
    };

    const initExpiry = () => {
      let expiry = getExpiry();
      const now = Date.now();
      if (!expiry || expiry <= now) {
        expiry = now + DURATION_MS;
        safeSet(STORAGE_KEY, expiry.toString());
      }
      return expiry;
    };

    const formatTime = (ms: number) => {
      const totalSec = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSec / 60);
      const seconds = totalSec % 60;
      return String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
    };

    const tick = () => {
      const expiry = initExpiry();
      const now = Date.now();
      const rem = expiry - now;

      if (rem <= 0) {
        setTimeLeft("انتهى العرض");
        setIsExpired(true);
        return;
      }

      setTimeLeft(formatTime(rem));
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []);

  const hostingerAd = {
    title: variant === 'compact' ? 'استضافة + دومين مجاني' : 'استضافة احترافية + دومين مجاني',
    text: variant === 'compact' ? 'خصم حتى 90%' : 'استخدم الكود HOSTSAVE90 لتفعيل العرض.',
    badge: 'خصم حتى 90%',
    url: 'https://www.hostg.xyz/aff_c?offer_id=988&aff_id=211204',
    cta: isExpired ? 'انتهى العرض' : '🔥 اشترك الآن',
    gradient: 'from-purple-600 to-purple-800'
  };

  const easysiteAd = {
    title: variant === 'compact' ? 'أنشئ موقعك في 5 دقائق' : 'أنشئ موقعك أو متجرك في 5 دقائق',
    text: 'بدون أي خبرة برمجية – ابدأ البيع اليوم.',
    badge: 'جرب الآن',
    url: 'https://easysite.ai?via=tflash',
    cta: isExpired ? 'انتهى العرض' : '🚀 ابدأ مجانًا',
    gradient: 'from-green-500 to-green-700'
  };

  const ad = type === 'hostinger' ? hostingerAd : easysiteAd;

  if (variant === 'banner') {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${ad.gradient} text-white p-4 my-4 ${className}`}>
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded transform rotate-3">
          عرض محدود
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold mb-1">{ad.title}</h3>
            <p className="text-sm opacity-90">{ad.text}</p>
            <p className="text-xs mt-2">⏳ العرض ينتهي خلال: <strong>{timeLeft}</strong></p>
          </div>
          <a 
            href={ad.url}
            className={`bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 ${isExpired ? 'opacity-60 pointer-events-none' : ''}`}
            aria-label={ad.cta}
          >
            {ad.cta}
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${ad.gradient} text-white p-3 my-2 max-w-sm ${className}`}>
        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12 scale-75">
          عرض محدود
        </div>
        <h4 className="text-sm font-bold mb-1">{ad.title}</h4>
        <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded mb-2">
          {ad.badge}
        </span>
        <p className="text-xs mb-2">⏳ ينتهي خلال: <strong>{timeLeft}</strong></p>
        <a 
          href={ad.url}
          className={`inline-block bg-yellow-400 text-black font-bold text-xs px-3 py-2 rounded hover:bg-yellow-300 transition-all ${isExpired ? 'opacity-60 pointer-events-none' : ''}`}
          aria-label={ad.cta}
        >
          {ad.cta}
        </a>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${ad.gradient} text-white p-5 my-4 max-w-md mx-auto shadow-xl ${className}`}>
      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-6">
        عرض محدود
      </div>
      <h3 className="text-xl font-bold mb-2 pr-16">{ad.title}</h3>
      <p className="mb-3">
        <span className="inline-block bg-yellow-400 text-black text-sm font-bold px-2 py-1 rounded mr-2">
          {ad.badge}
        </span>
        {ad.text}
      </p>
      <p className="text-sm mb-3">⏳ العرض ينتهي خلال: <strong>{timeLeft}</strong></p>
      <a 
        href={ad.url}
        className={`inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 ${isExpired ? 'opacity-60 pointer-events-none' : ''}`}
        aria-label={ad.cta}
      >
        {ad.cta}
      </a>
    </div>
  );
};

export default PromoAd;