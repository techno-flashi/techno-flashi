// هذا الملف يقوم بإعداد وتصدير "العميل" الخاص بـ Supabase
// الذي سنستخدمه للتواصل مع قاعدة البيانات في كل مكان بالموقع

import { createClient } from '@supabase/supabase-js'

// New Supabase Project Configuration - xfxpwbqgtuhbkeksdbqn (CORRECT KEYS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xfxpwbqgtuhbkeksdbqn.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmeHB3YnFndHVoYmtla3NkYnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODAxNTgsImV4cCI6MjA2ODE1NjE1OH0.YQQcmfSpyEqJRO_83kzMeSrOsxt-SIJptVq0FZFPt-I'

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

  const fixed = { ...obj } as any;

  for (const key in fixed) {
    if (typeof fixed[key] === 'string') {
      fixed[key] = fixArabicEncoding(fixed[key] as string);
    } else if (Array.isArray(fixed[key])) {
      fixed[key] = fixed[key].map((item: any) =>
        typeof item === 'string' ? fixArabicEncoding(item) : item
      );
    }
  }

  return fixed as T;
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
  }
  // إزالة global headers لتجنب التداخل مع رفع الملفات
});
