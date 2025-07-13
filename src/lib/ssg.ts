import { createClient } from '@supabase/supabase-js';

// استخدام service role key للبناء مع fallback للـ anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// التحقق من وجود المتغيرات المطلوبة
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not defined');
}

if (!supabaseServiceKey && !supabaseAnonKey) {
  console.error('❌ Neither SUPABASE_SERVICE_ROLE_KEY nor NEXT_PUBLIC_SUPABASE_ANON_KEY is defined');
}

// استخدام service role key إذا كان متاحاً، وإلا استخدم anon key
const apiKey = supabaseServiceKey || supabaseAnonKey;

export const supabaseSSG = supabaseUrl && apiKey ? createClient(supabaseUrl, apiKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null;

/**
 * جلب جميع المقالات للـ SSG
 */
export async function getAllArticlesForSSG() {
  try {
    // التحقق من وجود اتصال Supabase
    if (!supabaseSSG) {
      console.error('❌ Supabase SSG client is not initialized');
      return [];
    }

    console.log('🔄 Fetching articles for SSG...');

    const { data, error } = await supabaseSSG
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image,
        author,
        status,
        tags,
        meta_title,
        meta_description,
        reading_time,
        views,
        created_at,
        updated_at
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching articles for SSG:', error);
      return [];
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} articles for SSG`);
    return data || [];
  } catch (error) {
    console.error('💥 Exception in getAllArticlesForSSG:', error);
    return [];
  }
}

/**
 * جلب مقال واحد للـ SSG
 */
export async function getArticleBySlugForSSG(slug: string) {
  try {
    // التحقق من وجود اتصال Supabase
    if (!supabaseSSG) {
      console.error('❌ Supabase SSG client is not initialized');
      return null;
    }

    console.log(`🔄 Fetching article "${slug}" for SSG...`);

    const { data, error } = await supabaseSSG
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image,
        author,
        status,
        tags,
        meta_title,
        meta_description,
        reading_time,
        views,
        created_at,
        updated_at
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle(); // استخدام maybeSingle بدلاً من single لتجنب الأخطاء

    if (error) {
      console.error(`❌ Error fetching article "${slug}" for SSG:`, {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }

    if (data) {
      console.log(`✅ Successfully fetched article "${slug}" for SSG`);
    } else {
      console.log(`⚠️ Article "${slug}" not found in SSG`);
    }

    return data;
  } catch (error) {
    console.error(`💥 Exception in getArticleBySlugForSSG for "${slug}":`, {
      message: (error as Error).message,
      stack: (error as Error).stack
    });
    return null;
  }
}

/**
 * جلب جميع أدوات AI للـ SSG
 */
export async function getAllAIToolsForSSG() {
  try {
    // التحقق من وجود اتصال Supabase
    if (!supabaseSSG) {
      console.error('❌ Supabase SSG client is not initialized');
      return [];
    }

    console.log('🔄 Fetching AI tools for SSG...');

    const { data, error } = await supabaseSSG
      .from('ai_tools')
      .select(`
        id,
        name,
        slug,
        description,
        category,
        pricing,
        logo_url,
        website_url,
        features,
        rating,
        status,
        meta_title,
        meta_description,
        created_at,
        updated_at
      `)
      .in('status', ['published', 'active'])
      .order('rating', { ascending: false });

    if (error) {
      console.error('❌ Error fetching AI tools for SSG:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} AI tools for SSG`);
    return data || [];
  } catch (error) {
    console.error('💥 Exception in getAllAIToolsForSSG:', {
      message: (error as Error).message,
      stack: (error as Error).stack
    });
    return [];
  }
}

/**
 * جلب أداة AI واحدة للـ SSG
 */
export async function getAIToolBySlugForSSG(slug: string) {
  try {
    // التحقق من أن supabaseSSG متاح
    if (!supabaseSSG) {
      console.error('supabaseSSG client is not available');
      return null;
    }

    const { data, error } = await supabaseSSG
      .from('ai_tools')
      .select(`
        id,
        name,
        slug,
        description,
        category,
        pricing,
        logo_url,
        website_url,
        features,
        rating,
        status,
        meta_title,
        meta_description,
        created_at,
        updated_at
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching AI tool for SSG:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        slug
      });
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception in getAIToolBySlugForSSG:', {
      error: error instanceof Error ? error.message : String(error),
      slug
    });
    return null;
  }
}

/**
 * جلب الإعلانات للـ SSG
 */
export async function getAdvertisementsForSSG(position?: string) {
  try {
    let query = supabaseSSG
      .from('advertisements')
      .select(`
        id,
        title,
        content,
        type,
        position,
        is_active,
        is_paused,
        priority,
        target_url,
        image_url,
        custom_css,
        custom_js,
        created_at,
        updated_at
      `)
      .eq('is_active', true)
      .eq('is_paused', false)
      .order('priority', { ascending: true });

    if (position) {
      query = query.eq('position', position);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching advertisements for SSG:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception in getAdvertisementsForSSG:', error);
    return [];
  }
}

/**
 * جلب إحصائيات للـ SSG
 */
export async function getStatsForSSG() {
  try {
    const [articlesResult, aiToolsResult] = await Promise.all([
      supabaseSSG
        .from('articles')
        .select('id', { count: 'exact' })
        .eq('status', 'published'),
      supabaseSSG
        .from('ai_tools')
        .select('id', { count: 'exact' })
        .in('status', ['published', 'active'])
    ]);

    return {
      totalArticles: articlesResult.count || 0,
      totalAITools: aiToolsResult.count || 0,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Exception in getStatsForSSG:', error);
    return {
      totalArticles: 0,
      totalAITools: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * جلب الفئات للـ SSG
 */
export async function getCategoriesForSSG() {
  try {
    const { data, error } = await supabaseSSG
      .from('ai_tools')
      .select('category')
      .in('status', ['published', 'active']);

    if (error) {
      console.error('Error fetching categories for SSG:', error);
      return [];
    }

    // استخراج الفئات الفريدة
    const uniqueCategories = Array.from(new Set(data?.map(tool => tool.category).filter(Boolean)));
    return uniqueCategories;
  } catch (error) {
    console.error('Exception in getCategoriesForSSG:', error);
    return [];
  }
}

/**
 * تنظيف وإصلاح encoding النصوص العربية
 */
export function fixObjectEncoding(obj: any): any {
  if (!obj) return obj;
  
  if (typeof obj === 'string') {
    return obj
      .replace(/Ø§/g, 'ا')
      .replace(/Ù/g, 'ي')
      .replace(/Ø¹/g, 'ع')
      .replace(/Ù\u0084/g, 'ل')
      .replace(/Ø±/g, 'ر')
      .replace(/Ø¨/g, 'ب')
      .replace(/Ù\u008A/g, 'ي')
      .replace(/Ø©/g, 'ة')
      .replace(/Ø§Ù\u0084/g, 'ال')
      .replace(/Ù\u0085/g, 'م')
      .replace(/Ù\u0086/g, 'ن')
      .replace(/Ø³/g, 'س')
      .replace(/Ø¯/g, 'د')
      .replace(/Ù\u0081/g, 'ف')
      .replace(/Ø­/g, 'ح')
      .replace(/Ø¬/g, 'ج')
      .replace(/Ù\u0083/g, 'ك')
      .replace(/Ø·/g, 'ط')
      .replace(/Ù\u0087/g, 'ه')
      .replace(/Ø°/g, 'ذ')
      .replace(/Ø²/g, 'ز')
      .replace(/Ø´/g, 'ش')
      .replace(/Ø¶/g, 'ض')
      .replace(/Ø¸/g, 'ظ')
      .replace(/Ø؛/g, 'غ')
      .replace(/Ø®/g, 'خ')
      .replace(/Ø«/g, 'ث')
      .replace(/Ù\u0082/g, 'ق')
      .replace(/Ù\u0088/g, 'و')
      .replace(/Ø¡/g, 'ء')
      .replace(/Ø¤/g, 'ؤ')
      .replace(/Ø¦/g, 'ئ')
      .replace(/Ø¥/g, 'إ')
      .replace(/Ø¢/g, 'آ');
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => fixObjectEncoding(item));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const fixed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      fixed[key] = fixObjectEncoding(value);
    }
    return fixed;
  }
  
  return obj;
}
