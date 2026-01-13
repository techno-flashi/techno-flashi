// Google Analytics configuration
// مصدر البيانات: موقع TFlash
// عنوان URL للبث: https://tflash.site
// معرّف البث: 11450036506
// معرّف القياس: G-X8ZRRZX2EQ

export const GA_TRACKING_ID = 'G-X8ZRRZX2EQ';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    }
  } catch (error) {
    console.warn('Google Analytics pageview error:', error);
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// أحداث مخصصة لموقع TFlash
export const trackArticleView = (articleTitle: string) => {
  event({
    action: 'view_article',
    category: 'engagement',
    label: articleTitle,
  });
};

export const trackServiceView = (serviceName: string) => {
  event({
    action: 'view_service',
    category: 'engagement',
    label: serviceName,
  });
};

export const trackAdClick = (adTitle: string, placement: string) => {
  event({
    action: 'click_ad',
    category: 'ads',
    label: `${adTitle} - ${placement}`,
  });
};

export const trackNewsletterSubscribe = (email: string) => {
  event({
    action: 'newsletter_subscribe',
    category: 'engagement',
    label: email,
  });
};

export const trackDownload = (fileName: string) => {
  event({
    action: 'download',
    category: 'engagement',
    label: fileName,
  });
};

export const trackSearch = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
  });
};

export const trackContactForm = (formType: string) => {
  event({
    action: 'contact_form_submit',
    category: 'engagement',
    label: formType,
  });
};

export const trackSocialShare = (platform: string, contentTitle: string) => {
  event({
    action: 'social_share',
    category: 'engagement',
    label: `${platform} - ${contentTitle}`,
  });
};

export const trackVideoPlay = (videoTitle: string) => {
  event({
    action: 'video_play',
    category: 'engagement',
    label: videoTitle,
  });
};

export const trackOutboundLink = (url: string, linkText: string) => {
  event({
    action: 'outbound_link',
    category: 'engagement',
    label: `${linkText} - ${url}`,
  });
};

export const trackPageScroll = (percentage: number) => {
  event({
    action: 'page_scroll',
    category: 'engagement',
    label: `${percentage}%`,
    value: percentage,
  });
};
