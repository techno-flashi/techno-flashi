// Test connection to new Supabase project
const { createClient } = require('@supabase/supabase-js');

// New Supabase project credentials
const NEW_SUPABASE_URL = 'https://xfxpwbqgtuhbkeksdbqn.supabase.co';
const NEW_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnB3YnFndHVoYmtla3NkYnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MjY1MDgsImV4cCI6MjA2ODEwMjUwOH0.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';

const supabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_ANON_KEY);

async function testNewSupabaseConnection() {
  try {
    console.log('🔍 Testing connection to new Supabase project...');
    console.log(`📍 URL: ${NEW_SUPABASE_URL}`);
    console.log(`🆔 Project ID: xfxpwbqgtuhbkeksdbqn`);
    console.log('='.repeat(70));

    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError && !sessionError.message.includes('session')) {
      console.error('❌ Connection error:', sessionError.message);
      return false;
    }
    console.log('✅ Basic connection successful');

    // Test 2: Check ai_tools table
    console.log('\n2️⃣ Testing ai_tools table...');
    const { count: aiToolsCount, error: aiToolsError } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true });

    if (aiToolsError) {
      console.error('❌ ai_tools table error:', aiToolsError.message);
      return false;
    }
    console.log(`✅ ai_tools table accessible - ${aiToolsCount} tools found`);

    // Test 3: Check articles table
    console.log('\n3️⃣ Testing articles table...');
    const { count: articlesCount, error: articlesError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    if (articlesError) {
      console.error('❌ articles table error:', articlesError.message);
    } else {
      console.log(`✅ articles table accessible - ${articlesCount} articles found`);
    }

    // Test 4: Check services table
    console.log('\n4️⃣ Testing services table...');
    const { count: servicesCount, error: servicesError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true });

    if (servicesError) {
      console.error('❌ services table error:', servicesError.message);
    } else {
      console.log(`✅ services table accessible - ${servicesCount} services found`);
    }

    // Test 5: Check site_pages table
    console.log('\n5️⃣ Testing site_pages table...');
    const { count: pagesCount, error: pagesError } = await supabase
      .from('site_pages')
      .select('*', { count: 'exact', head: true });

    if (pagesError) {
      console.error('❌ site_pages table error:', pagesError.message);
    } else {
      console.log(`✅ site_pages table accessible - ${pagesCount} pages found`);
    }

    // Test 6: Sample AI tools with SVG icons
    console.log('\n6️⃣ Testing AI tools with SVG icons...');
    const { data: sampleTools, error: sampleError } = await supabase
      .from('ai_tools')
      .select('name, logo_url')
      .limit(5)
      .order('name');

    if (sampleError) {
      console.error('❌ Sample tools error:', sampleError.message);
    } else {
      console.log('📋 Sample AI tools:');
      sampleTools.forEach(tool => {
        const isJsDelivr = tool.logo_url && tool.logo_url.includes('cdn.jsdelivr.net');
        const isSVG = tool.logo_url && tool.logo_url.endsWith('.svg');
        console.log(`   ✅ ${tool.name}: jsDelivr: ${isJsDelivr ? '✅' : '❌'} | SVG: ${isSVG ? '✅' : '❌'}`);
      });
    }

    // Test 7: Check for 231 AI tools
    console.log('\n7️⃣ Verifying AI tools count...');
    if (aiToolsCount === 231) {
      console.log('✅ Perfect! All 231 AI tools are present');
    } else if (aiToolsCount > 200) {
      console.log(`✅ Good! ${aiToolsCount} AI tools found (close to expected 231)`);
    } else {
      console.log(`⚠️ Warning: Only ${aiToolsCount} AI tools found (expected 231)`);
    }

    console.log('\n🎉 New Supabase connection test completed!');
    console.log('='.repeat(70));
    console.log(`✅ Project: xfxpwbqgtuhbkeksdbqn`);
    console.log(`✅ AI Tools: ${aiToolsCount}`);
    console.log(`✅ Articles: ${articlesCount || 0}`);
    console.log(`✅ Services: ${servicesCount || 0}`);
    console.log(`✅ Pages: ${pagesCount || 0}`);

    return true;

  } catch (error) {
    console.error('💥 General error:', error.message);
    return false;
  }
}

// Run the test
testNewSupabaseConnection().then(success => {
  if (success) {
    console.log('\n🎊 New Supabase project is ready!');
  } else {
    console.log('\n❌ Issues found with new Supabase project');
  }
  process.exit(success ? 0 : 1);
});
