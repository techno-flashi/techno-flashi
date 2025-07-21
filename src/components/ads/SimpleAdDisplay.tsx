'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Ad {
  id: string;
  name: string;
  title: string;
  html_content: string;
  click_url: string;
  position: string;
  enabled: boolean;
}

interface SimpleAdDisplayProps {
  position: 'header' | 'footer' | 'in-content';
  className?: string;
}

export default function SimpleAdDisplay({ position, className = '' }: SimpleAdDisplayProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        console.log(`🔍 SimpleAdDisplay: Fetching ads for position: ${position}`);
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('position', position)
          .eq('enabled', true)
          .order('priority', { ascending: false });

        if (error) {
          console.error('❌ SimpleAdDisplay: Error fetching ads:', error);
          setAds([]);
        } else {
          console.log(`✅ SimpleAdDisplay: Found ${data?.length || 0} ads for position ${position}:`, data);
          setAds(data || []);
        }
      } catch (err) {
        console.error('❌ SimpleAdDisplay: Error in fetchAds:', err);
        setAds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [position]);

  // Rotate ads every 10 seconds
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [ads.length]);

  const handleAdClick = (ad: Ad) => {
    if (ad.click_url) {
      window.open(ad.click_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} style={{
        height: position === 'header' ? '60px' : position === 'footer' ? '60px' : '120px'
      }} />
    );
  }

  if (ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className={`simple-ad-display ${className}`}>
      <div 
        className="cursor-pointer transition-all duration-300 hover:opacity-90"
        onClick={() => handleAdClick(currentAd)}
        dangerouslySetInnerHTML={{ __html: currentAd.html_content }}
      />
      
      {ads.length > 1 && (
        <div className="flex justify-center mt-2 space-x-1">
          {ads.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentAdIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentAdIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
