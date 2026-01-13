'use client';

import { useState, useEffect } from 'react';

interface ScreenSize {
  name: string;
  width: number;
  height: number;
  description: string;
}

const screenSizes: ScreenSize[] = [
  { name: 'iPhone SE', width: 320, height: 568, description: 'أصغر شاشة موبايل' },
  { name: 'iPhone 12', width: 375, height: 812, description: 'موبايل متوسط' },
  { name: 'iPhone 12 Pro Max', width: 414, height: 896, description: 'موبايل كبير' },
  { name: 'iPad', width: 768, height: 1024, description: 'تابلت' },
  { name: 'Desktop', width: 1024, height: 768, description: 'سطح مكتب صغير' },
  { name: 'Large Desktop', width: 1440, height: 900, description: 'سطح مكتب كبير' },
];

export function ResponsiveTestHelper() {
  const [currentSize, setCurrentSize] = useState<ScreenSize | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show only in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  const applySize = (size: ScreenSize) => {
    setCurrentSize(size);
    // Apply size to viewport (for testing purposes)
    document.body.style.width = `${size.width}px`;
    document.body.style.maxWidth = `${size.width}px`;
    document.body.style.margin = '0 auto';
    document.body.style.border = '2px solid #38BDF8';
    document.body.style.boxSizing = 'border-box';
  };

  const resetSize = () => {
    setCurrentSize(null);
    document.body.style.width = '';
    document.body.style.maxWidth = '';
    document.body.style.margin = '';
    document.body.style.border = '';
    document.body.style.boxSizing = '';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-dark-card border border-gray-700 rounded-lg p-4 shadow-xl">
      <h3 className="text-white font-bold mb-3 text-sm">اختبار التصميم المتجاوب</h3>
      
      {currentSize && (
        <div className="mb-3 p-2 bg-primary/20 rounded text-xs text-white">
          <div>الحجم الحالي: {currentSize.name}</div>
          <div>{currentSize.width} × {currentSize.height}</div>
          <div>{currentSize.description}</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-3">
        {screenSizes.map((size) => (
          <button
            key={size.name}
            onClick={() => applySize(size)}
            className={`text-xs p-2 rounded transition-colors duration-200 ${
              currentSize?.name === size.name
                ? 'bg-primary text-white'
                : 'bg-text-secondary text-text-secondary hover:bg-text-primary'
            }`}
          >
            {size.name}
            <div className="text-xs opacity-75">{size.width}px</div>
          </button>
        ))}
      </div>

      <button
        onClick={resetSize}
        className="w-full bg-red-600 hover:bg-red-700 text-white text-xs p-2 rounded transition-colors duration-200"
      >
        إعادة تعيين
      </button>
    </div>
  );
}
