-- إنشاء جميع جداول قاعدة البيانات للموقع
-- Database: xfxpwbqgtuhbkeksdbqn.supabase.co

-- 1. جدول أدوات الذكاء الاصطناعي
CREATE TABLE IF NOT EXISTS ai_tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    detailed_description TEXT,
    category TEXT,
    website_url TEXT,
    logo_url TEXT,
    pricing TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    features TEXT[],
    use_cases TEXT[],
    pros TEXT[],
    cons TEXT[],
    pricing_details JSONB,
    tutorial_steps JSONB,
    faq JSONB,
    tags TEXT[],
    status TEXT DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    click_count INTEGER DEFAULT 0,
    meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. جدول المقالات
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    category TEXT,
    tags TEXT[],
    author TEXT DEFAULT 'TechnoFlash Team',
    status TEXT DEFAULT 'published',
    featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    reading_time INTEGER,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. جدول الخدمات
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    detailed_description TEXT,
    icon TEXT,
    image TEXT,
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    features TEXT[],
    category TEXT,
    status TEXT DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. جدول صفحات الموقع
CREATE TABLE IF NOT EXISTS site_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    page_type TEXT DEFAULT 'static',
    status TEXT DEFAULT 'published',
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    template TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON ai_tools(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_tools_featured ON ai_tools(featured);
CREATE INDEX IF NOT EXISTS idx_ai_tools_status ON ai_tools(status);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(featured);

CREATE INDEX IF NOT EXISTS idx_site_pages_slug ON site_pages(slug);
CREATE INDEX IF NOT EXISTS idx_site_pages_status ON site_pages(status);
CREATE INDEX IF NOT EXISTS idx_site_pages_page_type ON site_pages(page_type);

-- إنشاء دوال التحديث التلقائي للـ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة المحفزات للتحديث التلقائي
CREATE TRIGGER update_ai_tools_updated_at BEFORE UPDATE ON ai_tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_pages_updated_at BEFORE UPDATE ON site_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- تفعيل Row Level Security (RLS)
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان للقراءة العامة
CREATE POLICY "Allow public read access on ai_tools" ON ai_tools FOR SELECT USING (status = 'active');
CREATE POLICY "Allow public read access on articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Allow public read access on services" ON services FOR SELECT USING (status = 'active');
CREATE POLICY "Allow public read access on site_pages" ON site_pages FOR SELECT USING (status = 'published');

-- سياسات الكتابة للمشرفين فقط (service role)
CREATE POLICY "Allow service role full access on ai_tools" ON ai_tools FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on articles" ON articles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on services" ON services FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on site_pages" ON site_pages FOR ALL USING (auth.role() = 'service_role');
