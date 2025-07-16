// Comprehensive test for new Supabase database connection
const { createClient } = require('@supabase/supabase-js');

// NEW SUPABASE PROJECT CREDENTIALS
const SUPABASE_URL = 'https://xfxpwbqgtuhbkeksdbqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnB3YnFndHVoYmtla3NkYnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MjY1MDgsImV4cCI6MjA2ODEwMjUwOH0.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnB3YnFndHVoYmtla3NkYnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUyNjUwOCwiZXhwIjoyMDY4MTAyNTA4fQ.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';

// Create clients
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testNewDatabaseConnection() {
  try {
    console.log('🔄 TESTING NEW SUPABASE DATABASE CONNECTION');
    console.log('='.repeat(80));
    console.log(`📍 Project URL: ${SUPABASE_URL}`);
    console.log(`🆔 Project ID: xfxpwbqgtuhbkeksdbqn`);
    console.log(`🎯 Goal: Fresh start with new database project`);
    console.log('='.repeat(80));

    // Test 1: Basic Connection
    console.log('\n1️⃣ TESTING BASIC CONNECTION...');
    try {
      const { data: sessionData, error: sessionError } = await supabaseAnon.auth.getSession();
      
      if (sessionError && !sessionError.message.includes('session')) {
        console.log('❌ Connection failed:', sessionError.message);
        return false;
      }
      console.log('✅ Basic connection successful');
    } catch (connError) {
      console.log('❌ Connection error:', connError.message);
      return false;
    }

    // Test 2: Check Required Tables
    console.log('\n2️⃣ CHECKING REQUIRED TABLES...');
    const requiredTables = ['ai_tools', 'articles', 'services', 'site_pages'];
    const tableStatus = {};

    for (const tableName of requiredTables) {
      try {
        console.log(`\n📋 Checking table: ${tableName}`);
        
        const { count, error } = await supabaseAnon
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`);
          tableStatus[tableName] = { exists: false, count: 0, error: error.message };
          
          if (error.message.includes('does not exist') || error.message.includes('relation')) {
            console.log(`⚠️  Table ${tableName} does not exist - needs creation`);
          }
        } else {
          console.log(`✅ ${tableName}: ${count} records`);
          tableStatus[tableName] = { exists: true, count: count || 0 };
          
          // Show sample data if exists
          if (count > 0) {
            const { data: sampleData } = await supabaseAnon
              .from(tableName)
              .select('*')
              .limit(2);
            
            console.log(`📊 Sample data:`);
            sampleData?.forEach((item, index) => {
              const displayField = item.name || item.title || item.slug || item.id;
              console.log(`   ${index + 1}. ${displayField}`);
            });
          }
        }
      } catch (tableError) {
        console.log(`💥 Error checking ${tableName}: ${tableError.message}`);
        tableStatus[tableName] = { exists: false, count: 0, error: tableError.message };
      }
    }

    // Test 3: Database Schema Information
    console.log('\n3️⃣ CHECKING DATABASE SCHEMA...');
    try {
      // Try to get schema information using service role
      const { data: schemaData, error: schemaError } = await supabaseService
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (schemaError) {
        console.log('⚠️  Cannot access schema information:', schemaError.message);
      } else if (schemaData && schemaData.length > 0) {
        console.log('✅ Available tables in database:');
        schemaData.forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      } else {
        console.log('⚠️  No tables found in public schema');
      }
    } catch (schemaError) {
      console.log('⚠️  Schema check failed:', schemaError.message);
    }

    // Test 4: Storage Access
    console.log('\n4️⃣ TESTING STORAGE ACCESS...');
    try {
      const { data: buckets, error: storageError } = await supabaseService.storage.listBuckets();
      
      if (storageError) {
        console.log('❌ Storage access failed:', storageError.message);
      } else {
        console.log(`✅ Storage accessible - ${buckets?.length || 0} buckets found`);
        buckets?.forEach(bucket => {
          console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
        });
      }
    } catch (storageError) {
      console.log('⚠️  Storage check failed:', storageError.message);
    }

    // Test 5: Environment Variables Check
    console.log('\n5️⃣ CHECKING ENVIRONMENT VARIABLES...');
    const envVars = {
      'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY
    };

    Object.entries(envVars).forEach(([key, value]) => {
      if (value) {
        const isCorrectProject = value.includes('xfxpwbqgtuhbkeksdbqn');
        console.log(`${isCorrectProject ? '✅' : '⚠️'} ${key}: ${isCorrectProject ? 'Correct project' : 'Check project ID'}`);
      } else {
        console.log(`❌ ${key}: Not set`);
      }
    });

    // Final Summary
    console.log('\n🎯 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    
    const existingTables = Object.entries(tableStatus).filter(([_, status]) => status.exists);
    const missingTables = Object.entries(tableStatus).filter(([_, status]) => !status.exists);
    
    console.log(`✅ Database connection: Working`);
    console.log(`📊 Existing tables: ${existingTables.length}/${requiredTables.length}`);
    console.log(`❌ Missing tables: ${missingTables.length}`);
    
    if (existingTables.length > 0) {
      console.log('\n📋 Existing tables:');
      existingTables.forEach(([name, status]) => {
        console.log(`   ✅ ${name}: ${status.count} records`);
      });
    }
    
    if (missingTables.length > 0) {
      console.log('\n⚠️  Missing tables (need creation):');
      missingTables.forEach(([name, status]) => {
        console.log(`   ❌ ${name}: ${status.error}`);
      });
    }

    console.log('\n🚀 NEXT STEPS:');
    if (missingTables.length === requiredTables.length) {
      console.log('📝 Database is empty - need to create all tables and migrate data');
      console.log('🔧 Recommend: Run database migration scripts');
    } else if (missingTables.length > 0) {
      console.log('📝 Some tables missing - need to create missing tables');
      console.log('🔧 Recommend: Create missing tables and migrate specific data');
    } else {
      console.log('🎉 All tables exist - ready for development!');
      console.log('🔧 Recommend: Test website functionality');
    }

    return {
      connected: true,
      tablesExist: existingTables.length,
      tablesMissing: missingTables.length,
      tableStatus: tableStatus
    };

  } catch (error) {
    console.error('💥 CRITICAL ERROR:', error.message);
    return { connected: false, error: error.message };
  }
}

// Run the test
if (require.main === module) {
  testNewDatabaseConnection().then(result => {
    if (result.connected) {
      console.log('\n🎊 NEW SUPABASE PROJECT CONNECTION SUCCESSFUL!');
      process.exit(0);
    } else {
      console.log('\n❌ CONNECTION FAILED');
      process.exit(1);
    }
  });
}

module.exports = { testNewDatabaseConnection };
