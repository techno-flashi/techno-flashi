'use client';

import { useState, useEffect } from 'react';
import {
  getAdvancedAds,
  createAdvancedAd,
  updateAdvancedAd,
  deleteAdvancedAd,
  getAdTemplates,
  createAdFromTemplate,
  getAdAnalytics,
  type AdvancedAd,
  type AdTemplate
} from '@/lib/advanced-ads';
import AdvancedAdForm from '@/components/ads/AdvancedAdForm';

export default function AdvancedAdsAdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ads' | 'templates' | 'analytics' | 'settings'>('dashboard');
  const [ads, setAds] = useState<AdvancedAd[]>([]);
  const [templates, setTemplates] = useState<AdTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<AdvancedAd | null>(null);
  const [showAdForm, setShowAdForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNetwork, setFilterNetwork] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [adsData, templatesData] = await Promise.all([
          getAdvancedAds(),
          getAdTemplates()
        ]);
        setAds(adsData);
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter ads based on search and filters
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ad.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNetwork = filterNetwork === 'all' || ad.network === filterNetwork;
    const matchesPosition = filterPosition === 'all' || ad.position === filterPosition;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'enabled' && ad.enabled) ||
                         (filterStatus === 'disabled' && !ad.enabled);
    
    return matchesSearch && matchesNetwork && matchesPosition && matchesStatus;
  });

  const handleCreateAd = async (adData: Omit<AdvancedAd, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newAd = await createAdvancedAd(adData);
      if (newAd) {
        setAds(prev => [...prev, newAd]);
        setShowAdForm(false);
        alert('✅ Ad created successfully!');
      } else {
        alert('❌ Failed to create ad. Please try again.');
      }
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('❌ Error creating ad. Please check the console for details.');
    }
  };

  const handleUpdateAd = async (adData: Omit<AdvancedAd, 'id' | 'created_at' | 'updated_at'>) => {
    if (!selectedAd) return;

    try {
      const updatedAd = await updateAdvancedAd(selectedAd.id, adData);
      if (updatedAd) {
        setAds(prev => prev.map(ad => ad.id === selectedAd.id ? updatedAd : ad));
        setSelectedAd(null);
        alert('✅ Ad updated successfully!');
      } else {
        alert('❌ Failed to update ad. Please try again.');
      }
    } catch (error) {
      console.error('Error updating ad:', error);
      alert('❌ Error updating ad. Please check the console for details.');
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      const success = await deleteAdvancedAd(id);
      if (success) {
        setAds(prev => prev.filter(ad => ad.id !== id));
      }
    }
  };

  const handleToggleAd = async (ad: AdvancedAd) => {
    try {
      const updatedAd = await updateAdvancedAd(ad.id, { enabled: !ad.enabled });
      if (updatedAd) {
        setAds(prev => prev.map(a => a.id === ad.id ? updatedAd : a));
      }
    } catch (error) {
      console.error('Error toggling ad:', error);
      alert('❌ Error toggling ad status.');
    }
  };

  const handleCreateFromTemplate = async (templateId: string, variables: Record<string, any>) => {
    const newAd = await createAdFromTemplate(templateId, variables);
    if (newAd) {
      setAds(prev => [...prev, newAd]);
    }
  };

  // Get statistics
  const stats = {
    totalAds: ads.length,
    activeAds: ads.filter(ad => ad.enabled).length,
    inactiveAds: ads.filter(ad => !ad.enabled).length,
    networks: Array.from(new Set(ads.map(ad => ad.network).filter(Boolean))).length,
    positions: Array.from(new Set(ads.map(ad => ad.position))).length,
    templates: templates.length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Advanced Advertising Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎯 Advanced Advertising Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Comprehensive advertising management system with multi-network support
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAdForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                ➕ Create New Ad
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'ads', label: `🎯 Ads (${stats.totalAds})`, icon: '🎯' },
              { id: 'templates', label: `📋 Templates (${stats.templates})`, icon: '📋' },
              { id: 'analytics', label: '📈 Analytics', icon: '📈' },
              { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">🎯</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Ads</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalAds}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Ads</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.activeAds}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold">🌐</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Networks</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.networks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">📋</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Templates</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.templates}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">🚀 Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowAdForm(true)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">➕</div>
                    <div className="font-medium text-gray-900">Create New Ad</div>
                    <div className="text-sm text-gray-500">Start from scratch</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('templates')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-medium text-gray-900">Use Template</div>
                    <div className="text-sm text-gray-500">Quick setup</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="font-medium text-gray-900">View Analytics</div>
                    <div className="text-sm text-gray-500">Performance data</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Ads */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">📋 Recent Ads</h3>
              <div className="space-y-3">
                {ads.slice(0, 5).map((ad) => (
                  <div key={ad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${ad.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{ad.name}</div>
                        <div className="text-sm text-gray-500">{ad.network} • {ad.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleAd(ad)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          ad.enabled 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {ad.enabled ? '⏸️ Pause' : '▶️ Enable'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAd(ad);
                          setShowAdForm(true);
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium hover:bg-blue-200"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ads Tab */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search ads..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                  <select
                    value={filterNetwork}
                    onChange={(e) => setFilterNetwork(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Networks</option>
                    <option value="monetag">Monetag</option>
                    <option value="adsense">Google AdSense</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <select
                    value={filterPosition}
                    onChange={(e) => setFilterPosition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Positions</option>
                    <option value="header">Header</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                    <option value="in-content">In-Content</option>
                    <option value="floating">Floating</option>
                    <option value="popup">Popup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ads List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Ads ({filteredAds.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredAds.map((ad) => (
                  <div key={ad.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${ad.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <h4 className="text-lg font-medium text-gray-900">{ad.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            ad.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {ad.enabled ? '✅ Active' : '❌ Inactive'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{ad.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>🌐 {ad.network || 'Custom'}</span>
                          <span>📍 {ad.position}</span>
                          <span>🎯 {ad.ad_type}</span>
                          <span>⭐ Priority: {ad.priority}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleAd(ad)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            ad.enabled 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {ad.enabled ? '⏸️ Pause' : '▶️ Enable'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAd(ad);
                            setShowAdForm(true);
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">📋 Ad Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>🌐 {template.network || 'Custom'}</span>
                      <span>📊 Used {template.usage_count} times</span>
                    </div>
                    <button
                      onClick={() => {
                        // This would open a template configuration modal
                        console.log('Configure template:', template.id);
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-medium"
                    >
                      🚀 Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Analytics Dashboard</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h4 className="text-xl font-medium text-gray-900 mb-2">Analytics Coming Soon</h4>
                <p className="text-gray-500">
                  Comprehensive analytics and performance tracking will be available here.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">⚙️ System Settings</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚙️</div>
                <h4 className="text-xl font-medium text-gray-900 mb-2">Settings Panel</h4>
                <p className="text-gray-500">
                  Global advertising settings and configuration options will be available here.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Ad Form Modal */}
      <AdvancedAdForm
        ad={selectedAd}
        onSave={selectedAd ? handleUpdateAd : handleCreateAd}
        onCancel={() => {
          setShowAdForm(false);
          setSelectedAd(null);
        }}
        isOpen={showAdForm || selectedAd !== null}
      />
    </div>
  );
}
