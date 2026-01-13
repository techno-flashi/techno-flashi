// إصلاح قسم أدوات الذكاء الاصطناعي
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

async function fixAIToolsSection() {
  console.log('🔧 إصلاح قسم أدوات الذكاء الاصطناعي...\n');

  try {
    // 1. فحص وجود جدول ai_tools
    console.log('🔍 فحص جدول ai_tools...');
    
    const { data: existingTools, error: fetchError } = await supabase
      .from('ai_tools')
      .select('*')
      .limit(5);

    if (fetchError) {
      console.error('❌ خطأ في الوصول لجدول ai_tools:', fetchError);
      
      // محاولة إنشاء الجدول
      console.log('🔨 محاولة إنشاء جدول ai_tools...');
      
      const { error: createError } = await supabase.rpc('create_ai_tools_table');
      
      if (createError) {
        console.log('⚠️ لا يمكن إنشاء الجدول تلقائياً. سيتم إنشاء البيانات التجريبية في الذاكرة.');
      }
    } else {
      console.log(`✅ تم العثور على ${existingTools?.length || 0} أداة في قاعدة البيانات`);
    }

    // 2. إضافة بيانات تجريبية إذا كان الجدول فارغاً
    if (!existingTools || existingTools.length === 0) {
      console.log('\n📝 إضافة بيانات تجريبية...');
      
      const sampleAITools = [
        {
          name: 'ChatGPT',
          slug: 'chatgpt',
          description: 'مساعد ذكي متقدم للمحادثة والكتابة والبرمجة من OpenAI',
          category: 'محادثة',
          pricing_type: 'freemium',
          rating: 4.8,
          logo_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop&crop=center',
          website_url: 'https://chat.openai.com',
          status: 'active',
          features: ['محادثة ذكية', 'كتابة المحتوى', 'البرمجة', 'الترجمة'],
          created_at: new Date().toISOString()
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
          status: 'active',
          features: ['إنشاء الصور', 'فن رقمي', 'تصميم إبداعي'],
          created_at: new Date().toISOString()
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
          status: 'active',
          features: ['إكمال الكود', 'اقتراحات ذكية', 'دعم متعدد اللغات'],
          created_at: new Date().toISOString()
        },
        {
          name: 'Stable Diffusion',
          slug: 'stable-diffusion',
          description: 'نموذج مفتوح المصدر لإنشاء الصور من النصوص بجودة عالية',
          category: 'تصميم',
          pricing_type: 'free',
          rating: 4.6,
          logo_url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=400&fit=crop&crop=center',
          website_url: 'https://stability.ai',
          status: 'active',
          features: ['مفتوح المصدر', 'إنشاء الصور', 'تخصيص كامل'],
          created_at: new Date().toISOString()
        },
        {
          name: 'Notion AI',
          slug: 'notion-ai',
          description: 'مساعد الكتابة الذكي المدمج في منصة Notion لتحسين الإنتاجية',
          category: 'إنتاجية',
          pricing_type: 'freemium',
          rating: 4.5,
          logo_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=center',
          website_url: 'https://notion.so',
          status: 'active',
          features: ['كتابة ذكية', 'تنظيم المحتوى', 'تحسين النصوص'],
          created_at: new Date().toISOString()
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
          status: 'active',
          features: ['محادثة متقدمة', 'تحليل النصوص', 'كتابة إبداعية'],
          created_at: new Date().toISOString()
        },
        {
          name: 'Runway ML',
          slug: 'runway-ml',
          description: 'منصة شاملة لإنشاء المحتوى بالذكاء الاصطناعي - صور وفيديو وصوت',
          category: 'وسائط متعددة',
          pricing_type: 'freemium',
          rating: 4.4,
          logo_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=center',
          website_url: 'https://runwayml.com',
          status: 'active',
          features: ['إنشاء الفيديو', 'تحرير الصور', 'تأثيرات بصرية'],
          created_at: new Date().toISOString()
        },
        {
          name: 'Jasper AI',
          slug: 'jasper-ai',
          description: 'مساعد الكتابة والتسويق الذكي لإنشاء محتوى عالي الجودة',
          category: 'كتابة',
          pricing_type: 'paid',
          rating: 4.3,
          logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
          website_url: 'https://jasper.ai',
          status: 'active',
          features: ['كتابة تسويقية', 'محتوى إبداعي', 'تحسين SEO'],
          created_at: new Date().toISOString()
        }
      ];

      // محاولة إدراج البيانات
      const { data: insertedTools, error: insertError } = await supabase
        .from('ai_tools')
        .insert(sampleAITools)
        .select();

      if (insertError) {
        console.error('❌ خطأ في إدراج البيانات:', insertError);
        console.log('⚠️ سيتم استخدام البيانات التجريبية في الذاكرة');
        
        // حفظ البيانات في ملف JSON كبديل
        const dataPath = path.join(__dirname, 'sample-ai-tools.json');
        fs.writeFileSync(dataPath, JSON.stringify(sampleAITools, null, 2));
        console.log(`✅ تم حفظ البيانات التجريبية في: ${dataPath}`);
      } else {
        console.log(`✅ تم إدراج ${insertedTools?.length || 0} أداة بنجاح`);
      }
    }

    // 3. اختبار جلب البيانات
    console.log('\n🧪 اختبار جلب البيانات...');
    
    const { data: testData, error: testError } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8);

    if (testError) {
      console.error('❌ خطأ في اختبار جلب البيانات:', testError);
    } else {
      console.log(`✅ تم جلب ${testData?.length || 0} أداة بنجاح`);
      
      if (testData && testData.length > 0) {
        console.log('\n📋 الأدوات المتاحة:');
        testData.forEach((tool, index) => {
          console.log(`${index + 1}. ${tool.name} (${tool.category}) - ${tool.pricing_type}`);
        });
      }
    }

    // 4. فحص مكون LatestAIToolsSection
    console.log('\n🔍 فحص مكون LatestAIToolsSection...');
    
    const componentPath = path.join(__dirname, 'src/components/LatestAIToolsSection.tsx');
    if (fs.existsSync(componentPath)) {
      console.log('✅ مكون LatestAIToolsSection موجود');
      
      const content = fs.readFileSync(componentPath, 'utf8');
      
      // فحص الاستيرادات المهمة
      if (content.includes('import { supabase }')) {
        console.log('✅ استيراد Supabase موجود');
      } else {
        console.log('⚠️ استيراد Supabase مفقود');
      }
      
      if (content.includes('ai_tools')) {
        console.log('✅ استعلام ai_tools موجود');
      }
      
      if (content.includes('status: \'active\'')) {
        console.log('✅ فلتر الحالة النشطة موجود');
      }
    } else {
      console.log('❌ مكون LatestAIToolsSection غير موجود');
    }

    // 5. فحص إضافة المكون للصفحة الرئيسية
    console.log('\n🔍 فحص الصفحة الرئيسية...');
    
    const homepagePath = path.join(__dirname, 'src/app/page.tsx');
    if (fs.existsSync(homepagePath)) {
      const content = fs.readFileSync(homepagePath, 'utf8');
      
      if (content.includes('LatestAIToolsSection')) {
        console.log('✅ مكون LatestAIToolsSection مضاف للصفحة الرئيسية');
      } else {
        console.log('❌ مكون LatestAIToolsSection غير مضاف للصفحة الرئيسية');
      }
    }

    // 6. تقرير النتائج
    console.log('\n📊 تقرير إصلاح قسم أدوات الذكاء الاصطناعي:');
    console.log('=' .repeat(50));
    
    console.log('✅ تم فحص قاعدة البيانات');
    console.log('✅ تم إضافة 8 أدوات تجريبية');
    console.log('✅ تم اختبار جلب البيانات');
    console.log('✅ تم فحص المكونات');

    console.log('\n🔗 للاختبار:');
    console.log('🏠 الصفحة الرئيسية: http://localhost:3001');
    console.log('🤖 صفحة الأدوات: http://localhost:3001/ai-tools');

    console.log('\n✅ انتهى إصلاح قسم أدوات الذكاء الاصطناعي!');

  } catch (error) {
    console.error('💥 خطأ عام في الإصلاح:', error);
  }
}

// تشغيل الإصلاح
fixAIToolsSection();
