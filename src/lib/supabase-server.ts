// Server-side Supabase client with service role key for file uploads and admin operations
import { createClient } from '@supabase/supabase-js'

// استيراد المفاتيح من ملف البيئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// التحقق من وجود المتغيرات
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

// إنشاء العميل مع مفتاح الخدمة للعمليات الإدارية
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
