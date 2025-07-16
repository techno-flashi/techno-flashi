// Check what tables exist in the new Supabase project
const { createClient } = require('@supabase/supabase-js');

const NEW_SUPABASE_URL = 'https://xfxpwbqgtuhbkeksdbqn.supabase.co';
const NEW_SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZnB3YnFndHVoYmtla3NkYnFuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUyNjUwOCwiZXhwIjoyMDY4MTAyNTA4fQ.aBsmv7Vj8-W8y_kFscTf-DLJElK8jnHBAZsFQ5vHpTM';

const supabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

async function checkTables() {
  try {
    console.log('🔍 Checking tables in new Supabase project...');
    console.log(`📍 URL: ${NEW_SUPABASE_URL}`);
    console.log('='.repeat(50));

    // Try to query information_schema to see what tables exist
    const { data, error } = await supabase
      .rpc('get_schema_tables');

    if (error) {
      console.log('❌ Cannot query schema, trying direct table access...');
      
      // Try accessing each table individually
      const tables = ['ai_tools', 'articles', 'services', 'site_pages'];
      
      for (const table of tables) {
        try {
          const { count, error: tableError } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          if (tableError) {
            console.log(`❌ ${table}: ${tableError.message}`);
          } else {
            console.log(`✅ ${table}: ${count} records`);
          }
        } catch (e) {
          console.log(`❌ ${table}: ${e.message}`);
        }
      }
    } else {
      console.log('✅ Schema query successful:', data);
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

checkTables();
