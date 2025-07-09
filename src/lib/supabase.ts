// هذا الملف يقوم بإعداد وتصدير "العميل" الخاص بـ Supabase
// الذي سنستخدمه للتواصل مع قاعدة البيانات في كل مكان بالموقع

import { createClient } from '@supabase/supabase-js'

// استيراد المفاتيح من ملف البيئة مع التحقق من وجودها
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zgktrwpladrkhhemhnni.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpna3Ryd3BsYWRya2hoZW1obm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjk0NTIsImV4cCI6MjA2NzYwNTQ1Mn0.uHKisokqk484Vq5QjCbVbcdcabxArrtKUMxjdCihe04'

// التحقق من وجود المتغيرات
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// إنشاء وتصدير العميل
export const supabase = createClient(supabaseUrl, supabaseKey);
