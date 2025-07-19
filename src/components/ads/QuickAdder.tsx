'use client';

import { useState } from 'react';

interface QuickAdderProps {
  onClose?: () => void;
}

export default function QuickAdder({ onClose }: QuickAdderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [adCode, setAdCode] = useState('');
  const [adName, setAdName] = useState('');
  const [position, setPosition] = useState<'header' | 'sidebar' | 'in-content' | 'footer'>('header');

  const addQuickAd = () => {
    if (!adCode.trim() || !adName.trim()) {
      alert('يرجى إدخال اسم الإعلان والكود');
      return;
    }

    // Extract zone ID from script
    const zoneMatch = adCode.match(/\/400\/(\d+)/);
    const zoneId = zoneMatch ? zoneMatch[1] : Date.now().toString();

    const newAd = {
      id: `monetag-quick-${Date.now()}`,
      name: adName,
      position: position,
      enabled: true,
      pages: ['/', '/articles', '/ai-tools'],
      script: adCode,
      zoneId: zoneId
    };

    // Get existing configs
    const existingConfigs = JSON.parse(localStorage.getItem('monetagAdConfigs') || '[]');
    const updatedConfigs = [...existingConfigs, newAd];
    
    // Save to localStorage
    localStorage.setItem('monetagAdConfigs', JSON.stringify(updatedConfigs));
    
    alert('تم إضافة الإعلان بنجاح! سيظهر في الصفحة التالية.');
    
    // Reset form
    setAdCode('');
    setAdName('');
    setPosition('header');
    setIsOpen(false);
    
    if (onClose) onClose();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 z-50"
        title="إضافة إعلان سريع"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">إضافة إعلان Monetag سريع</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم الإعلان
              </label>
              <input
                type="text"
                value={adName}
                onChange={(e) => setAdName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="مثال: إعلان جديد"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الموضع
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="header">Header</option>
                <option value="sidebar">Sidebar</option>
                <option value="in-content">In-Content</option>
                <option value="footer">Footer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كود الإعلان
              </label>
              <textarea
                value={adCode}
                onChange={(e) => setAdCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
                rows={4}
                placeholder="الصق كود Monetag هنا..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-800">
                <strong>مثال:</strong><br />
                <code className="text-xs">
                  &lt;script&gt;(function(d,z,s)&#123;...&#125;)('vemtoutcheeg.com',9593378,...)&lt;/script&gt;
                </code>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={addQuickAd}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
              >
                إضافة الإعلان
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for quick access
export function useQuickAdder() {
  const [isVisible, setIsVisible] = useState(false);

  const showQuickAdder = () => setIsVisible(true);
  const hideQuickAdder = () => setIsVisible(false);

  return {
    isVisible,
    showQuickAdder,
    hideQuickAdder,
    QuickAdderComponent: isVisible ? <QuickAdder onClose={hideQuickAdder} /> : null
  };
}

// Simple button component for admin pages
export function QuickAdderButton() {
  const { showQuickAdder, QuickAdderComponent } = useQuickAdder();

  return (
    <>
      <button
        onClick={showQuickAdder}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
      >
        ➕ إضافة إعلان سريع
      </button>
      {QuickAdderComponent}
    </>
  );
}
