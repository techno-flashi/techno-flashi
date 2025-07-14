-- إعداد قاعدة البيانات لمشروع TechnoFlash
-- قم بتشغيل هذا الكود في محرر SQL في Supabase

-- ===== جدول المقالات =====
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content JSONB,
  featured_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة فهارس للمقالات
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- ===== جدول أدوات الذكاء الاصطناعي =====
CREATE TABLE IF NOT EXISTS ai_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  pricing TEXT DEFAULT 'free' CHECK (pricing IN ('free', 'freemium', 'paid')),
  rating DECIMAL(2,1) DEFAULT 5.0 CHECK (rating >= 1 AND rating <= 5),
  features TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة فهارس لأدوات الذكاء الاصطناعي
CREATE INDEX IF NOT EXISTS idx_ai_tools_status ON ai_tools(status);
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_tools_pricing ON ai_tools(pricing);
CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON ai_tools(slug);

-- ===== جدول الخدمات =====
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  duration TEXT,
  features TEXT[] DEFAULT '{}',
  image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة فهارس للخدمات
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_price ON services(price);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- ===== إضافة بيانات تجريبية =====

-- مقالات تجريبية
INSERT INTO articles (title, slug, excerpt, content, featured_image_url, status, published_at) VALUES
(
  'مرحباً بك في TechnoFlash',
  'welcome-to-technoflash',
  'مقال ترحيبي يشرح رؤية وأهداف منصة TechnoFlash التقنية',
  '{"time":1640995200000,"blocks":[{"type":"header","data":{"text":"مرحباً بك في TechnoFlash","level":1}},{"type":"paragraph","data":{"text":"مرحباً بك في منصة TechnoFlash، بوابتك للمستقبل التقني! نحن هنا لنقدم لك أحدث المقالات والأدوات في عالم التكنولوجيا والذكاء الاصطناعي."}},{"type":"header","data":{"text":"ما نقدمه لك","level":2}},{"type":"list","data":{"style":"unordered","items":["مقالات تقنية متخصصة","دليل شامل لأدوات الذكاء الاصطناعي","خدمات تقنية متميزة","محتوى باللغة العربية"]}},{"type":"paragraph","data":{"text":"ابدأ رحلتك التقنية معنا اليوم!"}}],"version":"2.28.2"}',
  'https://placehold.co/1200x600/0D1117/38BDF8?text=TechnoFlash',
  'published',
  NOW()
),
(
  'أساسيات الذكاء الاصطناعي للمبتدئين',
  'ai-basics-for-beginners',
  'دليل شامل للمبتدئين في عالم الذكاء الاصطناعي وتطبيقاته العملية',
  '{"time":1640995200000,"blocks":[{"type":"header","data":{"text":"أساسيات الذكاء الاصطناعي","level":1}},{"type":"paragraph","data":{"text":"الذكاء الاصطناعي يغير عالمنا بطرق مذهلة. في هذا المقال، سنتعرف على الأساسيات التي يحتاج كل مبتدئ لمعرفتها."}},{"type":"header","data":{"text":"ما هو الذكاء الاصطناعي؟","level":2}},{"type":"paragraph","data":{"text":"الذكاء الاصطناعي هو قدرة الآلات على محاكاة الذكاء البشري وأداء المهام التي تتطلب تفكيراً وتعلماً."}}],"version":"2.28.2"}',
  'https://placehold.co/1200x600/0D1117/38BDF8?text=AI+Basics',
  'published',
  NOW() - INTERVAL '1 day'
);

-- أدوات ذكاء اصطناعي تجريبية
INSERT INTO ai_tools (name, slug, description, category, website_url, logo_url, pricing, rating, features, status) VALUES
(
  'ChatGPT',
  'chatgpt',
  'مساعد ذكي للمحادثة والكتابة يستخدم تقنيات الذكاء الاصطناعي المتقدمة',
  'كتابة ومحادثة',
  'https://chat.openai.com',
  'https://placehold.co/100x100/38BDF8/FFFFFF?text=GPT',
  'freemium',
  4.8,
  ARRAY['محادثة ذكية', 'كتابة المحتوى', 'ترجمة النصوص', 'حل المشاكل البرمجية'],
  'published'
),
(
  'Midjourney',
  'midjourney',
  'أداة إنشاء الصور بالذكاء الاصطناعي من النصوص',
  'تصميم وإبداع',
  'https://midjourney.com',
  'https://placehold.co/100x100/38BDF8/FFFFFF?text=MJ',
  'paid',
  4.7,
  ARRAY['إنشاء صور من النص', 'جودة عالية', 'أساليب فنية متنوعة', 'سهولة الاستخدام'],
  'published'
);

-- خدمات تجريبية
INSERT INTO services (title, slug, description, short_description, price, currency, duration, features, image_url, status) VALUES
(
  'تطوير موقع ويب متكامل',
  'web-development',
  'خدمة تطوير مواقع الويب الحديثة باستخدام أحدث التقنيات مثل Next.js و React',
  'تطوير مواقع ويب احترافية وسريعة',
  1500,
  'USD',
  '2-4 أسابيع',
  ARRAY['تصميم متجاوب', 'أداء عالي', 'SEO محسن', 'لوحة تحكم', 'دعم فني'],
  'https://placehold.co/400x300/38BDF8/FFFFFF?text=Web+Dev',
  'published'
),
(
  'استشارة تقنية',
  'tech-consultation',
  'جلسة استشارة تقنية شخصية لمساعدتك في اختيار الحلول التقنية المناسبة لمشروعك',
  'استشارة تقنية متخصصة',
  200,
  'USD',
  '1-2 ساعة',
  ARRAY['تحليل المتطلبات', 'اقتراح الحلول', 'خطة تنفيذ', 'متابعة لمدة شهر'],
  'https://placehold.co/400x300/38BDF8/FFFFFF?text=Consultation',
  'published'
);

-- ===== إعداد Row Level Security (RLS) =====

-- تفعيل RLS للجداول
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- سياسات للقراءة العامة (للمحتوى المنشور)
CREATE POLICY "Allow public read published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read published ai_tools" ON ai_tools
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read published services" ON services
  FOR SELECT USING (status = 'published');

-- سياسات للمدراء (كامل الصلاحيات)
-- ملاحظة: يجب تخصيص هذه السياسات حسب نظام المصادقة الخاص بك
CREATE POLICY "Allow admin full access to articles" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to ai_tools" ON ai_tools
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

-- ===== إنشاء دوال مساعدة =====

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة triggers لتحديث updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_tools_updated_at BEFORE UPDATE ON ai_tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== رسالة النجاح =====
DO $$
BEGIN
    RAISE NOTICE 'تم إعداد قاعدة البيانات بنجاح! 🎉';
    RAISE NOTICE 'الجداول المُنشأة: articles, ai_tools, services';
    RAISE NOTICE 'تم إضافة بيانات تجريبية للاختبار';
    RAISE NOTICE 'تم تفعيل Row Level Security';
END $$;
