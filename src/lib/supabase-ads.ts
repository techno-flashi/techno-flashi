// Supabase Ads Management System
// إدارة الإعلانات باستخدام قاعدة بيانات Supabase

import { supabase } from './supabase';

export interface SupabaseAd {
  id: string;
  name: string;
  type: 'monetag' | 'adsense' | 'custom';
  position: 'header' | 'sidebar' | 'footer' | 'in-content' | 'popup';
  zone_id?: string;
  script_code: string;
  html_code?: string;
  enabled: boolean;
  pages: string[]; // JSON array of page patterns
  priority: number; // Higher number = higher priority
  delay_seconds?: number;
  created_at: string;
  updated_at: string;
  click_count: number;
  view_count: number;
  revenue?: number;
}

export interface AdPerformance {
  id: string;
  ad_id: string;
  event_type: 'load' | 'view' | 'click';
  page_url: string;
  user_agent: string;
  timestamp: string;
  ip_address?: string;
}

export interface CodeInjection {
  id: string;
  name: string;
  position: 'head_start' | 'head_end' | 'body_start' | 'footer';
  code: string;
  enabled: boolean;
  pages: string[];
  priority: number;
  created_at: string;
  updated_at: string;
}

// Create ads table SQL (run this in Supabase SQL editor)
export const CREATE_ADS_TABLE_SQL = `
-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'monetag',
  position VARCHAR(50) NOT NULL,
  zone_id VARCHAR(100),
  script_code TEXT NOT NULL,
  html_code TEXT,
  enabled BOOLEAN DEFAULT true,
  pages JSONB DEFAULT '[]'::jsonb,
  priority INTEGER DEFAULT 1,
  delay_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  click_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0
);

-- Create ad_performance table
CREATE TABLE IF NOT EXISTS ad_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL,
  page_url VARCHAR(500) NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ads_enabled ON ads(enabled);
CREATE INDEX IF NOT EXISTS idx_ads_position ON ads(position);
CREATE INDEX IF NOT EXISTS idx_ads_priority ON ads(priority DESC);
CREATE INDEX IF NOT EXISTS idx_ad_performance_ad_id ON ad_performance(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_performance_timestamp ON ad_performance(timestamp);

-- Enable RLS
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_performance ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, customize as needed)
CREATE POLICY "Allow all operations on ads" ON ads FOR ALL USING (true);
CREATE POLICY "Allow all operations on ad_performance" ON ad_performance FOR ALL USING (true);

-- Insert default Monetag ads
INSERT INTO ads (name, type, position, zone_id, script_code, enabled, pages, priority) VALUES
('Monetag Header Banner', 'monetag', 'header', '9593378', 
 '(function(d,z,s){s.src=''https://''+d+''/400/''+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})("vemtoutcheeg.com",9593378,document.createElement("script"));',
 true, '["*"]', 10),
('Monetag Sidebar', 'monetag', 'sidebar', '9593331',
 '(function(d,z,s){s.src=''https://''+d+''/400/''+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})("vemtoutcheeg.com",9593331,document.createElement("script"));',
 true, '["/articles", "/ai-tools"]', 8),
('Monetag In-Content', 'monetag', 'in-content', '9593378',
 '(function(d,z,s){s.src=''https://''+d+''/400/''+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})("vemtoutcheeg.com",9593378,document.createElement("script"));',
 true, '["/articles", "/ai-tools", "/"]', 5);
`;

// Fetch ads from Supabase
export async function getAds(position?: string, enabled?: boolean): Promise<SupabaseAd[]> {
  try {
    let query = supabase
      .from('ads')
      .select('*')
      .order('priority', { ascending: false });

    if (position) {
      query = query.eq('position', position);
    }

    if (enabled !== undefined) {
      query = query.eq('enabled', enabled);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching ads:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAds:', error);
    return [];
  }
}

// Get ads for specific page and position
export async function getAdsForPage(currentPage: string, position: string): Promise<SupabaseAd[]> {
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('position', position)
      .eq('enabled', true)
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching ads for page:', error);
      return [];
    }

    // Filter ads based on page patterns
    const filteredAds = (data || []).filter(ad => {
      const pages = ad.pages || [];
      
      // If pages array contains "*", show on all pages
      if (pages.includes('*')) return true;
      
      // Check if current page matches any pattern
      return pages.some((pattern: string) => {
        if (pattern === currentPage) return true;
        if (pattern.endsWith('*') && currentPage.startsWith(pattern.slice(0, -1))) return true;
        return false;
      });
    });

    return filteredAds;
  } catch (error) {
    console.error('Error in getAdsForPage:', error);
    return [];
  }
}

// Create new ad
export async function createAd(ad: Omit<SupabaseAd, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'view_count'>): Promise<SupabaseAd | null> {
  try {
    const { data, error } = await supabase
      .from('ads')
      .insert([ad])
      .select()
      .single();

    if (error) {
      console.error('Error creating ad:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createAd:', error);
    return null;
  }
}

// Update ad
export async function updateAd(id: string, updates: Partial<SupabaseAd>): Promise<SupabaseAd | null> {
  try {
    const { data, error } = await supabase
      .from('ads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating ad:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateAd:', error);
    return null;
  }
}

// Delete ad
export async function deleteAd(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting ad:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAd:', error);
    return false;
  }
}

// Track ad performance
export async function trackAdPerformance(
  adId: string,
  eventType: 'load' | 'view' | 'click',
  pageUrl: string,
  userAgent?: string
): Promise<void> {
  try {
    console.log(`Tracking ad performance: ${eventType} for ad ${adId} on ${pageUrl}`);

    // Insert performance record
    const { error: insertError } = await supabase
      .from('ad_performance')
      .insert([{
        ad_id: adId,
        event_type: eventType,
        page_url: pageUrl,
        user_agent: userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown')
      }]);

    if (insertError) {
      console.error('Error tracking ad performance:', insertError);
      return;
    }

    // Update ad counters
    if (eventType === 'click') {
      const { error: clickError } = await supabase.rpc('increment_ad_clicks', { ad_id: adId });
      if (clickError) console.error('Error incrementing clicks:', clickError);
    } else if (eventType === 'view') {
      const { error: viewError } = await supabase.rpc('increment_ad_views', { ad_id: adId });
      if (viewError) console.error('Error incrementing views:', viewError);
    }

    console.log(`Successfully tracked ${eventType} for ad ${adId}`);

  } catch (error) {
    console.error('Error in trackAdPerformance:', error);
  }
}

// Get ad performance stats
export async function getAdPerformance(adId?: string, days: number = 7): Promise<AdPerformance[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase
      .from('ad_performance')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });

    if (adId) {
      query = query.eq('ad_id', adId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching ad performance:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAdPerformance:', error);
    return [];
  }
}

// SQL functions to create (run in Supabase SQL editor)
export const CREATE_SQL_FUNCTIONS = `
-- Function to increment ad clicks
CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE ads SET click_count = click_count + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment ad views
CREATE OR REPLACE FUNCTION increment_ad_views(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE ads SET view_count = view_count + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get ad stats
CREATE OR REPLACE FUNCTION get_ad_stats(days_back INTEGER DEFAULT 7)
RETURNS TABLE(
  ad_id UUID,
  ad_name VARCHAR,
  total_views BIGINT,
  total_clicks BIGINT,
  ctr DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.view_count,
    a.click_count,
    CASE 
      WHEN a.view_count > 0 THEN (a.click_count::DECIMAL / a.view_count::DECIMAL) * 100
      ELSE 0
    END as ctr
  FROM ads a
  WHERE a.enabled = true
  ORDER BY a.priority DESC;
END;
$$ LANGUAGE plpgsql;
`;

// Initialize ads system
export async function initializeAdsSystem(): Promise<boolean> {
  try {
    // Check if ads table exists
    const { data, error } = await supabase
      .from('ads')
      .select('id')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      // Table doesn't exist
      console.log('Ads table not found. Please run the SQL setup in Supabase.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error initializing ads system:', error);
    return false;
  }
}

// ==================== CODE INJECTION FUNCTIONS ====================

// Get code injections by position and page
export async function getCodeInjections(
  position?: string,
  currentPage?: string
): Promise<CodeInjection[]> {
  try {
    let query = supabase
      .from('code_injections')
      .select('*')
      .eq('enabled', true)
      .order('priority', { ascending: false });

    if (position) {
      query = query.eq('position', position);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching code injections:', error);
      return [];
    }

    if (!currentPage) {
      return data || [];
    }

    // Filter by page patterns
    const filteredInjections = (data || []).filter(injection => {
      const pages = injection.pages || [];

      // If pages array contains "*", show on all pages
      if (pages.includes('*')) return true;

      // Check if current page matches any pattern
      return pages.some((pattern: string) => {
        if (pattern === currentPage) return true;
        if (pattern.endsWith('*') && currentPage.startsWith(pattern.slice(0, -1))) return true;
        return false;
      });
    });

    return filteredInjections;
  } catch (error) {
    console.error('Error in getCodeInjections:', error);
    return [];
  }
}

// Create new code injection
export async function createCodeInjection(
  injection: Omit<CodeInjection, 'id' | 'created_at' | 'updated_at'>
): Promise<CodeInjection | null> {
  try {
    const { data, error } = await supabase
      .from('code_injections')
      .insert([injection])
      .select()
      .single();

    if (error) {
      console.error('Error creating code injection:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createCodeInjection:', error);
    return null;
  }
}

// Update code injection
export async function updateCodeInjection(
  id: string,
  updates: Partial<CodeInjection>
): Promise<CodeInjection | null> {
  try {
    const { data, error } = await supabase
      .from('code_injections')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating code injection:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateCodeInjection:', error);
    return null;
  }
}

// Delete code injection
export async function deleteCodeInjection(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('code_injections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting code injection:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCodeInjection:', error);
    return false;
  }
}

// Get all code injections for admin
export async function getAllCodeInjections(): Promise<CodeInjection[]> {
  try {
    const { data, error } = await supabase
      .from('code_injections')
      .select('*')
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching all code injections:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllCodeInjections:', error);
    return [];
  }
}
