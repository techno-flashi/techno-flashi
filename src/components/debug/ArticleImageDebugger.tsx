'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ArticleImageDebuggerProps {
  articleId: string;
  articleSlug: string;
}

interface ArticleImage {
  id: string;
  article_id: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  display_order: number;
  created_at: string;
}

export default function ArticleImageDebugger({ articleId, articleSlug }: ArticleImageDebuggerProps) {
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log(`🔍 Debugging images for article: ${articleSlug} (ID: ${articleId})`);
        
        const { data, error } = await supabase
          .from('article_images')
          .select('*')
          .eq('article_id', articleId)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('❌ Error fetching article images:', error);
          setError(error.message);
          return;
        }

        console.log(`✅ Found ${data?.length || 0} images for article ${articleSlug}`);
        console.log('📸 Images data:', data);
        
        setImages(data || []);
      } catch (err: any) {
        console.error('💥 Exception fetching images:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [articleId, articleSlug]);

  // عرض المعلومات فقط في development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 my-4">
      <h3 className="text-yellow-400 font-bold mb-2">🐛 Article Images Debug Info</h3>
      <div className="text-yellow-300 text-sm space-y-2">
        <p><strong>Article ID:</strong> {articleId}</p>
        <p><strong>Article Slug:</strong> {articleSlug}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Images Count:</strong> {images.length}</p>
        
        {images.length > 0 && (
          <div className="mt-4">
            <h4 className="text-yellow-400 font-semibold mb-2">📸 Images Found:</h4>
            <div className="space-y-2">
              {images.map((image, index) => (
                <div key={image.id} className="bg-yellow-900/10 p-2 rounded border border-yellow-500/20">
                  <p><strong>#{index + 1}:</strong> {image.image_url}</p>
                  <p><strong>Caption:</strong> {image.caption || 'No caption'}</p>
                  <p><strong>Alt Text:</strong> {image.alt_text || 'No alt text'}</p>
                  <p><strong>Display Order:</strong> {image.display_order}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!loading && images.length === 0 && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded">
            <p className="text-red-400">⚠️ No images found for this article.</p>
            <p className="text-red-300 text-xs mt-1">
              Make sure images are added to the article_images table with the correct article_id.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
