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
  category: string;
  website_url: string;
  logo_url: string;
  pricing: 'free' | 'freemium' | 'paid';
  rating: string;
  features: string[];
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

// نموذج بيانات أداة الذكاء الاصطناعي
export interface AIToolFormData {
  name: string;
  slug: string;
  description: string;
  category: string;
  website_url: string;
  logo_url: string;
  pricing: 'free' | 'freemium' | 'paid';
  rating: string;
  features: string[];
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
export interface Ad {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  ad_code?: string;
  placement: string;
  type: string;
  status: string;
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
}
