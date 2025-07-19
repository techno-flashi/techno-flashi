'use client';

import { HeaderAnimatedAd, SidebarAnimatedAd, FooterAnimatedAd, InContentAnimatedAd } from '@/components/ads/AnimatedAdRenderer';

export default function TestAnimatedAdsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          🎬 Animated Advertisements Test Page
        </h1>
        
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">📍 Header Position</h2>
          <HeaderAnimatedAd 
            currentPage="/test-animated-ads" 
            className="border-2 border-dashed border-blue-300 rounded-lg p-4"
            showDebug={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">📄 Content Area</h2>
              <p className="text-gray-600 mb-6">
                This is a test page to verify that all animated advertisements are working correctly.
                The ads should display with their respective animations: scrolling, fade, typewriter, 
                bouncing, gradient, and sliding effects.
              </p>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">📍 In-Content Position</h3>
              <InContentAnimatedAd 
                currentPage="/test-animated-ads" 
                className="border-2 border-dashed border-green-300 rounded-lg p-4 my-6"
                showDebug={true}
              />
              
              <p className="text-gray-600 mb-6">
                The animated ads should respect device targeting (desktop, mobile, tablet) and 
                page targeting. All ads are configured with target_pages: ["*"] so they should 
                appear on all pages.
              </p>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">🎭 Animation Types</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li><strong>Horizontal Scrolling:</strong> Text moves from right to left (Arabic) or left to right (English)</li>
                <li><strong>Fade In/Out:</strong> Text fades in and out with opacity transitions</li>
                <li><strong>Typewriter Effect:</strong> Text appears character by character</li>
                <li><strong>Bouncing/Pulsing:</strong> Text bounces and scales with transform animations</li>
                <li><strong>Color-Changing Gradient:</strong> Background and text colors shift continuously</li>
                <li><strong>Sliding Text:</strong> Text slides in from different directions</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">🌐 Language Support</h3>
              <p className="text-gray-600 mb-6">
                Each animation type has both Arabic and English versions:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li><strong>Arabic:</strong> "إعلان هنا مقابل دولار واحد يومياً" (Cairo font)</li>
                <li><strong>English:</strong> "Advertisement Here for $1 Daily" (Inter font)</li>
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">📍 Sidebar Position</h2>
              <SidebarAnimatedAd 
                currentPage="/test-animated-ads" 
                className="border-2 border-dashed border-purple-300 rounded-lg p-4"
                showDebug={true}
              />
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">🔧 Technical Details</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✅ CSS animations only (no external JS)</li>
                <li>✅ Responsive design</li>
                <li>✅ Device targeting</li>
                <li>✅ Page targeting</li>
                <li>✅ Priority-based display</li>
                <li>✅ Animation duration control</li>
                <li>✅ Google Fonts integration</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 mt-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">📍 Footer Position</h2>
          <FooterAnimatedAd 
            currentPage="/test-animated-ads" 
            className="border-2 border-dashed border-red-300 rounded-lg p-4"
            showDebug={true}
          />
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900">📊 Expected Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-800">🎯 Positions</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Header: 2 ads (Arabic + English)</li>
                <li>• Sidebar: 3 ads (Arabic + English)</li>
                <li>• In-Content: 3 ads (Arabic + English)</li>
                <li>• Footer: 4 ads (Arabic + English)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-800">🎬 Animations</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Scrolling: 15s duration</li>
                <li>• Fade: 4s duration</li>
                <li>• Typewriter: 6s duration</li>
                <li>• Bouncing: 2s duration</li>
                <li>• Gradient: 8s duration</li>
                <li>• Sliding: 5s duration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
