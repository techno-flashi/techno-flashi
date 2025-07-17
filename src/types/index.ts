// هذا الملف لتعريف أنواع البيانات التي نستخدمها من قاعدة البيانات
// هذا يساعد في تجنب الأخطاء أثناء البرمجة

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any; // EditorJS outputs a JSON object
  featured_image_url: string;
  published_at: string;
  created_at: string;
  status: 'draft' | 'published';
}

// نوع للمقالات المختصرة (بدون content)
export interface ArticleSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  published_at: string;
  created_at: string;
  reading_time?: number;
  author?: string;
  tags?: string[];
  featured?: boolean;
}

// نموذج بيانات المقال
export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  featured_image_url: string;
  status: 'draft' | 'published';
}

// أنواع أدوات الذكاء الاصطناعي
export interface AITool {
  id: string;
  name: string;
  slug: string;
  description: string;
  detailed_description?: string;
  category: string;
  website_url: string;
  logo_url: string;
  pricing: 'free' | 'freemium' | 'paid';
  rating: string;
  features: string[];
  use_cases?: string[];
  pros?: string[];
  cons?: string[];
  pricing_details?: {
    free_plan?: string;
    paid_plans?: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
  tutorial_steps?: string[];
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  tags?: string[];
  featured?: boolean;
  click_count?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// نموذج بيانات أداة الذكاء الاصطناعي
export interface AIToolFormData {
  name: string;
  slug: string;
  description: string;
  detailed_description?: string;
  category: string;
  website_url: string;
  logo_url: string;
  pricing: 'free' | 'freemium' | 'paid';
  rating: string;
  features: string[];
  use_cases?: string[];
  pros?: string[];
  cons?: string[];
  pricing_details?: {
    free_plan?: string;
    paid_plans?: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
  tutorial_steps?: string[];
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  tags?: string[];
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  status: 'draft' | 'published';
}

// أنواع الخدمات الجديدة
export interface Service {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  category: string;
  icon_url?: string;
  image_url?: string;
  pricing_type: 'free' | 'paid' | 'custom';
  pricing_amount?: number;
  pricing_currency?: string;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  cta_text: string;
  cta_link?: string;
  display_order: number;
  tags?: string[];
  features?: string[];
  created_at: string;
  updated_at: string;
}

// نموذج بيانات إنشاء/تعديل الخدمة
export interface ServiceFormData {
  name: string;
  description: string;
  short_description?: string;
  category: string;
  icon_url?: string;
  image_url?: string;
  pricing_type: 'free' | 'paid' | 'custom';
  pricing_amount?: number;
  pricing_currency?: string;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  cta_text: string;
  cta_link?: string;
  display_order: number;
  tags?: string[];
  features?: string[];
}

// أنواع الإعلانات والرعاة
// أنواع الإعلانات المحسنة
export interface Ad {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  ad_code?: string;
  placement: string;
  type: AdType;
  status: AdStatus;
  priority: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  click_count: number;
  impression_count: number;
  target_blank: boolean;
  width?: number;
  height?: number;
  animation_delay: number;
  sponsor_name?: string;
  created_at: string;
  updated_at: string;
  // الحقول الجديدة المحسنة
  placement_rules?: PlacementRules;
  targeting_options?: TargetingOptions;
  performance_metrics?: PerformanceMetrics;
  content_type?: ContentType;
  responsive_settings?: ResponsiveSettings;
}

// أنواع الإعلانات
export type AdType = 'banner' | 'sidebar' | 'inline' | 'popup' | 'native' | 'video';

// حالات الإعلان
export type AdStatus = 'draft' | 'active' | 'paused' | 'expired' | 'rejected';

// أنواع المحتوى
export type ContentType = 'image' | 'html' | 'javascript' | 'video' | 'interactive';

// قواعد الموضع
export interface PlacementRules {
  pages: string[]; // صفحات محددة
  url_patterns: string[]; // أنماط URL
  exclude_pages?: string[]; // صفحات مستبعدة
  position: PlacementPosition;
  auto_insert: boolean;
}

// مواضع الإعلانات
export type PlacementPosition =
  | 'header_top'
  | 'header_bottom'
  | 'content_top'
  | 'content_middle'
  | 'content_bottom'
  | 'sidebar_top'
  | 'sidebar_middle'
  | 'sidebar_bottom'
  | 'footer_top'
  | 'footer_bottom'
  | 'floating'
  | 'custom';

// خيارات الاستهداف
export interface TargetingOptions {
  devices: DeviceType[];
  locations?: string[];
  languages?: string[];
  traffic_sources?: TrafficSource[];
  user_agents?: string[];
  time_schedule?: TimeSchedule;
  frequency_cap?: FrequencyCap;
}

// أنواع الأجهزة
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'all';

// مصادر الزيارات
export type TrafficSource = 'direct' | 'search' | 'social' | 'referral' | 'email' | 'ads';

// جدولة زمنية
export interface TimeSchedule {
  days_of_week: number[]; // 0-6 (الأحد-السبت)
  hours: { start: number; end: number }; // 0-23
  timezone: string;
}

// حد التكرار
export interface FrequencyCap {
  impressions_per_user: number;
  time_period: 'hour' | 'day' | 'week' | 'month';
}

// مقاييس الأداء
export interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  ctr: number; // Click Through Rate
  revenue?: number;
  cost?: number;
  conversions?: number;
  last_updated: string;
}

// إعدادات متجاوبة
export interface ResponsiveSettings {
  mobile: AdDimensions;
  tablet: AdDimensions;
  desktop: AdDimensions;
  auto_resize: boolean;
}

// أبعاد الإعلان
export interface AdDimensions {
  width: number;
  height: number;
  max_width?: number;
  max_height?: number;
}

// أحجام الإعلانات القياسية
export const STANDARD_AD_SIZES = {
  'leaderboard': { width: 728, height: 90 },
  'medium_rectangle': { width: 300, height: 250 },
  'wide_skyscraper': { width: 160, height: 600 },
  'mobile_banner': { width: 320, height: 50 },
  'large_rectangle': { width: 336, height: 280 },
  'square': { width: 250, height: 250 },
  'small_square': { width: 200, height: 200 },
  'banner': { width: 468, height: 60 },
  'half_banner': { width: 234, height: 60 },
  'micro_bar': { width: 88, height: 31 }
} as const;

// مواضع الإعلانات مع الأوصاف
export const PLACEMENT_OPTIONS = [
  { value: 'header_top', label: 'أعلى الهيدر', description: 'في أعلى الصفحة قبل القائمة' },
  { value: 'header_bottom', label: 'أسفل الهيدر', description: 'تحت القائمة الرئيسية' },
  { value: 'content_top', label: 'أعلى المحتوى', description: 'قبل بداية المحتوى الرئيسي' },
  { value: 'content_middle', label: 'وسط المحتوى', description: 'في منتصف المحتوى' },
  { value: 'content_bottom', label: 'أسفل المحتوى', description: 'بعد انتهاء المحتوى' },
  { value: 'sidebar_top', label: 'أعلى الشريط الجانبي', description: 'في أعلى الشريط الجانبي' },
  { value: 'sidebar_middle', label: 'وسط الشريط الجانبي', description: 'في منتصف الشريط الجانبي' },
  { value: 'sidebar_bottom', label: 'أسفل الشريط الجانبي', description: 'في أسفل الشريط الجانبي' },
  { value: 'footer_top', label: 'أعلى الفوتر', description: 'قبل بداية الفوتر' },
  { value: 'footer_bottom', label: 'أسفل الفوتر', description: 'في نهاية الصفحة' },
  { value: 'floating', label: 'عائم', description: 'إعلان عائم يتحرك مع التمرير' },
  { value: 'custom', label: 'مخصص', description: 'موضع مخصص حسب الكود' }
] as const;
