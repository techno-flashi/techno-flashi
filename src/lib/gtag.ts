// Google Analytics configuration
// مصدر البيانات: موقع TFlash
// عنوان URL للبث: https://tflash.site
// معرّف البث: 11450036506
// معرّف القياس: G-X8ZRRZX2EQ

export const GA_TRACKING_ID = 'G-X8ZRRZX2EQ';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
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
