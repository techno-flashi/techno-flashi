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

// دالة مساعدة لإصلاح encoding النص العربي
export function fixArabicEncoding(text: string): string {
  if (!text) return text;

  try {
    // إذا كان النص يحتوي على Unicode escape sequences
    if (text.includes('\\u')) {
      return JSON.parse(`"${text}"`);
    }
    return text;
  } catch (error) {
    console.warn('Failed to fix Arabic encoding for:', text);
    return text;
  }
}

// دالة لإصلاح encoding في كائن كامل
export function fixObjectEncoding<T extends Record<string, any>>(obj: T): T {
  if (!obj) return obj;

  const fixed = { ...obj };

  for (const key in fixed) {
    if (typeof fixed[key] === 'string') {
      fixed[key] = fixArabicEncoding(fixed[key]);
    } else if (Array.isArray(fixed[key])) {
      fixed[key] = fixed[key].map((item: any) =>
        typeof item === 'string' ? fixArabicEncoding(item) : item
      );
    }
  }

  return fixed;
}

// إنشاء وتصدير العميل مع إعدادات إضافية لدعم النص العربي
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept-Charset': 'utf-8'
    }
  }
});
