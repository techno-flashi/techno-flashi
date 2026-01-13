// تحديث أيقونات أدوات الذكاء الاصطناعي - المشروع الصحيح
const { createClient } = require('@supabase/supabase-js');

// المشروع الصحيح
const SUPABASE_URL = 'https://zgktrwpladrkhhemhnni.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3Ryd3BsYWRya2hoZW1obm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjk0NTIsImV4cCI6MjA2NzYwNTQ1Mn0.uHKisokqk484Vq5QjCbVbcdcabxArrtKUMxjdCihe04';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// مكتبة الأيقونات المحسنة
const AI_TOOLS_ICONS = {
  // أدوات الذكاء الاصطناعي الشهيرة
  'chatgpt': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/openai.svg',
  'claude': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/anthropic.svg',
  'gemini': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/google.svg',
  'perplexity': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/perplexity.svg',
  'character-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/character.svg',
  
  // أدوات إنشاء الصور
  'midjourney': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/midjourney.svg',
  'dall-e': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/openai.svg',
  'stable-diffusion': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/stablediffusion.svg',
  'leonardo': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/leonardo.svg',
  'adobe-firefly': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/adobe.svg',
  'canva': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/canva.svg',
  'figma': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/figma.svg',
  
  // أدوات البرمجة
  'github-copilot': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/github.svg',
  'tabnine': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/tabnine.svg',
  'codeium': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/codeium.svg',
  'replit': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/replit.svg',
  'cursor': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/cursor.svg',
  
  // أدوات الكتابة
  'jasper': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/jasper.svg',
  'copy-ai': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/copyai.svg',
  'writesonic': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/writesonic.svg',
  'grammarly': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/grammarly.svg',
  'quillbot': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/quillbot.svg',
  'notion': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/notion.svg',
  'wordtune': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/wordtune.svg',
  
  // أدوات الفيديو والصوت
  'synthesia': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/synthesia.svg',
  'heygen': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/heygen.svg',
  'runway': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/runway.svg',
  'pika': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/pika.svg',
  'elevenlabs': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/elevenlabs.svg',
  'murf': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/murf.svg',
  'descript': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/descript.svg',
  'otter': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/otter.svg',
  'loom': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/loom.svg',
  
  // أدوات الأعمال
  'zapier': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/zapier.svg',
  'hubspot': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/hubspot.svg',
  'salesforce': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/salesforce.svg',
  'mailchimp': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/mailchimp.svg',
  'slack': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/slack.svg',
  'discord': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/discord.svg',
  'zoom': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/zoom.svg',
  
  // أدوات التحليل
  'tableau': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/tableau.svg',
  'powerbi': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/powerbi.svg',
  'google-analytics': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/googleanalytics.svg',
  
  // أدوات SEO
  'semrush': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/semrush.svg',
  'ahrefs': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/ahrefs.svg',
  'moz': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/moz.svg',
  
  // أدوات الترجمة
  'deepl': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/deepl.svg',
  'google-translate': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/googletranslate.svg',
  'yandex': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/yandex.svg',
  
  // أدوات التطوير
  'webflow': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/webflow.svg',
  'bubble': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/bubble.svg',
  'framer': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/framer.svg',
  'sketch': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/sketch.svg',
  
  // أيقونات افتراضية
  'ai-brain': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/brain.svg',
  'robot': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/robot.svg',
  'chatbot': 'https://cdn.jsdelivr.net/npm/simple-icons@v10/icons/chatbot.svg'
};

// دالة البحث الذكي عن الأيقونة المناسبة
function findBestIcon(toolName, slug, category = '', description = '') {
  const searchText = `${toolName} ${slug} ${category} ${description}`.toLowerCase();
  
  // البحث المباشر
  const directMatches = [
    slug?.toLowerCase(),
    toolName?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    toolName?.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '')
  ].filter(Boolean);
  
  for (const match of directMatches) {
    if (AI_TOOLS_ICONS[match]) {
      return {
        iconUrl: AI_TOOLS_ICONS[match],
        source: 'direct_match',
        matchedKey: match
      };
    }
  }
  
  // البحث بالكلمات المفتاحية
  const keywords = Object.keys(AI_TOOLS_ICONS);
  for (const keyword of keywords) {
    if (searchText.includes(keyword) || keyword.includes(toolName.toLowerCase().split(' ')[0])) {
      return {
        iconUrl: AI_TOOLS_ICONS[keyword],
        source: 'keyword_match',
        matchedKey: keyword
      };
    }
  }
  
  // البحث بالفئة
  const categoryMap = {
    'محادثة': 'chatbot',
    'كتابة': 'ai-brain',
    'صور': 'ai-brain',
    'فيديو': 'ai-brain',
    'صوت': 'ai-brain',
    'برمجة': 'robot',
    'تسويق': 'ai-brain',
    'تحليل': 'ai-brain',
    'تصميم': 'ai-brain'
  };
  
  for (const [cat, icon] of Object.entries(categoryMap)) {
    if (category?.includes(cat) || searchText.includes(cat)) {
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

// دالة تحديث جميع الأيقونات
async function updateAllAIToolsIcons() {
  try {
    console.log('🚀 بدء تحديث أيقونات أدوات الذكاء الاصطناعي...');
    console.log(`📍 المشروع: zgktrwpladrkhhemhnni`);
    console.log(`🎯 المصدر: jsDelivr + Simple Icons`);
    console.log('='.repeat(70));

    // جلب جميع الأدوات
    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('id, name, slug, category, description')
      .order('name');

    if (error) {
      console.error('❌ خطأ في جلب الأدوات:', error.message);
      return false;
    }

    console.log(`📊 عدد الأدوات: ${tools.length}`);
    console.log('');

    let updatedCount = 0;
    let errorCount = 0;
    const results = [];

    // تحديث كل أداة
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      
      try {
        const iconInfo = findBestIcon(tool.name, tool.slug, tool.category, tool.description);
        
        const { error: updateError } = await supabase
          .from('ai_tools')
          .update({ logo_url: iconInfo.iconUrl })
          .eq('id', tool.id);

        if (updateError) {
          console.error(`❌ ${tool.name}: ${updateError.message}`);
          errorCount++;
          results.push({ tool: tool.name, success: false, error: updateError.message });
        } else {
          console.log(`✅ ${i + 1}/${tools.length} - ${tool.name} -> ${iconInfo.matchedKey} (${iconInfo.source})`);
          updatedCount++;
          results.push({ 
            tool: tool.name, 
            success: true, 
            iconInfo,
            newIconUrl: iconInfo.iconUrl 
          });
        }

        // تقرير التقدم كل 25 أداة
        if ((i + 1) % 25 === 0) {
          console.log(`📊 تقدم: ${i + 1}/${tools.length} (${Math.round((i + 1) / tools.length * 100)}%)`);
        }

        // توقف قصير
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (toolError) {
        console.error(`💥 ${tool.name}: ${toolError.message}`);
        errorCount++;
        results.push({ tool: tool.name, success: false, error: toolError.message });
      }
    }

    console.log('\n🎉 تم الانتهاء من التحديث!');
    console.log('='.repeat(70));
    console.log(`✅ تم تحديث: ${updatedCount} أداة`);
    console.log(`❌ فشل: ${errorCount} أداة`);
    console.log(`📈 معدل النجاح: ${Math.round(updatedCount / tools.length * 100)}%`);

    // إحصائيات المصادر
    const sourceStats = {};
    results.filter(r => r.success).forEach(r => {
      sourceStats[r.iconInfo.source] = (sourceStats[r.iconInfo.source] || 0) + 1;
    });

    console.log('\n📊 إحصائيات مصادر الأيقونات:');
    Object.entries(sourceStats).forEach(([source, count]) => {
      console.log(`   ${source}: ${count} أداة`);
    });

    // حفظ التقرير
    require('fs').writeFileSync(
      'ai_tools_icons_update_report_correct.json',
      JSON.stringify({
        update_date: new Date().toISOString(),
        project_url: SUPABASE_URL,
        total_tools: tools.length,
        updated_count: updatedCount,
        error_count: errorCount,
        success_rate: Math.round(updatedCount / tools.length * 100),
        source_stats: sourceStats,
        results: results
      }, null, 2)
    );

    console.log('\n📋 تقرير مفصل: ai_tools_icons_update_report_correct.json');

    return updatedCount > 0;

  } catch (error) {
    console.error('💥 خطأ عام:', error.message);
    return false;
  }
}

// تشغيل التحديث
updateAllAIToolsIcons().then(success => {
  if (success) {
    console.log('\n🎊 تم تحديث الأيقونات بنجاح!');
    console.log('🔗 يمكنك الآن زيارة الموقع لرؤية الأيقونات الجديدة');
  }
  process.exit(success ? 0 : 1);
});
