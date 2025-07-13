'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ClientOnlyContent } from '@/components/HydrationSafeWrapper';

interface CustomAdProps {
  id?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  htmlContent?: string;
  cssStyles?: string;
  jsCode?: string;
  type: 'banner' | 'card' | 'html' | 'animated';
  size?: 'small' | 'medium' | 'large' | 'full';
  position?: 'top' | 'bottom' | 'sidebar' | 'inline';
  animation?: 'none' | 'fade' | 'slide' | 'bounce' | 'pulse' | 'rotate';
  className?: string;
  targetBlank?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  onClick?: () => void;
}

/**
 * مكون الإعلانات المخصصة مع دعم HTML/CSS/JS والحركات
 */
export default function CustomAd({
  id,
  title,
  description,
  imageUrl,
  linkUrl,
  htmlContent,
  cssStyles,
  jsCode,
  type,
  size = 'medium',
  position = 'inline',
  animation = 'none',
  className = '',
  targetBlank = true,
  showCloseButton = false,
  onClose,
  onClick
}: CustomAdProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    // تنفيذ JavaScript المخصص
    if (jsCode && typeof window !== 'undefined') {
      try {
        // إنشاء script element
        const script = document.createElement('script');
        script.textContent = jsCode;
        script.id = `custom-ad-script-${id}`;
        
        // إضافة الـ script إلى head
        document.head.appendChild(script);

        return () => {
          // تنظيف الـ script عند إلغاء التحميل
          const existingScript = document.getElementById(`custom-ad-script-${id}`);
          if (existingScript) {
            document.head.removeChild(existingScript);
          }
        };
      } catch (error) {
        console.warn('Error executing custom ad JavaScript:', error);
      }
    }
  }, [jsCode, id]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleClick = () => {
    onClick?.();
    if (linkUrl) {
      if (targetBlank) {
        window.open(linkUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = linkUrl;
      }
    }
  };

  if (!isVisible) return null;

  // تحديد أحجام الإعلان
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    full: 'w-full'
  };

  // تحديد مواضع الإعلان
  const positionClasses = {
    top: 'mb-6',
    bottom: 'mt-6',
    sidebar: 'mb-4',
    inline: 'my-4'
  };

  // تحديد الحركات
  const animationClasses = {
    none: '',
    fade: 'animate-fade-in',
    slide: 'animate-slide-in',
    bounce: 'animate-bounce-in',
    pulse: 'animate-pulse',
    rotate: 'animate-spin-slow'
  };

  const baseClasses = `
    custom-ad relative overflow-hidden rounded-lg shadow-lg
    ${sizeClasses[size]}
    ${positionClasses[position]}
    ${animationClasses[animation]}
    ${className}
  `;

  // إعلان HTML مخصص
  if (type === 'html' && htmlContent) {
    return (
      <ClientOnlyContent>
        <div className={baseClasses}>
          {/* CSS مخصص */}
          {cssStyles && (
            <style jsx>{cssStyles}</style>
          )}
          
          {/* زر الإغلاق */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-700 transition-colors"
              aria-label="إغلاق الإعلان"
            >
              ×
            </button>
          )}
          
          {/* محتوى HTML */}
          <div 
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            onClick={handleClick}
            className="cursor-pointer"
          />
        </div>
      </ClientOnlyContent>
    );
  }

  // إعلان البانر
  if (type === 'banner') {
    return (
      <ClientOnlyContent>
        <div className={`${baseClasses} bg-gradient-to-r from-primary to-blue-600 text-white`}>
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 w-6 h-6 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center text-xs hover:bg-opacity-70 transition-colors"
            >
              ×
            </button>
          )}
          
          <div 
            className="p-4 cursor-pointer flex items-center space-x-4 space-x-reverse"
            onClick={handleClick}
          >
            {imageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={title || 'إعلان'}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            
            <div className="flex-1">
              {title && (
                <h3 className="font-bold text-lg mb-1">{title}</h3>
              )}
              {description && (
                <p className="text-sm opacity-90">{description}</p>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                إعلان
              </span>
            </div>
          </div>
        </div>
      </ClientOnlyContent>
    );
  }

  // إعلان الكارد
  if (type === 'card') {
    return (
      <ClientOnlyContent>
        <div className={`${baseClasses} bg-dark-card border border-gray-700`}>
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-700 transition-colors"
            >
              ×
            </button>
          )}
          
          <div 
            className="cursor-pointer"
            onClick={handleClick}
          >
            {imageUrl && (
              <div className="relative h-48 w-full">
                <Image
                  src={imageUrl}
                  alt={title || 'إعلان'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-4">
              {title && (
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
              )}
              {description && (
                <p className="text-gray-300 text-sm mb-3">{description}</p>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  إعلان
                </span>
                <span className="text-primary text-sm font-medium">
                  اعرف المزيد ←
                </span>
              </div>
            </div>
          </div>
        </div>
      </ClientOnlyContent>
    );
  }

  // إعلان متحرك
  if (type === 'animated') {
    return (
      <ClientOnlyContent>
        <div className={`${baseClasses} bg-gradient-to-br from-purple-600 to-pink-600 text-white overflow-hidden`}>
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 w-6 h-6 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center text-xs hover:bg-opacity-70 transition-colors"
            >
              ×
            </button>
          )}
          
          {/* خلفية متحركة */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-shimmer"></div>
          </div>
          
          <div 
            className="relative p-4 cursor-pointer"
            onClick={handleClick}
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              {imageUrl && (
                <div className="flex-shrink-0 animate-pulse">
                  <Image
                    src={imageUrl}
                    alt={title || 'إعلان'}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1">
                {title && (
                  <h3 className="font-bold text-lg mb-1 animate-bounce">{title}</h3>
                )}
                {description && (
                  <p className="text-sm opacity-90">{description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </ClientOnlyContent>
    );
  }

  return null;
}
