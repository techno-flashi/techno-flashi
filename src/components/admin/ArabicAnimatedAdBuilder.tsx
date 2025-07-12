'use client';

import React, { useState } from 'react';

interface ArabicAnimatedAdBuilderProps {
  onAdGenerated: (adCode: string) => void;
}

export function ArabicAnimatedAdBuilder({ onAdGenerated }: ArabicAnimatedAdBuilderProps) {
  const [adConfig, setAdConfig] = useState({
    title: 'عنوان الإعلان',
    subtitle: 'وصف الإعلان',
    ctaText: 'انقر هنا',
    animationType: 'slideIn',
    colorScheme: 'blue',
    fontSize: 'medium'
  });

  const animationTypes = [
    { value: 'slideIn', label: 'انزلاق من اليمين', css: 'slideInRight' },
    { value: 'fadeIn', label: 'ظهور تدريجي', css: 'fadeIn' },
    { value: 'bounceIn', label: 'ارتداد', css: 'bounceIn' },
    { value: 'rotateIn', label: 'دوران', css: 'rotateIn' },
    { value: 'zoomIn', label: 'تكبير', css: 'zoomIn' },
    { value: 'glow', label: 'توهج', css: 'glow' }
  ];

  const colorSchemes = [
    { value: 'blue', label: 'أزرق', primary: '#38BDF8', secondary: '#0EA5E9' },
    { value: 'green', label: 'أخضر', primary: '#10B981', secondary: '#059669' },
    { value: 'purple', label: 'بنفسجي', primary: '#8B5CF6', secondary: '#7C3AED' },
    { value: 'orange', label: 'برتقالي', primary: '#F59E0B', secondary: '#D97706' },
    { value: 'red', label: 'أحمر', primary: '#EF4444', secondary: '#DC2626' },
    { value: 'gradient', label: 'متدرج', primary: 'linear-gradient(45deg, #667eea, #764ba2)', secondary: '#667eea' }
  ];

  const fontSizes = [
    { value: 'small', label: 'صغير', titleSize: '1.2em', subtitleSize: '0.9em' },
    { value: 'medium', label: 'متوسط', titleSize: '1.5em', subtitleSize: '1em' },
    { value: 'large', label: 'كبير', titleSize: '2em', subtitleSize: '1.2em' }
  ];

  const generateAdCode = () => {
    const selectedAnimation = animationTypes.find(a => a.value === adConfig.animationType);
    const selectedColor = colorSchemes.find(c => c.value === adConfig.colorScheme);
    const selectedFont = fontSizes.find(f => f.value === adConfig.fontSize);

    const adCode = `
<div class="arabic-animated-ad-${Date.now()}">
  <style>
    .arabic-animated-ad-${Date.now()} {
      direction: rtl;
      text-align: right;
      font-family: 'Cairo', 'Amiri', 'Noto Sans Arabic', system-ui, sans-serif;
      background: ${selectedColor?.value === 'gradient' ? selectedColor.primary : selectedColor?.primary};
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      overflow: hidden;
      position: relative;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .arabic-animated-ad-${Date.now()}:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    }
    
    .arabic-animated-ad-${Date.now()}::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
      transform: translateX(-100%);
      animation: shine 3s infinite;
    }
    
    .arabic-animated-ad-${Date.now()} .title {
      font-size: ${selectedFont?.titleSize};
      font-weight: bold;
      margin-bottom: 8px;
      animation: ${selectedAnimation?.css} 1s ease-out;
    }
    
    .arabic-animated-ad-${Date.now()} .subtitle {
      font-size: ${selectedFont?.subtitleSize};
      margin-bottom: 15px;
      opacity: 0.9;
      animation: ${selectedAnimation?.css} 1s ease-out 0.3s both;
    }
    
    .arabic-animated-ad-${Date.now()} .cta-button {
      background: ${selectedColor?.secondary};
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      font-family: inherit;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: ${selectedAnimation?.css} 1s ease-out 0.6s both;
      align-self: flex-start;
    }
    
    .arabic-animated-ad-${Date.now()} .cta-button:hover {
      background: ${selectedColor?.primary};
      transform: scale(1.05);
    }
    
    /* الرسوم المتحركة */
    @keyframes slideInRight {
      from { transform: translateX(50px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes bounceIn {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes rotateIn {
      from { transform: rotate(-200deg); opacity: 0; }
      to { transform: rotate(0); opacity: 1; }
    }
    
    @keyframes zoomIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes glow {
      0%, 100% { 
        text-shadow: 0 0 5px rgba(255,255,255,0.5);
        box-shadow: 0 0 10px ${selectedColor?.secondary}40;
      }
      50% { 
        text-shadow: 0 0 20px rgba(255,255,255,0.8);
        box-shadow: 0 0 30px ${selectedColor?.secondary}80;
      }
    }
    
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    /* تحسينات للأجهزة المحمولة */
    @media (max-width: 768px) {
      .arabic-animated-ad-${Date.now()} {
        padding: 15px;
        min-height: 100px;
      }
      
      .arabic-animated-ad-${Date.now()} .title {
        font-size: calc(${selectedFont?.titleSize} * 0.8);
      }
      
      .arabic-animated-ad-${Date.now()} .subtitle {
        font-size: calc(${selectedFont?.subtitleSize} * 0.9);
      }
    }
  </style>
  
  <div class="title">${adConfig.title}</div>
  <div class="subtitle">${adConfig.subtitle}</div>
  <button class="cta-button" onclick="window.open('#', '_blank')">${adConfig.ctaText}</button>
</div>`;

    return adCode;
  };

  const handleGenerate = () => {
    const code = generateAdCode();
    onAdGenerated(code);
  };

  return (
    <div className="bg-dark-card rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-6">منشئ الإعلانات العربية المتحركة</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* النصوص */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">العنوان</label>
            <input
              type="text"
              value={adConfig.title}
              onChange={(e) => setAdConfig({ ...adConfig, title: e.target.value })}
              className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="أدخل عنوان الإعلان"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">الوصف</label>
            <textarea
              value={adConfig.subtitle}
              onChange={(e) => setAdConfig({ ...adConfig, subtitle: e.target.value })}
              className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              rows={3}
              placeholder="أدخل وصف الإعلان"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">نص الزر</label>
            <input
              type="text"
              value={adConfig.ctaText}
              onChange={(e) => setAdConfig({ ...adConfig, ctaText: e.target.value })}
              className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="نص الزر"
            />
          </div>
        </div>
        
        {/* الإعدادات */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">نوع الحركة</label>
            <select
              value={adConfig.animationType}
              onChange={(e) => setAdConfig({ ...adConfig, animationType: e.target.value })}
              className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {animationTypes.map((animation) => (
                <option key={animation.value} value={animation.value}>
                  {animation.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">نظام الألوان</label>
            <select
              value={adConfig.colorScheme}
              onChange={(e) => setAdConfig({ ...adConfig, colorScheme: e.target.value })}
              className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {colorSchemes.map((scheme) => (
                <option key={scheme.value} value={scheme.value}>
                  {scheme.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">حجم الخط</label>
            <select
              value={adConfig.fontSize}
              onChange={(e) => setAdConfig({ ...adConfig, fontSize: e.target.value })}
              className="w-full bg-dark-background border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {fontSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* معاينة مباشرة */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-dark-text-secondary mb-3">معاينة مباشرة:</h4>
        <div 
          className="border border-gray-600 rounded-lg p-4 bg-gray-800"
          dangerouslySetInnerHTML={{ __html: generateAdCode() }}
        />
      </div>
      
      {/* زر الإنشاء */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleGenerate}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إنشاء الإعلان
        </button>
      </div>
    </div>
  );
}
