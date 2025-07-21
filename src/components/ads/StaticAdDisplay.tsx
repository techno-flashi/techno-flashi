'use client';

import { useState, useEffect } from 'react';

interface StaticAdDisplayProps {
  position: 'header' | 'footer' | 'in-content';
  className?: string;
}

// إعلانات ثابتة للاختبار
const staticAds = {
  header: [
    {
      id: '1',
      name: 'Flash Header Ad 1',
      title: 'خصم 50% على فواتير الإنترنت',
      html_content: `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; text-align: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">🎉 عرض خاص من Flash!</h3>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">وفر 50% على فواتير الإنترنت والموبايل والكهرباء</p>
        </div>
      `,
      click_url: 'https://lets.useflash.app/6gaijh'
    },
    {
      id: '2',
      name: 'Flash Header Ad 2',
      title: 'خصم 50% على فواتير الكهرباء',
      html_content: `
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 12px; text-align: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">⚡ Flash للفواتير</h3>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">ادفع فواتيرك بخصم 50% مع Flash</p>
        </div>
      `,
      click_url: 'https://lets.useflash.app/6gaijh'
    }
  ],
  'in-content': [
    {
      id: '3',
      name: 'Flash Content Ad',
      title: 'خصم 50% على جميع الفواتير',
      html_content: `
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 15px; text-align: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">💳 Flash - ادفع فواتيرك بذكاء</h3>
          <p style="margin: 0 0 15px 0; font-size: 16px; opacity: 0.9;">خصم 50% على فواتير الإنترنت، الموبايل، الكهرباء، والمياه</p>
          <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; font-size: 14px;">
            🎯 سهل • سريع • آمن
          </div>
        </div>
      `,
      click_url: 'https://lets.useflash.app/6gaijh'
    }
  ],
  footer: [
    {
      id: '4',
      name: 'Flash Footer Ad',
      title: 'Flash - الحل الذكي للفواتير',
      html_content: `
        <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 20px; border-radius: 12px; text-align: center; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">🚀 جرب Flash الآن</h3>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">وفر 50% على جميع فواتيرك مع Flash</p>
        </div>
      `,
      click_url: 'https://lets.useflash.app/6gaijh'
    }
  ]
};

export default function StaticAdDisplay({ position, className = '' }: StaticAdDisplayProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const ads = staticAds[position] || [];

  // Rotate ads every 10 seconds
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [ads.length]);

  const handleAdClick = (ad: any) => {
    if (ad.click_url) {
      window.open(ad.click_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className={`static-ad-display ${className}`}>
      <div 
        className="cursor-pointer transition-all duration-300 hover:opacity-90"
        onClick={() => handleAdClick(currentAd)}
        dangerouslySetInnerHTML={{ __html: currentAd.html_content }}
      />
      
      {ads.length > 1 && (
        <div className="flex justify-center mt-2 space-x-1">
          {ads.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentAdIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentAdIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
