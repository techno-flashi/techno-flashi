'use client';

import React, { useState, useEffect } from 'react';
import { Ad, DeviceType } from '@/types';
import DOMPurify from 'isomorphic-dompurify';

// دالة للكشف عن النصوص العربية
function containsArabic(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

// دالة لتحسين عرض النصوص العربية
function enhanceArabicText(content: string): string {
  if (!containsArabic(content)) return content;

  return `
    <style>
      .arabic-enhanced {
        direction: rtl !important;
        text-align: right !important;
        font-family: 'Cairo', 'Amiri', 'Noto Sans Arabic', 'Tajawal', 'Almarai', system-ui, sans-serif !important;
        line-height: 1.6 !important;
        word-spacing: 0.1em !important;
        letter-spacing: 0.02em !important;
      }
      .arabic-enhanced * {
        direction: rtl !important;
        text-align: inherit !important;
        font-family: inherit !important;
      }
      .arabic-enhanced h1, .arabic-enhanced h2, .arabic-enhanced h3 {
        font-weight: 700 !important;
        margin-bottom: 0.5em !important;
      }
      .arabic-enhanced p {
        margin-bottom: 1em !important;
        line-height: 1.8 !important;
      }
      /* دعم الرسوم المتحركة للنصوص العربية */
      .arabic-animated {
        animation: fadeInRight 1s ease-in-out;
      }
      @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .arabic-glow {
        text-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
        animation: glow 2s ease-in-out infinite alternate;
      }
      @keyframes glow {
        from { text-shadow: 0 0 10px rgba(56, 189, 248, 0.5); }
        to { text-shadow: 0 0 20px rgba(56, 189, 248, 0.8), 0 0 30px rgba(56, 189, 248, 0.6); }
      }
    </style>
    <div class="arabic-enhanced">
      ${content}
    </div>
  `;
}

interface AdPreviewProps {
  ad: Partial<Ad>;
  deviceType?: DeviceType;
  className?: string;
}

export function AdPreview({ ad, deviceType = 'desktop', className = '' }: AdPreviewProps) {
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // تحديد أبعاد الإعلان حسب نوع الجهاز
  const getAdDimensions = () => {
    if (ad.responsive_settings) {
      switch (deviceType) {
        case 'mobile':
          return ad.responsive_settings.mobile;
        case 'tablet':
          return ad.responsive_settings.tablet;
        default:
          return ad.responsive_settings.desktop;
      }
    }
    return { width: ad.width || 300, height: ad.height || 250 };
  };

  const dimensions = getAdDimensions();

  // تنظيف وتحضير محتوى الإعلان
  useEffect(() => {
    if (!ad) return;

    setIsLoading(true);
    setError('');

    try {
      let content = '';

      switch (ad.content_type) {
        case 'image':
          if (ad.image_url) {
            content = `
              <div style="width: 100%; height: 100%; position: relative; overflow: hidden; border-radius: 8px;">
                <img 
                  src="${ad.image_url}" 
                  alt="${ad.title || 'إعلان'}"
                  style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;"
                  onmouseover="this.style.transform='scale(1.05)'"
                  onmouseout="this.style.transform='scale(1)'"
                />
                ${ad.link_url ? `
                  <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    انقر للمزيد
                  </div>
                ` : ''}
              </div>
            `;
          }
          break;

        case 'html':
        case 'javascript':
          if (ad.ad_code) {
            // تنظيف الكود من المحتوى الضار مع دعم العربية
            content = DOMPurify.sanitize(ad.ad_code, {
              ALLOWED_TAGS: ['div', 'span', 'p', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'script', 'style', 'canvas', 'svg', 'video', 'audio'],
              ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target', 'rel', 'data-*', 'dir', 'lang', 'autoplay', 'controls', 'loop', 'muted', 'width', 'height'],
              ALLOW_DATA_ATTR: true,
              ADD_ATTR: ['dir', 'lang']
            });

            // تحسين عرض النصوص العربية والرسوم المتحركة
            content = enhanceArabicText(content);
          }
          break;

        case 'video':
          if (ad.link_url) {
            content = `
              <div style="width: 100%; height: 100%; background: #000; border-radius: 8px; position: relative; overflow: hidden;">
                <video 
                  controls 
                  style="width: 100%; height: 100%; object-fit: cover;"
                  poster="${ad.image_url || ''}"
                >
                  <source src="${ad.link_url}" type="video/mp4">
                  متصفحك لا يدعم تشغيل الفيديو
                </video>
              </div>
            `;
          }
          break;

        default:
          content = `
            <div style="
              width: 100%; 
              height: 100%; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              color: white;
              text-align: center;
              padding: 16px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">${ad.title || 'عنوان الإعلان'}</h3>
              ${ad.description ? `<p style="margin: 0; font-size: 14px; opacity: 0.9;">${ad.description}</p>` : ''}
              ${ad.sponsor_name ? `<small style="margin-top: 8px; opacity: 0.7;">برعاية: ${ad.sponsor_name}</small>` : ''}
            </div>
          `;
      }

      setPreviewContent(content);
    } catch (err) {
      setError('خطأ في معاينة الإعلان');
      console.error('Ad preview error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [ad, deviceType]);

  if (!ad) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-500">لا يوجد إعلان للمعاينة</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* شريط معلومات المعاينة */}
      <div className="mb-4 p-3 bg-dark-card rounded-lg border border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-dark-text-secondary">المعاينة:</span>
            <span className="text-primary font-medium">{deviceType === 'mobile' ? 'جوال' : deviceType === 'tablet' ? 'تابلت' : 'سطح المكتب'}</span>
            <span className="text-dark-text-secondary">
              {dimensions.width} × {dimensions.height}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {ad.status && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                ad.status === 'active' ? 'bg-green-500/20 text-green-400' :
                ad.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                ad.status === 'draft' ? 'bg-gray-500/20 text-gray-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {ad.status === 'active' ? 'نشط' :
                 ad.status === 'paused' ? 'متوقف' :
                 ad.status === 'draft' ? 'مسودة' : 'منتهي'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* منطقة المعاينة */}
      <div 
        className="relative border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm"
        style={{ 
          width: `${dimensions.width}px`, 
          height: `${dimensions.height}px`,
          maxWidth: '100%'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-2xl mb-2">⚠️</div>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && previewContent && (
          <div 
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        )}

        {!isLoading && !error && !previewContent && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📢</div>
              <p className="text-sm">لا يوجد محتوى للعرض</p>
            </div>
          </div>
        )}

        {/* رابط الإعلان */}
        {ad.link_url && (
          <a
            href={ad.link_url}
            target={ad.target_blank ? '_blank' : '_self'}
            rel={ad.target_blank ? 'noopener noreferrer' : undefined}
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={(e) => {
              e.preventDefault(); // منع التنقل في المعاينة
              alert(`سيتم التوجه إلى: ${ad.link_url}`);
            }}
          />
        )}
      </div>

      {/* معلومات إضافية */}
      {ad.placement && (
        <div className="mt-2 text-xs text-dark-text-secondary">
          الموضع: {ad.placement}
        </div>
      )}
    </div>
  );
}

// مكون اختيار نوع الجهاز للمعاينة
interface DeviceSelectorProps {
  selectedDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
}

export function DeviceSelector({ selectedDevice, onDeviceChange }: DeviceSelectorProps) {
  const devices: { type: DeviceType; label: string; icon: string }[] = [
    { type: 'mobile', label: 'جوال', icon: '📱' },
    { type: 'tablet', label: 'تابلت', icon: '📱' },
    { type: 'desktop', label: 'سطح المكتب', icon: '🖥️' }
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-dark-card rounded-lg border border-gray-700">
      <span className="text-sm text-dark-text-secondary mr-2">معاينة على:</span>
      {devices.map((device) => (
        <button
          key={device.type}
          onClick={() => onDeviceChange(device.type)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedDevice === device.type
              ? 'bg-primary text-white shadow-md'
              : 'text-dark-text-secondary hover:text-white hover:bg-gray-700'
          }`}
        >
          <span>{device.icon}</span>
          <span>{device.label}</span>
        </button>
      ))}
    </div>
  );
}
