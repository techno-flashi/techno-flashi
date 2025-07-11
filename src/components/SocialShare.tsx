'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function SocialShare({
  url,
  title,
  description = '',
  hashtags = [],
  className = '',
  showLabels = false,
  size = 'md'
}: SocialShareProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagsString = hashtags.map(tag => encodeURIComponent(tag)).join(',');

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const buttonSize = sizeClasses[size];

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${hashtagsString ? `&hashtags=${hashtagsString}` : ''}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
  };

  const handleShare = async (platform: string, shareUrl: string) => {
    setIsLoading(platform);

    try {
      // For mobile devices, try native sharing first
      if (platform === 'native' && navigator.share) {
        await navigator.share({
          title,
          text: description,
          url
        });
        toast.success('تم مشاركة المحتوى بنجاح');
      } else {
        // Check if it's a mobile device for better UX
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
          // For mobile, open in same tab to avoid popup blockers
          window.location.href = shareUrl;
        } else {
          // Open in new window for desktop
          const width = 600;
          const height = 400;
          const left = (window.screen.width - width) / 2;
          const top = (window.screen.height - height) / 2;

          const popup = window.open(
            shareUrl,
            `share-${platform}`,
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
          );

          if (!popup) {
            // Fallback if popup is blocked
            window.open(shareUrl, '_blank');
          }
        }

        toast.success('تم فتح نافذة المشاركة');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled the share
        toast.info('تم إلغاء المشاركة');
      } else {
        toast.error('حدث خطأ في المشاركة. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(null);
    }
  };

  const copyToClipboard = async () => {
    setIsLoading('copy');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success('تم نسخ الرابط بنجاح');
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          toast.success('تم نسخ الرابط بنجاح');
        } catch (err) {
          console.error('Fallback copy failed:', err);
          toast.error('فشل في نسخ الرابط. يرجى نسخه يدوياً.');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('فشل في نسخ الرابط. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(null);
    }
  };

  const SocialButton = ({
    platform,
    icon,
    label,
    bgColor,
    hoverColor,
    onClick
  }: {
    platform: string;
    icon: React.ReactNode;
    label: string;
    bgColor: string;
    hoverColor: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      disabled={isLoading === platform}
      className={`
        ${buttonSize} ${bgColor} ${hoverColor}
        flex items-center justify-center rounded-lg
        transition-all duration-300 transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent
        min-h-[44px] min-w-[44px]
        ${showLabels ? 'px-4 w-auto gap-2' : ''}
      `}
      title={`مشاركة على ${label}`}
      aria-label={`مشاركة على ${label}`}
      type="button"
    >
      {isLoading === platform ? (
        <div
          className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
          role="status"
          aria-label="جاري المشاركة"
        />
      ) : (
        <>
          {icon}
          {showLabels && <span className="text-white font-medium">{label}</span>}
        </>
      )}
    </button>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Facebook */}
      <SocialButton
        platform="facebook"
        label="فيسبوك"
        bgColor="bg-blue-600"
        hoverColor="hover:bg-blue-700"
        onClick={() => handleShare('facebook', shareLinks.facebook)}
        icon={
          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        }
      />

      {/* Twitter/X */}
      <SocialButton
        platform="twitter"
        label="تويتر"
        bgColor="bg-black"
        hoverColor="hover:bg-gray-800"
        onClick={() => handleShare('twitter', shareLinks.twitter)}
        icon={
          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        }
      />

      {/* LinkedIn */}
      <SocialButton
        platform="linkedin"
        label="لينكد إن"
        bgColor="bg-blue-700"
        hoverColor="hover:bg-blue-800"
        onClick={() => handleShare('linkedin', shareLinks.linkedin)}
        icon={
          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        }
      />

      {/* WhatsApp */}
      <SocialButton
        platform="whatsapp"
        label="واتساب"
        bgColor="bg-green-500"
        hoverColor="hover:bg-green-600"
        onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
        icon={
          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
          </svg>
        }
      />

      {/* Telegram */}
      <SocialButton
        platform="telegram"
        label="تيليجرام"
        bgColor="bg-blue-500"
        hoverColor="hover:bg-blue-600"
        onClick={() => handleShare('telegram', shareLinks.telegram)}
        icon={
          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        }
      />

      {/* Copy Link */}
      <SocialButton
        platform="copy"
        label="نسخ الرابط"
        bgColor="bg-gray-600"
        hoverColor="hover:bg-gray-700"
        onClick={copyToClipboard}
        icon={
          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        }
      />
    </div>
  );
}

export default SocialShare;
