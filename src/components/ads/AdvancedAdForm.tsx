'use client';

import { useState, useEffect } from 'react';
import { type AdvancedAd } from '@/lib/advanced-ads';

interface AdvancedAdFormProps {
  ad?: AdvancedAd | null;
  onSave: (adData: Omit<AdvancedAd, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}

export default function AdvancedAdForm({ ad, onSave, onCancel, isOpen }: AdvancedAdFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ad_type: 'banner' as const,
    ad_format: 'html' as const,
    network: '',
    html_content: '',
    css_content: '',
    javascript_content: '',
    image_url: '',
    video_url: '',
    click_url: '',
    position: 'header' as const,
    container_id: '',
    z_index: 1000,
    target_pages: ['*'],
    target_devices: ['desktop', 'mobile', 'tablet'],
    target_countries: [],
    start_date: '',
    end_date: '',
    schedule_days: [0, 1, 2, 3, 4, 5, 6],
    schedule_hours: [],
    enabled: true,
    priority: 5,
    max_impressions: undefined,
    max_clicks: undefined,
    frequency_cap: undefined,
    responsive_breakpoints: { mobile: 768, tablet: 1024 },
    mobile_html: '',
    tablet_html: '',
    animation_type: '',
    animation_duration: 300,
    hover_effects: {},
    ab_test_group: '',
    ab_test_weight: 100,
    tags: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'targeting' | 'advanced'>('basic');

  // Populate form when editing
  useEffect(() => {
    if (ad) {
      setFormData({
        name: ad.name || '',
        description: ad.description || '',
        ad_type: ad.ad_type as any,
        ad_format: ad.ad_format as any,
        network: ad.network || '',
        html_content: ad.html_content || '',
        css_content: ad.css_content || '',
        javascript_content: ad.javascript_content || '',
        image_url: ad.image_url || '',
        video_url: ad.video_url || '',
        click_url: ad.click_url || '',
        position: ad.position as any,
        container_id: ad.container_id || '',
        z_index: ad.z_index,
        target_pages: ad.target_pages as any,
        target_devices: ad.target_devices as any,
        target_countries: ad.target_countries as any,
        start_date: ad.start_date ? ad.start_date.split('T')[0] : '',
        end_date: ad.end_date ? ad.end_date.split('T')[0] : '',
        schedule_days: ad.schedule_days as any,
        schedule_hours: ad.schedule_hours as any,
        enabled: ad.enabled,
        priority: ad.priority,
        max_impressions: ad.max_impressions as any,
        max_clicks: ad.max_clicks as any,
        frequency_cap: ad.frequency_cap as any,
        responsive_breakpoints: ad.responsive_breakpoints as any,
        mobile_html: ad.mobile_html || '',
        tablet_html: ad.tablet_html || '',
        animation_type: ad.animation_type || '',
        animation_duration: ad.animation_duration,
        hover_effects: ad.hover_effects as any,
        ab_test_group: ad.ab_test_group || '',
        ab_test_weight: ad.ab_test_weight,
        tags: ad.tags as any
      });
    }
  }, [ad]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Clean and validate form data before submission
      const cleanedFormData = {
        ...formData,
        // Convert empty strings to null for optional fields
        start_date: formData.start_date && formData.start_date.trim() !== '' ? formData.start_date + 'T00:00:00Z' : undefined,
        end_date: formData.end_date && formData.end_date.trim() !== '' ? formData.end_date + 'T23:59:59Z' : undefined,
        // Ensure numeric fields are properly typed
        max_impressions: formData.max_impressions || undefined,
        max_clicks: formData.max_clicks || undefined,
        frequency_cap: formData.frequency_cap || undefined,
        // Ensure required fields are not empty
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
      };

      // Validate required fields
      if (!cleanedFormData.name) {
        alert('❌ Ad name is required');
        return;
      }

      if (!cleanedFormData.ad_type) {
        alert('❌ Ad type is required');
        return;
      }

      if (!cleanedFormData.position) {
        alert('❌ Ad position is required');
        return;
      }

      await onSave(cleanedFormData);
    } catch (error) {
      console.error('Error saving ad:', error);

      // More specific error handling
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message;
        if (errorMessage.includes('timestamp')) {
          alert('❌ Invalid date format. Please check your start and end dates.');
        } else if (errorMessage.includes('duplicate')) {
          alert('❌ An ad with this name already exists. Please choose a different name.');
        } else {
          alert(`❌ Error saving ad: ${errorMessage}`);
        }
      } else {
        alert('❌ Error saving ad. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {ad ? '✏️ Edit Advertisement' : '➕ Create New Advertisement'}
            </h2>
            <button
              onClick={onCancel}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b bg-gray-50">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'basic', label: '📋 Basic Info', icon: '📋' },
              { id: 'content', label: '🎨 Content', icon: '🎨' },
              { id: 'targeting', label: '🎯 Targeting', icon: '🎯' },
              { id: 'advanced', label: '⚙️ Advanced', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📝 Ad Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter ad name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌐 Network
                    </label>
                    <select
                      value={formData.network}
                      onChange={(e) => handleInputChange('network', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Network</option>
                      <option value="monetag">Monetag</option>
                      <option value="adsense">Google AdSense</option>
                      <option value="custom">Custom</option>
                      <option value="affiliate">Affiliate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎯 Ad Type *
                    </label>
                    <select
                      value={formData.ad_type}
                      onChange={(e) => handleInputChange('ad_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="banner">Banner</option>
                      <option value="video">Video</option>
                      <option value="interactive">Interactive</option>
                      <option value="text">Text</option>
                      <option value="native">Native</option>
                      <option value="popup">Popup</option>
                      <option value="interstitial">Interstitial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📍 Position *
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="header">Header</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="footer">Footer</option>
                      <option value="in-content">In-Content</option>
                      <option value="popup">Popup</option>
                      <option value="floating">Floating</option>
                      <option value="sticky">Sticky</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⭐ Priority (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enabled"
                      checked={formData.enabled}
                      onChange={(e) => handleInputChange('enabled', e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                      ✅ Enable Ad
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter ad description"
                  />
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💻 HTML Content
                  </label>
                  <textarea
                    value={formData.html_content}
                    onChange={(e) => handleInputChange('html_content', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
                    rows={8}
                    placeholder="Enter HTML content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎨 CSS Content
                  </label>
                  <textarea
                    value={formData.css_content}
                    onChange={(e) => handleInputChange('css_content', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Enter CSS styles..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⚡ JavaScript Content
                  </label>
                  <textarea
                    value={formData.javascript_content}
                    onChange={(e) => handleInputChange('javascript_content', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Enter JavaScript code..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🖼️ Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔗 Click URL
                    </label>
                    <input
                      type="url"
                      value={formData.click_url}
                      onChange={(e) => handleInputChange('click_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/landing-page"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Targeting Tab */}
            {activeTab === 'targeting' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📄 Target Pages
                  </label>
                  <input
                    type="text"
                    value={formData.target_pages.join(', ')}
                    onChange={(e) => handleInputChange('target_pages', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="*, /articles, /ai-tools"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use * for all pages, or specify paths separated by commas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📱 Target Devices
                  </label>
                  <div className="flex space-x-4">
                    {['desktop', 'mobile', 'tablet'].map(device => (
                      <label key={device} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.target_devices.includes(device)}
                          onChange={(e) => {
                            const devices = e.target.checked
                              ? [...formData.target_devices, device]
                              : formData.target_devices.filter(d => d !== device);
                            handleInputChange('target_devices', devices);
                          }}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 capitalize">{device}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 End Date
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleInputChange('end_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📊 Max Impressions
                    </label>
                    <input
                      type="number"
                      value={formData.max_impressions || ''}
                      onChange={(e) => handleInputChange('max_impressions', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Unlimited"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🖱️ Max Clicks
                    </label>
                    <input
                      type="number"
                      value={formData.max_clicks || ''}
                      onChange={(e) => handleInputChange('max_clicks', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Unlimited"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔄 Frequency Cap
                    </label>
                    <input
                      type="number"
                      value={formData.frequency_cap || ''}
                      onChange={(e) => handleInputChange('frequency_cap', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Per day"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏷️ Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="monetag, banner, test"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              ❌ Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Saving...' : (ad ? '💾 Update Ad' : '➕ Create Ad')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
