// هذا الملف يقوم بإعداد وتصدير "العميل" الخاص بـ Supabase
// الذي سنستخدمه للتواصل مع قاعدة البيانات في كل مكان بالموقع

import { createClient } from '@supabase/supabase-js'

// استيراد المفاتيح من ملف البيئة .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// إنشاء وتصدير العميل
export const supabase = createClient(supabaseUrl, supabaseKey);
