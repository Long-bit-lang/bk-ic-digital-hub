// BK-IC Official Service Worker — Safe Static Shell & Media Caching + Offline Fallback
// Strictly bypasses /api/*, non-GET requests, and authenticated/admin data

const CACHE_NAME = 'bkic-static-v1';
const CORE_SHELL_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/images/bkic/bkic_logo.jpg',
  '/images/bkic/dut_emblem.jpg'
];

const OFFLINE_FALLBACK_HTML = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>BK-IC</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(160deg, #050814 0%, #0A1432 55%, #070D22 100%);
      color: #F8FAFC;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      padding-top: calc(24px + env(safe-area-inset-top, 0px));
      padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    }
    .card {
      max-width: 420px;
      width: 100%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 28px;
      padding: 32px 24px;
      text-align: center;
      backdrop-filter: blur(12px);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(2, 132, 199, 0.25);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #BAE6FD;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 10px;
      color: #FFFFFF;
    }
    p {
      font-size: 13px;
      line-height: 1.6;
      color: #CBD5E1;
      margin-bottom: 22px;
    }
    button {
      background: linear-gradient(90deg, #0284C7, #38BDF8);
      color: #FFFFFF;
      border: none;
      border-radius: 999px;
      padding: 12px 28px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">BK-IC • OFFLINE MODE</span>
    <h1>Không có kết nối Internet</h1>
    <p>Thiết bị của bạn hiện đang ngoại tuyến. Vui lòng kiểm tra kết nối Wi-Fi hoặc dữ liệu di động để tiếp tục truy cập hệ sinh thái BK-IC.</p>
    <button onclick="window.location.reload()">Thử tải lại trang</button>
  </div>
</body>
</html>`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_SHELL_ASSETS))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 1. Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 2. Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // 3. NEVER cache any API, authentication, or dynamic backend route
  if (url.pathname.startsWith('/api/') || url.pathname === '/healthz') {
    return;
  }

  // 4. Skip Vite HMR / dev module requests in development
  if (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/node_modules/')
  ) {
    return;
  }

  // 5. Navigation requests (HTML SPA routes): Network-first with cached shell / offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          }
          return response;
        })
        .catch(async () => {
          const cachedShell = await caches.match('/');
          if (cachedShell) return cachedShell;
          return new Response(OFFLINE_FALLBACK_HTML, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        })
    );
    return;
  }

  // 6. Static Assets (/assets/, /images/, /imageAVT/, /icons/, manifest): Stale-While-Revalidate
  const isStaticAsset =
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/imageAVT/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/apple-touch-icon.png' ||
    url.pathname === '/manifest.webmanifest';

  if (isStaticAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached);

        return cached || networkPromise;
      })
    );
  }
});
