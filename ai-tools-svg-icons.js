// مكتبة أيقونات SVG لأدوات الذكاء الاصطناعي من jsDelivr و Simple Icons
const { createClient } = require('@supabase/supabase-js');

// إعدادات Supabase
const SUPABASE_URL = 'https://biikzzcbrzxzfeaavmlc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpaWt6emNicnp4emZlYWF2bWxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUyNjUwOCwiZXhwIjoyMDY4MTAyNTA4fQ.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// مكتبة الأيقونات المخصصة لكل أداة
const AI_TOOLS_ICONS = {
  // أدوات المحادثة والذكاء الاصطناعي العامة
  'claude': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/anthropic.svg',
  'chatgpt': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/openai.svg',
  'chatgpt-4o': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/openai.svg',
  'openai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/openai.svg',
  'perplexity-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/perplexity.svg',
  'character-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/character.svg',
  
  // أدوات إنشاء الصور
  'midjourney': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/midjourney.svg',
  'dall-e-3': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/openai.svg',
  'dall-e': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/openai.svg',
  'stable-diffusion': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/stablediffusion.svg',
  'leonardo-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/leonardo.svg',
  'adobe-firefly': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/adobe.svg',
  'canva-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/canva.svg',
  'figma': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/figma.svg',
  
  // أدوات البرمجة
  'github-copilot': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/github.svg',
  'tabnine': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/tabnine.svg',
  'codeium': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/codeium.svg',
  'replit': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/replit.svg',
  'cursor': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/cursor.svg',
  'amazon-codewhisperer': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/amazonaws.svg',
  
  // أدوات الكتابة والمحتوى
  'jasper-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/jasper.svg',
  'copy-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/copyai.svg',
  'writesonic': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/writesonic.svg',
  'grammarly': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/grammarly.svg',
  'quillbot': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/quillbot.svg',
  'notion-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/notion.svg',
  'wordtune': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/wordtune.svg',
  
  // أدوات الفيديو والصوت
  'synthesia': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/synthesia.svg',
  'heygen': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/heygen.svg',
  'runway-ml': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/runway.svg',
  'pika': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/pika.svg',
  'elevenlabs': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/elevenlabs.svg',
  'murf-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/murf.svg',
  'descript': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/descript.svg',
  'otter-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/otter.svg',
  'loom': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/loom.svg',
  
  // أدوات التسويق والأعمال
  'zapier': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/zapier.svg',
  'hubspot': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/hubspot.svg',
  'salesforce': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/salesforce.svg',
  'mailchimp': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/mailchimp.svg',
  'klaviyo': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/klaviyo.svg',
  
  // أدوات التحليل والبيانات
  'tableau-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/tableau.svg',
  'power-bi': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/powerbi.svg',
  'google-analytics': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/googleanalytics.svg',
  'alteryx': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/alteryx.svg',
  
  // أدوات SEO والتسويق الرقمي
  'semrush': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/semrush.svg',
  'ahrefs': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/ahrefs.svg',
  'moz': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/moz.svg',
  'surfer-seo': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/surfer.svg',
  
  // أدوات الترجمة
  'deepl-translator': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/deepl.svg',
  'google-translate': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/googletranslate.svg',
  'yandex-translate': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/yandex.svg',
  
  // أدوات التطوير والتصميم
  'webflow': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/webflow.svg',
  'bubble': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/bubble.svg',
  'framer': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/framer.svg',
  'adobe-xd': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/adobexd.svg',
  'sketch': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/sketch.svg',
  
  // أدوات الموسيقى والصوت
  'suno-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/suno.svg',
  'spotify': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/spotify.svg',
  'soundcloud': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/soundcloud.svg',
  
  // أدوات التعليم
  'coursera': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/coursera.svg',
  'udemy': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/udemy.svg',
  'khan-academy': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/khanacademy.svg',
  
  // أدوات التواصل الاجتماعي
  'discord': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/discord.svg',
  'slack': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/slack.svg',
  'microsoft-teams': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/microsoftteams.svg',
  'zoom': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/zoom.svg',
  
  // أيقونات افتراضية للفئات
  'chatbot': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/chatbot.svg',
  'ai-brain': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/brain.svg',
  'robot': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/robot.svg',
  'neural-network': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/neuralnetwork.svg'
};

// دالة البحث عن أفضل أيقونة للأداة
function findBestIcon(toolName, slug, category = '', description = '') {
  const searchText = `${toolName} ${slug} ${category} ${description}`.toLowerCase();
  
  // البحث المباشر بالـ slug
  if (AI_TOOLS_ICONS[slug]) {
    return {
      iconUrl: AI_TOOLS_ICONS[slug],
      source: 'direct_match',
      matchedKey: slug
    };
  }
  
  // البحث بالاسم المنظف
  const cleanName = toolName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-');
    
  if (AI_TOOLS_ICONS[cleanName]) {
    return {
      iconUrl: AI_TOOLS_ICONS[cleanName],
      source: 'clean_name_match',
      matchedKey: cleanName
    };
  }
  
  // البحث بالكلمات المفتاحية
  const keywordMatches = Object.keys(AI_TOOLS_ICONS).filter(key => {
    return searchText.includes(key.replace(/-/g, ' ')) || 
           key.replace(/-/g, ' ').includes(toolName.toLowerCase());
  });
  
  if (keywordMatches.length > 0) {
    return {
      iconUrl: AI_TOOLS_ICONS[keywordMatches[0]],
      source: 'keyword_match',
      matchedKey: keywordMatches[0]
    };
  }
  
  // البحث بالفئة
  const categoryIcons = {
    'محادثة': 'chatbot',
    'كتابة': 'ai-brain',
    'صور': 'ai-brain',
    'فيديو': 'ai-brain',
    'صوت': 'ai-brain',
    'برمجة': 'robot',
    'تسويق': 'ai-brain',
    'تحليل': 'neural-network',
    'تصميم': 'ai-brain'
  };
  
  for (const [cat, icon] of Object.entries(categoryIcons)) {
    if (category.includes(cat) || searchText.includes(cat)) {
      return {
        iconUrl: AI_TOOLS_ICONS[icon],
        source: 'category_match',
        matchedKey: icon
      };
    }
  }
  
  // الأيقونة الافتراضية
  return {
    iconUrl: AI_TOOLS_ICONS['ai-brain'],
    source: 'default',
    matchedKey: 'ai-brain'
  };
}

// دالة تحديث أيقونة أداة واحدة
async function updateToolIcon(toolId, toolName, slug, category, description) {
  try {
    const iconInfo = findBestIcon(toolName, slug, category, description);
    
    const { error } = await supabase
      .from('ai_tools')
      .update({ logo_url: iconInfo.iconUrl })
      .eq('id', toolId);

    if (error) {
      console.error(`❌ خطأ في تحديث ${toolName}:`, error.message);
      return { success: false, error: error.message };
    }

    console.log(`✅ تم تحديث ${toolName} -> ${iconInfo.matchedKey} (${iconInfo.source})`);
    return { 
      success: true, 
      iconInfo,
      toolName,
      newIconUrl: iconInfo.iconUrl
    };

  } catch (error) {
    console.error(`💥 خطأ في تحديث ${toolName}:`, error.message);
    return { success: false, error: error.message };
  }
}

// دالة تحديث جميع الأيقونات
async function updateAllAIToolsIcons() {
  try {
    console.log('🚀 بدء تحديث أيقونات أدوات الذكاء الاصطناعي...');
    console.log(`📍 المصدر: jsDelivr + Simple Icons`);
    console.log(`🎯 الهدف: ${SUPABASE_URL}`);
    
    // جلب جميع أدوات الذكاء الاصطناعي
    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('id, name, slug, category, description')
      .order('name');

    if (error) {
      console.error('❌ خطأ في جلب الأدوات:', error.message);
      return false;
    }

    if (!tools || tools.length === 0) {
      console.log('⚠️ لا توجد أدوات للتحديث');
      return false;
    }

    console.log(`📊 عدد الأدوات: ${tools.length}`);
    console.log('='.repeat(60));

    let updatedCount = 0;
    let errorCount = 0;
    const results = [];

    // تحديث كل أداة
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      
      const result = await updateToolIcon(
        tool.id, 
        tool.name, 
        tool.slug, 
        tool.category || '', 
        tool.description || ''
      );

      results.push(result);

      if (result.success) {
        updatedCount++;
      } else {
        errorCount++;
      }

      // تقرير التقدم كل 10 أدوات
      if ((i + 1) % 10 === 0) {
        console.log(`📊 تقدم: ${i + 1}/${tools.length} (${Math.round((i + 1) / tools.length * 100)}%)`);
      }

      // توقف قصير لتجنب الضغط على قاعدة البيانات
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n🎉 تم الانتهاء من التحديث!');
    console.log('='.repeat(60));
    console.log(`✅ تم تحديث: ${updatedCount} أداة`);
    console.log(`❌ فشل: ${errorCount} أداة`);
    console.log(`📈 معدل النجاح: ${Math.round(updatedCount / tools.length * 100)}%`);

    // إحصائيات مصادر الأيقونات
    const sourceStats = {};
    results.filter(r => r.success).forEach(r => {
      sourceStats[r.iconInfo.source] = (sourceStats[r.iconInfo.source] || 0) + 1;
    });

    console.log('\n📊 إحصائيات مصادر الأيقونات:');
    Object.entries(sourceStats).forEach(([source, count]) => {
      console.log(`   ${source}: ${count} أداة`);
    });

    // حفظ تقرير مفصل
    const report = {
      update_date: new Date().toISOString(),
      target_url: SUPABASE_URL,
      total_tools: tools.length,
      updated_count: updatedCount,
      error_count: errorCount,
      success_rate: Math.round(updatedCount / tools.length * 100),
      source_stats: sourceStats,
      results: results
    };

    require('fs').writeFileSync(
      'ai_tools_icons_update_report.json',
      JSON.stringify(report, null, 2)
    );

    console.log('\n📋 تقرير مفصل محفوظ في: ai_tools_icons_update_report.json');

    return updatedCount > 0;

  } catch (error) {
    console.error('💥 خطأ عام في تحديث الأيقونات:', error.message);
    return false;
  }
}

// تشغيل التحديث
if (require.main === module) {
  updateAllAIToolsIcons().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = {
  updateAllAIToolsIcons,
  updateToolIcon,
  findBestIcon,
  AI_TOOLS_ICONS
};
