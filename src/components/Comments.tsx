'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
  is_approved: boolean;
}

interface CommentsProps {
  articleId: string;
  articleTitle: string;
}

export default function Comments({ articleId, articleTitle }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.content) {
      setMessage('يرجى ملء جميع الحقول');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            article_id: articleId,
            name: formData.name.trim(),
            email: formData.email.toLowerCase().trim(),
            content: formData.content.trim(),
            is_approved: false, // يحتاج موافقة المدير
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setMessage('تم إرسال تعليقك بنجاح! سيظهر بعد المراجعة.');
      setFormData({ name: '', email: '', content: '' });
    } catch (error) {
      setMessage('حدث خطأ، يرجى المحاولة مرة أخرى');
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-dark-card rounded-xl p-8 border border-gray-800">
      <h3 className="text-2xl font-bold text-white mb-6">
        💬 التعليقات ({comments.length})
      </h3>

      {/* نموذج إضافة تعليق */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4">أضف تعليقك</h4>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="الاسم *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <textarea
            placeholder="اكتب تعليقك هنا... *"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            required
          />
          
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'جاري الإرسال...' : 'إرسال التعليق'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-blue-500 bg-opacity-20 text-blue-200 rounded-lg">
            {message}
          </div>
        )}

        <p className="text-text-description text-sm mt-4">
          💡 ملاحظة: التعليقات تخضع للمراجعة قبل النشر لضمان جودة المحتوى
        </p>
      </div>

      {/* عرض التعليقات */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-text-description mt-2">جاري تحميل التعليقات...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-description">لا توجد تعليقات بعد. كن أول من يعلق!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-background-secondary rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold text-white">{comment.name}</h5>
                  <p className="text-text-description text-sm">{formatDate(comment.created_at)}</p>
                </div>
              </div>
              <p className="text-text-secondary leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
