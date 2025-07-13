'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Ad } from '@/types';

interface SponsorsSectionProps {
  title?: string;
  className?: string;
}

export default function SponsorsSection({
  title = "رعاتنا 💼",
  className = ""
}: SponsorsSectionProps) {
  const [sponsors, setSponsors] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const response = await fetch('/api/ads?type=sponsor&placement=sponsors-section&is_active=true');
      if (response.ok) {
        const data = await response.json();
        setSponsors(data.ads || []);
        console.log('Sponsors fetched:', data.ads?.length || 0);
      } else {
        console.error('Failed to fetch sponsors:', response.status);
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSponsorClick = async (sponsor: Ad) => {
    console.log('Sponsor clicked:', sponsor.sponsor_name);

    // تسجيل النقرة
    try {
      await fetch(`/api/ads/${sponsor.id}/click`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to record click:', error);
    }

    // فتح الرابط
    if (sponsor.link_url) {
      if (sponsor.target_blank) {
        window.open(sponsor.link_url, '_blank');
      } else {
        window.location.href = sponsor.link_url;
      }
    }
  };

  if (loading) {
    return (
      <section className={`py-16 bg-gradient-to-r from-gray-50 to-gray-100 ${className}`}>
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-8"></div>
            <div className="flex justify-center flex-wrap gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="h-16 w-32 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 bg-gradient-to-r from-gray-50 to-gray-100 text-center ${className}`}>
      <h2 className="text-4xl font-bold text-gray-800 mb-12">
        {title}
      </h2>

      <div className="flex justify-center flex-wrap gap-10">
        {sponsors
          .sort((a, b) => a.priority - b.priority)
          .map((sponsor, index) => (
          <a
            key={sponsor.id}
            href={sponsor.link_url || '#'}
            target={sponsor.target_blank ? '_blank' : '_self'}
            rel={sponsor.target_blank ? 'noopener noreferrer' : undefined}
            onClick={(e) => {
              e.preventDefault();
              handleSponsorClick(sponsor);
            }}
            className="sponsor bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary/20 focus:outline-none focus:ring-4 focus:ring-primary/20 block"
            title={sponsor.description || sponsor.title}
          >
            <div className="relative overflow-hidden">
              {sponsor.image_url ? (
                <Image
                  src={sponsor.image_url}
                  alt={sponsor.sponsor_name || sponsor.title}
                  width={sponsor.width || 120}
                  height={sponsor.height || 60}
                  className="object-contain transition-transform duration-300 hover:scale-110 max-h-16"
                />
              ) : (
                <div className="w-32 h-16 bg-gradient-to-r from-primary/20 to-primary/30 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {sponsor.sponsor_name || sponsor.title}
                  </span>
                </div>
              )}
            </div>

            {sponsor.sponsor_name && (
              <p className="mt-3 text-sm text-gray-600 font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
                {sponsor.sponsor_name}
              </p>
            )}
          </a>
        ))}
      </div>

      {sponsors.length > 0 && (
        <p className="mt-8 text-gray-500 text-sm">
          شكراً لرعاتنا الكرام على دعمهم المستمر 🙏
        </p>
      )}
    </section>
  );
}