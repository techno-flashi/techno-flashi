// Service Worker for TechnoFlash
// تحسين الأداء والتخزين المؤقت

// Updated cache version to force cache invalidation
const CACHE_VERSION = Date.now(); // Use timestamp for unique versioning
const CACHE_NAME = `technoflash-v${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `technoflash-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `technoflash-dynamic-v${CACHE_VERSION}`;

// الملفات المهمة للتخزين المؤقت
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  // يمكن إضافة المزيد من الملفات الثابتة هنا
];

// الملفات التي لا نريد تخزينها مؤقتاً
const EXCLUDE_URLS = [
  '/api/',
  '/admin/',
  '/_next/webpack-hmr',
  '/_next/static/chunks/webpack',
];

// Cache duration settings (in milliseconds)
const CACHE_DURATION = {
  STATIC: 1 * 60 * 1000,    // 1 minute for static assets
  DYNAMIC: 30 * 1000,       // 30 seconds for dynamic content
  PAGES: 10 * 1000          // 10 seconds for pages
};

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // حذف الكاشات القديمة
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// التعامل مع طلبات الشبكة
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // تجاهل الطلبات المستثناة
  if (EXCLUDE_URLS.some(excludeUrl => url.pathname.startsWith(excludeUrl))) {
    return;
  }
  
  // تجاهل طلبات غير HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Check if cached response exists and is still fresh
        if (cachedResponse) {
          const cachedDate = new Date(cachedResponse.headers.get('sw-cached-date') || 0);
          const now = new Date();
          const cacheAge = now.getTime() - cachedDate.getTime();

          // Determine cache duration based on content type
          let maxAge = CACHE_DURATION.DYNAMIC;
          if (isStaticAsset(request.url)) {
            maxAge = CACHE_DURATION.STATIC;
          } else if (request.destination === 'document') {
            maxAge = CACHE_DURATION.PAGES;
          }

          // Return cached response if still fresh
          if (cacheAge < maxAge) {
            console.log('SW: Serving from cache (fresh):', request.url);
            return cachedResponse;
          } else {
            console.log('SW: Cache expired, fetching fresh:', request.url);
            // Cache expired, continue to fetch fresh content
          }
        }
        
        // إذا لم يوجد، اجلبه من الشبكة
        return fetch(request)
          .then((response) => {
            // تحقق من صحة الاستجابة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // نسخ الاستجابة للتخزين المؤقت مع إضافة timestamp
            const responseToCache = response.clone();

            // Add timestamp header for cache expiration
            const responseWithTimestamp = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: {
                ...Object.fromEntries(responseToCache.headers.entries()),
                'sw-cached-date': new Date().toISOString()
              }
            });

            // تحديد نوع الكاش بناءً على نوع الطلب
            const cacheToUse = isStaticAsset(request.url) ? STATIC_CACHE_NAME : DYNAMIC_CACHE_NAME;

            caches.open(cacheToUse)
              .then((cache) => {
                cache.put(request, responseWithTimestamp);
                console.log('SW: Cached with timestamp:', request.url);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed', error);
            
            // إذا فشل الطلب، حاول إرجاع صفحة offline
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            // للصور، أرجع صورة placeholder
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">صورة غير متاحة</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            
            throw error;
          });
      })
  );
});

// التعامل مع رسائل من الصفحة الرئيسية
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// دالة مساعدة لتحديد الملفات الثابتة
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => url.includes(ext)) || url.includes('/_next/static/');
}

// تنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // احتفظ بالكاشات الحديثة فقط
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // تنظيف الكاش الديناميكي إذا أصبح كبيراً جداً
      return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        return cache.keys().then((keys) => {
          if (keys.length > 100) { // حد أقصى 100 عنصر
            return cache.delete(keys[0]); // احذف الأقدم
          }
        });
      });
    })
  );
});

// إضافة دعم للإشعارات (اختياري)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'عرض المزيد',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'إغلاق',
          icon: '/icon-192x192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// التعامل مع النقر على الإشعارات
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Loaded successfully');
