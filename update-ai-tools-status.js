// تحديث حالة أدوات الذكاء الاصطناعي
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// قراءة متغيرات البيئة
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  }
}

loadEnvFile();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zgktrwpladrkhhemhnni.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Supabase key not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAIToolsStatus() {
  console.log('🔄 تحديث حالة أدوات الذكاء الاصطناعي...\n');

  try {
    // 1. فحص الأدوات الموجودة
    console.log('🔍 فحص الأدوات الموجودة...');
    
    const { data: allTools, error: fetchError } = await supabase
      .from('ai_tools')
      .select('*');

    if (fetchError) {
      console.error('❌ خطأ في جلب الأدوات:', fetchError);
      return;
    }

    console.log(`📊 إجمالي الأدوات: ${allTools?.length || 0}`);
    
    if (allTools && allTools.length > 0) {
      console.log('\n📋 الأدوات الموجودة:');
      allTools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name || 'بدون اسم'} - الحالة: ${tool.status || 'غير محددة'}`);
      });
    }

    // 2. تحديث حالة جميع الأدوات إلى active
    console.log('\n🔄 تحديث حالة الأدوات إلى active...');
    
    const { data: updatedTools, error: updateError } = await supabase
      .from('ai_tools')
      .update({ status: 'active' })
      .neq('id', 0) // تحديث جميع الصفوف
      .select();

    if (updateError) {
      console.error('❌ خطأ في تحديث الحالة:', updateError);
    } else {
      console.log(`✅ تم تحديث ${updatedTools?.length || 0} أداة`);
    }

    // 3. إضافة أدوات جديدة إذا كان العدد قليل
    if (!allTools || allTools.length < 6) {
      console.log('\n➕ إضافة أدوات جديدة...');
      
      const newTools = [
        {
          name: 'ChatGPT',
          slug: 'chatgpt',
          description: 'مساعد ذكي متقدم للمحادثة والكتابة والبرمجة من OpenAI',
          category: 'محادثة',
          pricing_type: 'freemium',
          rating: 4.8,
          logo_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop&crop=center',
          website_url: 'https://chat.openai.com',
          status: 'active'
        },
        {
          name: 'Midjourney',
          slug: 'midjourney',
          description: 'أداة إنشاء الصور بالذكاء الاصطناعي الأكثر تقدماً وإبداعاً',
          category: 'تصميم',
          pricing_type: 'paid',
          rating: 4.9,
          logo_url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop&crop=center',
          website_url: 'https://midjourney.com',
          status: 'active'
        },
        {
          name: 'GitHub Copilot',
          slug: 'github-copilot',
          description: 'مساعد البرمجة الذكي الذي يساعدك في كتابة الكود بسرعة وكفاءة',
          category: 'برمجة',
          pricing_type: 'paid',
          rating: 4.7,
          logo_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop&crop=center',
          website_url: 'https://github.com/features/copilot',
          status: 'active'
        },
        {
          name: 'Claude',
          slug: 'claude',
          description: 'مساعد ذكي متقدم من Anthropic للمحادثة والتحليل والكتابة',
          category: 'محادثة',
          pricing_type: 'freemium',
          rating: 4.7,
          logo_url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=400&fit=crop&crop=center',
          website_url: 'https://claude.ai',
          status: 'active'
        }
      ];

      const { data: insertedTools, error: insertError } = await supabase
        .from('ai_tools')
        .insert(newTools)
        .select();

      if (insertError) {
        console.error('❌ خطأ في إضافة الأدوات:', insertError);
      } else {
        console.log(`✅ تم إضافة ${insertedTools?.length || 0} أداة جديدة`);
      }
    }

    // 4. اختبار نهائي
    console.log('\n🧪 اختبار نهائي...');
    
    const { data: finalTest, error: finalError } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8);

    if (finalError) {
      console.error('❌ خطأ في الاختبار النهائي:', finalError);
    } else {
      console.log(`✅ الاختبار النهائي: ${finalTest?.length || 0} أداة نشطة`);
      
      if (finalTest && finalTest.length > 0) {
        console.log('\n🎯 الأدوات النشطة:');
        finalTest.forEach((tool, index) => {
          console.log(`${index + 1}. ${tool.name} (${tool.category || 'عام'}) - ${tool.pricing_type || 'غير محدد'}`);
        });
      }
    }

    console.log('\n✅ انتهى تحديث أدوات الذكاء الاصطناعي بنجاح!');

  } catch (error) {
    console.error('💥 خطأ عام:', error);
  }
}

// تشغيل التحديث
updateAIToolsStatus();
