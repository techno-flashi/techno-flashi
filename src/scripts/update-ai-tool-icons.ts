// سكريبت لتحديث أيقونات أدوات الذكاء الاصطناعي
import { supabase } from '@/lib/supabase';
import { updateToolWithIcon, findBestIcon } from '@/lib/ai-tool-icons';

export async function updateAllAIToolIcons() {
  try {
    console.log('🚀 بدء تحديث أيقونات أدوات الذكاء الاصطناعي...');
    
    // جلب جميع أدوات الذكاء الاصطناعي
    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ خطأ في جلب أدوات الذكاء الاصطناعي:', error);
      return;
    }

    if (!tools || tools.length === 0) {
      console.log('🤖 لا توجد أدوات ذكاء اصطناعي للتحديث');
      return;
    }

    console.log(`🛠️ تم العثور على ${tools.length} أداة ذكاء اصطناعي`);

    let updatedCount = 0;
    let errorCount = 0;

    // تحديث كل أداة
    for (const tool of tools) {
      try {
        // العثور على أفضل أيقونة للأداة
        const bestIcon = findBestIcon(tool.name, tool.description || '', tool.category || '');
        
        console.log(`🔄 تحديث الأداة: ${tool.name} -> ${bestIcon.name}`);

        // تحديث الأداة في قاعدة البيانات
        const { error: updateError } = await supabase
          .from('ai_tools')
          .update({
            logo_url: bestIcon.iconUrl,
            // يمكن إضافة حقل لون إذا كان متوفر في قاعدة البيانات
            // icon_color: bestIcon.color
          })
          .eq('id', tool.id);

        if (updateError) {
          console.error(`❌ خطأ في تحديث الأداة ${tool.name}:`, updateError);
          errorCount++;
        } else {
          console.log(`✅ تم تحديث الأداة: ${tool.name} بأيقونة ${bestIcon.name}`);
          updatedCount++;
        }

        // توقف قصير لتجنب الضغط على قاعدة البيانات
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (toolError) {
        console.error(`💥 خطأ في معالجة الأداة ${tool.name}:`, toolError);
        errorCount++;
      }
    }

    console.log(`🎉 تم الانتهاء من التحديث!`);
    console.log(`✅ تم تحديث ${updatedCount} أداة بنجاح`);
    if (errorCount > 0) {
      console.log(`❌ فشل في تحديث ${errorCount} أداة`);
    }

  } catch (error) {
    console.error('💥 خطأ عام في تحديث أيقونات أدوات الذكاء الاصطناعي:', error);
  }
}

// دالة لتحديث أداة واحدة فقط (للاختبار)
export async function updateSingleTool(toolId: string) {
  try {
    console.log(`🔄 تحديث أداة واحدة: ${toolId}`);
    
    // جلب الأداة
    const { data: tool, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('id', toolId)
      .single();

    if (error || !tool) {
      console.error('❌ خطأ في جلب الأداة:', error);
      return;
    }

    // العثور على أفضل أيقونة
    const bestIcon = findBestIcon(tool.name, tool.description || '', tool.category || '');
    
    console.log(`🎯 أفضل أيقونة للأداة ${tool.name}: ${bestIcon.name}`);

    // تحديث الأداة
    const { error: updateError } = await supabase
      .from('ai_tools')
      .update({
        logo_url: bestIcon.iconUrl
      })
      .eq('id', toolId);

    if (updateError) {
      console.error('❌ خطأ في التحديث:', updateError);
    } else {
      console.log('✅ تم التحديث بنجاح!');
    }

  } catch (error) {
    console.error('💥 خطأ في تحديث الأداة الواحدة:', error);
  }
}

// دالة لعرض إحصائيات الأدوات
export async function showToolsStats() {
  try {
    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('name, category, logo_url')
      .order('category');

    if (error || !tools) {
      console.error('❌ خطأ في جلب الإحصائيات:', error);
      return;
    }

    console.log(`📊 إحصائيات أدوات الذكاء الاصطناعي:`);
    console.log(`📈 إجمالي الأدوات: ${tools.length}`);
    
    // تجميع حسب الفئة
    const categories = tools.reduce((acc: any, tool) => {
      const category = tool.category || 'غير محدد';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    console.log(`📂 الفئات:`);
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} أداة`);
    });

    // عدد الأدوات التي لها أيقونات
    const withIcons = tools.filter(tool => tool.logo_url && tool.logo_url.includes('svgrepo.com')).length;
    console.log(`🎨 الأدوات مع أيقونات SVG Repo: ${withIcons}`);
    console.log(`🔄 الأدوات تحتاج تحديث: ${tools.length - withIcons}`);

  } catch (error) {
    console.error('💥 خطأ في عرض الإحصائيات:', error);
  }
}

// تشغيل السكريبت إذا تم استدعاؤه مباشرة
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'update':
      updateAllAIToolIcons();
      break;
    case 'stats':
      showToolsStats();
      break;
    case 'single':
      const toolId = process.argv[3];
      if (toolId) {
        updateSingleTool(toolId);
      } else {
        console.log('❌ يرجى تحديد معرف الأداة');
      }
      break;
    default:
      console.log('📖 الاستخدام:');
      console.log('  npm run update-icons update  - تحديث جميع الأدوات');
      console.log('  npm run update-icons stats   - عرض الإحصائيات');
      console.log('  npm run update-icons single <id> - تحديث أداة واحدة');
  }
}
