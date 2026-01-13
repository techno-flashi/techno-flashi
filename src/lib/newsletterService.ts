// خدمات النشرة البريدية
import { supabase } from './supabase';

export interface SubscriptionResult {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
}

export interface SubscriberData {
  email: string;
  name?: string;
  source?: string;
  preferences?: Record<string, any>;
}

// التحقق من صحة البريد الإلكتروني
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

// تنظيف البريد الإلكتروني
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// التحقق من وجود المشترك
export async function checkExistingSubscriber(email: string): Promise<{
  exists: boolean;
  subscriber?: any;
  status?: string;
}> {
  try {
    const cleanEmail = sanitizeEmail(email);
    
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('خطأ في التحقق من المشترك:', error);
      return { exists: false };
    }

    return {
      exists: !!data,
      subscriber: data,
      status: data?.status
    };
  } catch (error) {
    console.error('خطأ في التحقق من المشترك:', error);
    return { exists: false };
  }
}

// اشتراك جديد
export async function subscribeToNewsletter(
  subscriberData: SubscriberData,
  ipAddress?: string,
  userAgent?: string
): Promise<SubscriptionResult> {
  try {
    // التحقق من صحة البريد الإلكتروني
    if (!validateEmail(subscriberData.email)) {
      return {
        success: false,
        message: 'البريد الإلكتروني غير صحيح'
      };
    }

    const cleanEmail = sanitizeEmail(subscriberData.email);

    // التحقق من وجود المشترك
    const existingCheck = await checkExistingSubscriber(cleanEmail);
    
    if (existingCheck.exists) {
      if (existingCheck.status === 'active') {
        return {
          success: false,
          message: 'هذا البريد الإلكتروني مشترك بالفعل في النشرة البريدية'
        };
      } else if (existingCheck.status === 'unsubscribed') {
        // إعادة تفعيل الاشتراك
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'active',
            confirmed_at: new Date().toISOString(),
            unsubscribed_at: null,
            subscription_source: subscriberData.source || 'website',
            preferences: subscriberData.preferences || {},
            ip_address: ipAddress,
            user_agent: userAgent
          })
          .eq('email', cleanEmail)
          .select()
          .single();

        if (error) {
          console.error('خطأ في إعادة تفعيل الاشتراك:', error);
          return {
            success: false,
            message: 'حدث خطأ أثناء إعادة تفعيل الاشتراك'
          };
        }

        return {
          success: true,
          message: 'تم إعادة تفعيل اشتراكك بنجاح! ستصلك النشرة البريدية قريباً.',
          data
        };
      }
    }

    // إنشاء اشتراك جديد
    const newSubscriber = {
      email: cleanEmail,
      name: subscriberData.name?.trim() || null,
      status: 'active',
      subscription_source: subscriberData.source || 'website',
      preferences: subscriberData.preferences || {},
      ip_address: ipAddress,
      user_agent: userAgent,
      confirmed_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([newSubscriber])
      .select()
      .single();

    if (error) {
      console.error('خطأ في إنشاء الاشتراك:', error);
      
      // التحقق من نوع الخطأ
      if (error.code === '23505') { // unique violation
        return {
          success: false,
          message: 'هذا البريد الإلكتروني مشترك بالفعل'
        };
      }
      
      return {
        success: false,
        message: 'حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.'
      };
    }

    return {
      success: true,
      message: 'تم اشتراكك بنجاح! ستصلك النشرة البريدية الأسبوعية مع أحدث المقالات والأدوات التقنية.',
      data
    };

  } catch (error) {
    console.error('خطأ في خدمة الاشتراك:', error);
    return {
      success: false,
      message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
    };
  }
}

// إلغاء الاشتراك
export async function unsubscribeFromNewsletter(email: string): Promise<SubscriptionResult> {
  try {
    if (!validateEmail(email)) {
      return {
        success: false,
        message: 'البريد الإلكتروني غير صحيح'
      };
    }

    const cleanEmail = sanitizeEmail(email);

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', cleanEmail)
      .select()
      .single();

    if (error) {
      console.error('خطأ في إلغاء الاشتراك:', error);
      return {
        success: false,
        message: 'حدث خطأ أثناء إلغاء الاشتراك'
      };
    }

    if (!data) {
      return {
        success: false,
        message: 'البريد الإلكتروني غير مشترك في النشرة البريدية'
      };
    }

    return {
      success: true,
      message: 'تم إلغاء اشتراكك بنجاح',
      data
    };

  } catch (error) {
    console.error('خطأ في إلغاء الاشتراك:', error);
    return {
      success: false,
      message: 'حدث خطأ غير متوقع'
    };
  }
}

// الحصول على إحصائيات المشتركين
export async function getSubscriberStats(): Promise<{
  total: number;
  active: number;
  unsubscribed: number;
  pending: number;
}> {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('status');

    if (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      return { total: 0, active: 0, unsubscribed: 0, pending: 0 };
    }

    const stats = data.reduce((acc, subscriber) => {
      acc.total++;
      if (subscriber.status === 'active') acc.active++;
      else if (subscriber.status === 'unsubscribed') acc.unsubscribed++;
      else if (subscriber.status === 'pending') acc.pending++;
      return acc;
    }, { total: 0, active: 0, unsubscribed: 0, pending: 0 });

    return stats;
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    return { total: 0, active: 0, unsubscribed: 0, pending: 0 };
  }
}

// الحصول على معلومات المشترك
export async function getSubscriberInfo(email: string) {
  try {
    const cleanEmail = sanitizeEmail(email);
    
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (error) {
      console.error('خطأ في جلب معلومات المشترك:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('خطأ في جلب معلومات المشترك:', error);
    return null;
  }
}
