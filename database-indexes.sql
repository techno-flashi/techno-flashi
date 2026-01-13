-- فهارس قاعدة البيانات لتحسين الأداء
-- يجب تنفيذ هذه الاستعلامات في لوحة تحكم Supabase

-- فهارس جدول articles
-- فهرس على status (الأكثر استخداماً)
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

-- فهرس على slug (للبحث السريع عن المقالات)
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- فهرس مركب على status و published_at (للترتيب السريع للمقالات المنشورة)
CREATE INDEX IF NOT EXISTS idx_articles_status_published_at ON articles(status, published_at DESC);

-- فهرس مركب على status و created_at (للترتيب السريع)
CREATE INDEX IF NOT EXISTS idx_articles_status_created_at ON articles(status, created_at DESC);

-- فهرس على featured للمقالات المميزة
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = true;

-- فهرس على author للبحث بالكاتب
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author);

-- فهرس على tags للبحث بالعلامات (إذا كان النوع array)
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);

-- فهارس جدول ai_tools
CREATE INDEX IF NOT EXISTS idx_ai_tools_status ON ai_tools(status);
CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON ai_tools(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tools_status_created_at ON ai_tools(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_tools_featured ON ai_tools(featured) WHERE featured = true;

-- فهارس جدول services
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status_created_at ON services(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(featured) WHERE featured = true;

-- فهارس جدول pages (إذا كان موجود)
CREATE INDEX IF NOT EXISTS idx_pages_key ON pages(key);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);

-- تحليل الجداول لتحديث الإحصائيات
ANALYZE articles;
ANALYZE ai_tools;
ANALYZE services;

-- عرض معلومات الفهارس المنشأة
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('articles', 'ai_tools', 'services', 'pages')
ORDER BY tablename, indexname;
