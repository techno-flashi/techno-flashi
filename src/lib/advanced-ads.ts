import { supabase } from './supabase';

// Enhanced interfaces for advanced advertising system
export interface AdvancedAd {
  id: string;
  name: string;
  description?: string;
  ad_type: 'banner' | 'video' | 'interactive' | 'text' | 'native' | 'popup' | 'interstitial';
  ad_format: 'html' | 'javascript' | 'css' | 'image' | 'video' | 'iframe' | 'custom';
  network?: string;
  
  // Content
  html_content?: string;
  css_content?: string;
  javascript_content?: string;
  image_url?: string;
  video_url?: string;
  click_url?: string;
  
  // Positioning
  position: 'header' | 'sidebar' | 'footer' | 'in-content' | 'popup' | 'floating' | 'sticky';
  container_id?: string;
  z_index: number;
  
  // Targeting
  target_pages: string[];
  target_devices: string[];
  target_countries: string[];
  
  // Scheduling
  start_date?: string;
  end_date?: string;
  schedule_days: number[];
  schedule_hours: number[];
  
  // Display Settings
  enabled: boolean;
  priority: number;
  max_impressions?: number;
  max_clicks?: number;
  frequency_cap?: number;
  
  // Responsive
  responsive_breakpoints: {
    mobile: number;
    tablet: number;
  };
  mobile_html?: string;
  tablet_html?: string;
  
  // Animation
  animation_type?: string;
  animation_duration: number;
  hover_effects: Record<string, any>;
  
  // A/B Testing
  ab_test_group?: string;
  ab_test_weight: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: string;
  tags: string[];
}

export interface AdTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  network?: string;
  html_template?: string;
  css_template?: string;
  javascript_template?: string;
  variables: Record<string, string>;
  preview_image?: string;
  demo_url?: string;
  is_public: boolean;
  usage_count: number;
  created_at: string;
}

export interface AdPerformance {
  id: string;
  ad_id?: string;
  injection_id?: string;
  event_type: 'impression' | 'click' | 'hover' | 'close' | 'conversion' | 'error';
  event_data: Record<string, any>;
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  page_url: string;
  page_title?: string;
  referrer?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  timestamp: string;
  page_load_time?: number;
  ad_load_time?: number;
  ab_test_group?: string;
  revenue?: number;
  currency: string;
}

// Advanced Ad Management Functions
export async function getAdvancedAds(filters?: {
  enabled?: boolean;
  position?: string;
  network?: string;
  ad_type?: string;
  target_page?: string;
}): Promise<AdvancedAd[]> {
  try {
    let query = supabase
      .from('ads')
      .select('*')
      .order('priority', { ascending: false });

    if (filters?.enabled !== undefined) {
      query = query.eq('enabled', filters.enabled);
    }
    if (filters?.position) {
      query = query.eq('position', filters.position);
    }
    if (filters?.network) {
      query = query.eq('network', filters.network);
    }
    if (filters?.ad_type) {
      query = query.eq('ad_type', filters.ad_type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching advanced ads:', error);
      return [];
    }

    let filteredAds = data || [];

    // Filter by target page if specified
    if (filters?.target_page) {
      filteredAds = filteredAds.filter(ad => {
        const targetPages = ad.target_pages || [];
        return targetPages.includes('*') || 
               targetPages.some((pattern: string) => {
                 if (pattern === filters.target_page) return true;
                 if (pattern.endsWith('*') && filters.target_page?.startsWith(pattern.slice(0, -1))) return true;
                 return false;
               });
      });
    }

    // Filter by schedule if current time is available
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday
    const currentHour = now.getHours();

    filteredAds = filteredAds.filter(ad => {
      // Check if ad is within date range
      if (ad.start_date && new Date(ad.start_date) > now) return false;
      if (ad.end_date && new Date(ad.end_date) < now) return false;
      
      // Check day schedule
      if (ad.schedule_days && ad.schedule_days.length > 0 && !ad.schedule_days.includes(currentDay)) return false;
      
      // Check hour schedule
      if (ad.schedule_hours && ad.schedule_hours.length > 0 && !ad.schedule_hours.includes(currentHour)) return false;
      
      return true;
    });

    return filteredAds;
  } catch (error) {
    console.error('Error in getAdvancedAds:', error);
    return [];
  }
}

export async function createAdvancedAd(ad: Omit<AdvancedAd, 'id' | 'created_at' | 'updated_at'>): Promise<AdvancedAd | null> {
  try {
    // Clean up the data before sending to database
    const cleanedAd = {
      ...ad,
      // Convert empty strings to null for timestamp fields
      start_date: ad.start_date && ad.start_date.trim() !== '' ? ad.start_date : null,
      end_date: ad.end_date && ad.end_date.trim() !== '' ? ad.end_date : null,
      // Ensure numeric fields are properly typed
      max_impressions: ad.max_impressions || null,
      max_clicks: ad.max_clicks || null,
      frequency_cap: ad.frequency_cap || null,
      // Ensure arrays are properly formatted
      target_pages: Array.isArray(ad.target_pages) ? ad.target_pages : ['*'],
      target_devices: Array.isArray(ad.target_devices) ? ad.target_devices : ['desktop', 'mobile', 'tablet'],
      target_countries: Array.isArray(ad.target_countries) ? ad.target_countries : [],
      schedule_days: Array.isArray(ad.schedule_days) ? ad.schedule_days : [0, 1, 2, 3, 4, 5, 6],
      schedule_hours: Array.isArray(ad.schedule_hours) ? ad.schedule_hours : [],
      tags: Array.isArray(ad.tags) ? ad.tags : []
    };

    const { data, error } = await supabase
      .from('ads')
      .insert([cleanedAd])
      .select()
      .single();

    if (error) {
      console.error('Error creating advanced ad:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createAdvancedAd:', error);
    return null;
  }
}

export async function updateAdvancedAd(id: string, updates: Partial<AdvancedAd>): Promise<AdvancedAd | null> {
  try {
    // Clean up the updates before sending to database
    const cleanedUpdates = {
      ...updates,
      // Convert empty strings to null for timestamp fields
      start_date: updates.start_date !== undefined ?
        (updates.start_date && updates.start_date.trim() !== '' ? updates.start_date : null) :
        undefined,
      end_date: updates.end_date !== undefined ?
        (updates.end_date && updates.end_date.trim() !== '' ? updates.end_date : null) :
        undefined,
      // Ensure numeric fields are properly typed
      max_impressions: updates.max_impressions !== undefined ? (updates.max_impressions || null) : undefined,
      max_clicks: updates.max_clicks !== undefined ? (updates.max_clicks || null) : undefined,
      frequency_cap: updates.frequency_cap !== undefined ? (updates.frequency_cap || null) : undefined,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('ads')
      .update(cleanedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating advanced ad:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateAdvancedAd:', error);
    return null;
  }
}

export async function deleteAdvancedAd(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting advanced ad:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAdvancedAd:', error);
    return false;
  }
}

// Template Management
export async function getAdTemplates(category?: string, network?: string): Promise<AdTemplate[]> {
  try {
    let query = supabase
      .from('ad_templates')
      .select('*')
      .eq('is_public', true)
      .order('usage_count', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }
    if (network) {
      query = query.eq('network', network);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching ad templates:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAdTemplates:', error);
    return [];
  }
}

export async function createAdFromTemplate(templateId: string, variables: Record<string, any>): Promise<AdvancedAd | null> {
  try {
    // Get template
    const { data: template, error: templateError } = await supabase
      .from('ad_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      console.error('Error fetching template:', templateError);
      return null;
    }

    // Replace variables in template
    let htmlContent = template.html_template || '';
    let cssContent = template.css_template || '';
    let jsContent = template.javascript_template || '';

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), String(value));
      cssContent = cssContent.replace(new RegExp(placeholder, 'g'), String(value));
      jsContent = jsContent.replace(new RegExp(placeholder, 'g'), String(value));
    });

    // Create ad from template
    const newAd: Omit<AdvancedAd, 'id' | 'created_at' | 'updated_at'> = {
      name: variables.name || template.name,
      description: `Created from template: ${template.name}`,
      ad_type: template.category as any || 'banner',
      ad_format: 'html',
      network: template.network,
      html_content: htmlContent,
      css_content: cssContent,
      javascript_content: jsContent,
      position: variables.position || 'header',
      z_index: variables.z_index || 1000,
      target_pages: variables.target_pages || ['*'],
      target_devices: ['desktop', 'mobile', 'tablet'],
      target_countries: [],
      schedule_days: [0, 1, 2, 3, 4, 5, 6],
      schedule_hours: [],
      enabled: true,
      priority: variables.priority || 5,
      responsive_breakpoints: { mobile: 768, tablet: 1024 },
      animation_duration: 300,
      hover_effects: {},
      ab_test_weight: 100,
      tags: [template.category, template.network].filter(Boolean)
    };

    const createdAd = await createAdvancedAd(newAd);

    if (createdAd) {
      // Increment template usage count
      await supabase
        .from('ad_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', templateId);
    }

    return createdAd;
  } catch (error) {
    console.error('Error in createAdFromTemplate:', error);
    return null;
  }
}

// Performance Tracking
export async function trackAdEvent(event: Omit<AdPerformance, 'id' | 'timestamp'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('ad_performance')
      .insert([{
        ...event,
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error tracking ad event:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in trackAdEvent:', error);
    return false;
  }
}

export async function getAdAnalytics(adId: string, dateRange?: { start: string; end: string }) {
  try {
    let query = supabase
      .from('ad_performance')
      .select('*')
      .eq('ad_id', adId);

    if (dateRange) {
      query = query
        .gte('timestamp', dateRange.start)
        .lte('timestamp', dateRange.end);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching ad analytics:', error);
      return null;
    }

    // Process analytics data
    const analytics = {
      impressions: data?.filter(d => d.event_type === 'impression').length || 0,
      clicks: data?.filter(d => d.event_type === 'click').length || 0,
      hovers: data?.filter(d => d.event_type === 'hover').length || 0,
      conversions: data?.filter(d => d.event_type === 'conversion').length || 0,
      errors: data?.filter(d => d.event_type === 'error').length || 0,
      ctr: 0,
      revenue: data?.reduce((sum, d) => sum + (d.revenue || 0), 0) || 0,
      unique_users: new Set(data?.map(d => d.user_id).filter(Boolean)).size,
      top_pages: {} as Record<string, number>,
      device_breakdown: {} as Record<string, number>,
      hourly_performance: {} as Record<string, number>
    };

    // Calculate CTR
    if (analytics.impressions > 0) {
      analytics.ctr = (analytics.clicks / analytics.impressions) * 100;
    }

    // Process top pages
    data?.forEach(event => {
      if (event.page_url) {
        analytics.top_pages[event.page_url] = (analytics.top_pages[event.page_url] || 0) + 1;
      }
    });

    // Process device breakdown
    data?.forEach(event => {
      if (event.device_type) {
        analytics.device_breakdown[event.device_type] = (analytics.device_breakdown[event.device_type] || 0) + 1;
      }
    });

    // Process hourly performance
    data?.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      analytics.hourly_performance[hour] = (analytics.hourly_performance[hour] || 0) + 1;
    });

    return analytics;
  } catch (error) {
    console.error('Error in getAdAnalytics:', error);
    return null;
  }
}
