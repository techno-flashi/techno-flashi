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
  updated_at: string;
  status: 'draft' | 'published';
  author: string;
  meta_description?: string;
  seo_keywords?: string[];
  reading_time?: number;
  tags?: string[];
  language?: string;
  direction?: string;
  validation_errors?: any;
  validation_warnings?: any;
  featured?: boolean;
  category?: string;
  seo_title?: string;
  seo_description?: string;
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
  status?: 'draft' | 'published';
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


