// مساعدات المصادقة مع Supabase
import { supabase } from './supabase';
// import { User } from '@/types';

// تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// تسجيل الخروج
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

// الحصول على المستخدم الحالي
export async function getCurrentUser(): Promise<any | null> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email!,
    created_at: user.created_at!,
  };
}

// التحقق من حالة المصادقة
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    throw new Error(error.message);
  }

  return session;
}

// التحقق من أن المستخدم مدير (يمكنك تخصيص هذا حسب احتياجاتك)
export function isAdmin(user: any | null): boolean {
  if (!user) return false;
  
  // يمكنك إضافة منطق أكثر تعقيداً هنا
  // مثل التحقق من دور المستخدم في قاعدة البيانات
  // حالياً، سنعتبر أي مستخدم مسجل كمدير
  return true;
}
