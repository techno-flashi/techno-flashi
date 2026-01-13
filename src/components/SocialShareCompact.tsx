'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface SocialShareCompactProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

function SocialShareCompact({
  url,
  title,
  description = '',
  className = ''
}: SocialShareCompactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
  };

  const handleShare = async (platform: string, shareUrl: string) => {
    setIsLoading(platform);
    
    try {
      const width = 600;
      const height = 400;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      window.open(
        shareUrl,
        `share-${platform}`,
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );
      
      setIsOpen(false);
      toast.success('تم فتح نافذة المشاركة');
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('حدث خطأ في المشاركة');
    } finally {
      setIsLoading(null);
    }
  };

  const copyToClipboard = async () => {
    setIsLoading('copy');
    
    try {
      await navigator.clipboard.writeText(url);
      setIsOpen(false);
      toast.success('تم نسخ الرابط بنجاح');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('فشل في نسخ الرابط');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
        title="مشاركة"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        <span className="font-medium">مشاركة</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 bg-dark-card border border-gray-700 rounded-lg shadow-xl z-20 min-w-[200px]">
            <div className="p-2 space-y-1">
              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook', shareLinks.facebook)}
                disabled={isLoading === 'facebook'}
                className="w-full flex items-center gap-3 px-3 py-2 text-right hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  {isLoading === 'facebook' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                </div>
                <span className="text-white">فيسبوك</span>
              </button>

              {/* Twitter */}
              <button
                onClick={() => handleShare('twitter', shareLinks.twitter)}
                disabled={isLoading === 'twitter'}
                className="w-full flex items-center gap-3 px-3 py-2 text-right hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  {isLoading === 'twitter' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                </div>
                <span className="text-white">تويتر</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('linkedin', shareLinks.linkedin)}
                disabled={isLoading === 'linkedin'}
                className="w-full flex items-center gap-3 px-3 py-2 text-right hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                  {isLoading === 'linkedin' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                </div>
                <span className="text-white">لينكد إن</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
                disabled={isLoading === 'whatsapp'}
                className="w-full flex items-center gap-3 px-3 py-2 text-right hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  {isLoading === 'whatsapp' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                    </svg>
                  )}
                </div>
                <span className="text-white">واتساب</span>
              </button>

              {/* Telegram */}
              <button
                onClick={() => handleShare('telegram', shareLinks.telegram)}
                disabled={isLoading === 'telegram'}
                className="w-full flex items-center gap-3 px-3 py-2 text-right hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  {isLoading === 'telegram' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  )}
                </div>
                <span className="text-white">تيليجرام</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                disabled={isLoading === 'copy'}
                className="w-full flex items-center gap-3 px-3 py-2 text-right hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                  {isLoading === 'copy' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  )}
                </div>
                <span className="text-white">نسخ الرابط</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SocialShareCompact;
