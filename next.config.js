/** @type {import('next').NextConfig} */
const nextConfig = {
  // تحسينات الأمان والأداء
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true, // Enable React strict mode for better performance and fewer bugs

  // دعم الأحرف الدولية والعربية
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react'],
    optimizeCss: true,
    scrollRestoration: true,
  },

  // إعدادات SSG و ISR
  output: 'standalone',
  generateEtags: true,

  // قمع تحذيرات hydration في development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // إعدادات compiler
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },

  // تحسين معالجة الـ URLs العربية
  trailingSlash: false,

  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zgktrwpladrkhhemhnni.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'ugrfqcfhoxgpxcwnnbxu.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // إعدادات إعادة التوجيه
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },

  // إعدادات الأمان
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Language',
            value: 'ar'
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://www.googletagmanager.com
                https://www.google-analytics.com
                https://cdn.jsdelivr.net
                https://unpkg.com
                https://cmp.gatekeeperconsent.com
                https://the.gatekeeperconsent.com
                https://privacy.gatekeeperconsent.com
                https://gatekeeperconsent.com
                https://*.gatekeeperconsent.com
                https://www.ezojs.com
                https://ezojs.com
                https://go.ezojs.com
                https://*.ezojs.com
                https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://tpc.googlesyndication.com
                https://securepubads.g.doubleclick.net;
              style-src 'self' 'unsafe-inline'
                https://fonts.googleapis.com
                https://cdn.jsdelivr.net;
              font-src 'self'
                https://fonts.gstatic.com
                https://cdn.jsdelivr.net;
              img-src 'self' data: blob:
                https://images.unsplash.com
                https://i.imgur.com
                https://placehold.co
                https://via.placeholder.com
                https://upload.wikimedia.org
                https://i.pinimg.com
                https://zgktrwpladrkhhemhnni.supabase.co
                https://ugrfqcfhoxgpxcwnnbxu.supabase.co
                https://www.google-analytics.com
                https://www.googletagmanager.com
                https://cdn.jsdelivr.net;
              connect-src 'self' https:
                https://cmp.gatekeeperconsent.com
                https://the.gatekeeperconsent.com
                https://privacy.gatekeeperconsent.com
                https://gatekeeperconsent.com
                https://*.gatekeeperconsent.com
                https://www.ezojs.com
                https://ezojs.com
                https://*.ezojs.com
                https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://tpc.googlesyndication.com
                https://securepubads.g.doubleclick.net;
              frame-src 'self'
                https://www.youtube.com
                https://www.google.com
                https://cmp.gatekeeperconsent.com
                https://the.gatekeeperconsent.com
                https://gatekeeperconsent.com
                https://*.gatekeeperconsent.com
                https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://tpc.googlesyndication.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ]
      },
      // Optimized cache settings for faster updates
      {
        source: '/articles/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=600'
          }
        ]
      },
      {
        source: '/ai-tools/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=600'
          }
        ]
      },
      // Homepage cache settings - optimized for performance
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=600'
          }
        ]
      },
      // Third-party scripts cache optimization
      {
        source: '/(.*\\.(js|css|woff2|woff|ttf|eot))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // إعدادات ads.txt
      {
        source: '/ads.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          }
        ]
      },
      // تحسين cache للموارد الثابتة
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400'
          }
        ]
      }
    ];
  },

  // تحسينات webpack
  webpack: (config, { dev, isServer }) => {
    // تحسينات الإنتاج المتقدمة
    if (!dev && !isServer) {
      // Advanced bundle optimization
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 200000, // Reduced for better loading
        cacheGroups: {
          // React and React DOM in separate chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
          // Supabase in separate chunk
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 25,
            enforce: true,
          },
          // UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](react-icons|lucide-react|framer-motion)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 20,
            enforce: true,
          },
          // Other vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            minChunks: 1,
          },
          // Common application code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
          },
        },
      };

      // Advanced tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.providedExports = true;
      config.optimization.innerGraph = true;

      // Module concatenation for better tree shaking
      config.optimization.concatenateModules = true;

      // Minimize bundle size with aliases
      config.resolve.alias = {
        ...config.resolve.alias,
        'lodash': 'lodash-es', // Use ES modules version
        'moment': 'dayjs', // Replace moment with smaller dayjs
      };

      // Remove unused polyfills for modern browsers
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    return config;
  },
}

module.exports = nextConfig
