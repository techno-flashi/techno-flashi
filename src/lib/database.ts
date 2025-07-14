// مساعدات قاعدة البيانات لعمليات CRUD
import { supabase } from './supabase';
import { Article, AITool, Service, ArticleFormData, AIToolFormData, ServiceFormData } from '@/types';
import { sanitizeHtml, sanitizeText } from './sanitize';
import { cachedQuery } from './cache';

// ===== مساعدات المقالات =====

// جلب جميع المقالات مع التخزين المؤقت - محسن لتوفير Egress
export async function getArticles() {
  return cachedQuery('articles-all', async () => {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        published_at,
        created_at,
        status
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`خطأ في جلب المقالات: ${error.message}`);
    }

    return data as Article[];
  }, 1800); // 30 دقيقة بدلاً من 5 دقائق
}

// جلب مقال واحد بالـ ID
export async function getArticleById(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`خطأ في جلب المقال: ${error.message}`);
  }

  return data as Article;
}

// إنشاء مقال جديد
export async function createArticle(articleData: ArticleFormData) {
  const { data, error } = await supabase
    .from('articles')
    .insert([{
      ...articleData,
      published_at: articleData.status === 'published' ? new Date().toISOString() : null,
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`خطأ في إنشاء المقال: ${error.message}`);
  }

  return data as Article;
}

// تحديث مقال
export async function updateArticle(id: string, articleData: Partial<ArticleFormData>) {
  const updateData: any = {
    ...articleData,
    updated_at: new Date().toISOString(),
  };

  // إذا تم تغيير الحالة إلى منشور، تحديث تاريخ النشر
  if (articleData.status === 'published') {
    updateData.published_at = new Date().toISOString();
  } else if (articleData.status === 'draft') {
    updateData.published_at = null;
  }

  const { data, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`خطأ في تحديث المقال: ${error.message}`);
  }

  return data as Article;
}

// حذف مقال
export async function deleteArticle(id: string) {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`خطأ في حذف المقال: ${error.message}`);
  }
}

// ===== مساعدات أدوات الذكاء الاصطناعي =====

// جلب جميع أدوات الذكاء الاصطناعي - محسن لتوفير Egress
export async function getAITools() {
  return cachedQuery('ai-tools-all', async () => {
    const { data, error } = await supabase
      .from('ai_tools')
      .select(`
        id,
        name,
        slug,
        description,
        category,
        website_url,
        logo_url,
        pricing,
        rating,
        features,
        status,
        featured,
        created_at
      `)
      .in('status', ['published', 'active'])
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`خطأ في جلب أدوات الذكاء الاصطناعي: ${error.message}`);
    }

    return data as AITool[];
  }, 1800); // 30 دقيقة

  return data as AITool[];
}

// جلب أداة ذكاء اصطناعي واحدة بالـ ID
export async function getAIToolById(id: string) {
  const { data, error } = await supabase
    .from('ai_tools')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`خطأ في جلب أداة الذكاء الاصطناعي: ${error.message}`);
  }

  return data as AITool;
}

// إنشاء أداة ذكاء اصطناعي جديدة
export async function createAITool(toolData: AIToolFormData) {
  const { data, error } = await supabase
    .from('ai_tools')
    .insert([toolData])
    .select()
    .single();

  if (error) {
    throw new Error(`خطأ في إنشاء أداة الذكاء الاصطناعي: ${error.message}`);
  }

  return data as AITool;
}

// تحديث أداة ذكاء اصطناعي
export async function updateAITool(id: string, toolData: Partial<AIToolFormData>) {
  const { data, error } = await supabase
    .from('ai_tools')
    .update({
      ...toolData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`خطأ في تحديث أداة الذكاء الاصطناعي: ${error.message}`);
  }

  return data as AITool;
}

// حذف أداة ذكاء اصطناعي
export async function deleteAITool(id: string) {
  const { error } = await supabase
    .from('ai_tools')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`خطأ في حذف أداة الذكاء الاصطناعي: ${error.message}`);
  }
}

// ===== مساعدات الخدمات =====

// جلب جميع الخدمات
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`خطأ في جلب الخدمات: ${error.message}`);
  }

  return data as Service[];
}

// جلب خدمة واحدة بالـ ID
export async function getServiceById(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`خطأ في جلب الخدمة: ${error.message}`);
  }

  return data as Service;
}

// إنشاء خدمة جديدة
export async function createService(serviceData: ServiceFormData) {
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
    .select()
    .single();

  if (error) {
    throw new Error(`خطأ في إنشاء الخدمة: ${error.message}`);
  }

  return data as Service;
}

// تحديث خدمة
export async function updateService(id: string, serviceData: Partial<ServiceFormData>) {
  const { data, error } = await supabase
    .from('services')
    .update({
      ...serviceData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`خطأ في تحديث الخدمة: ${error.message}`);
  }

  return data as Service;
}

// حذف خدمة
export async function deleteService(id: string) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`خطأ في حذف الخدمة: ${error.message}`);
  }
}

// ===== مساعدات الإحصائيات =====

// جلب إحصائيات سريعة للوحة التحكم
export async function getDashboardStats() {
  try {
    const [articlesResult, aiToolsResult, servicesResult] = await Promise.all([
      supabase.from('articles').select('status', { count: 'exact' }),
      supabase.from('ai_tools').select('status', { count: 'exact' }),
      supabase.from('services').select('status', { count: 'exact' }),
    ]);

    const articlesCount = articlesResult.count || 0;
    const publishedArticles = articlesResult.data?.filter(a => a.status === 'published').length || 0;
    const draftArticles = articlesResult.data?.filter(a => a.status === 'draft').length || 0;

    const aiToolsCount = aiToolsResult.count || 0;
    const servicesCount = servicesResult.count || 0;

    return {
      articles: {
        total: articlesCount,
        published: publishedArticles,
        drafts: draftArticles,
      },
      aiTools: aiToolsCount,
      services: servicesCount,
    };
  } catch (error: any) {
    throw new Error(`خطأ في جلب الإحصائيات: ${error.message}`);
  }
}
