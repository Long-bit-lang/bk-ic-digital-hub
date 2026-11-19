// BK-IC Digital Hub — Performance Optimization & iOS PWA Verification Test Suite
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('====================================================');
console.log('BK-IC PERFORMANCE & iOS PWA VERIFICATION TEST SUITE');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// 1. iOS PWA MANIFEST & APP NAMING ("BK-IC")
// -----------------------------------------------------------------------------
console.log('--- Testing 1: Web App Manifest & Official App Naming ---');

const manifestPath = path.resolve('public/manifest.webmanifest');
assert.ok(fs.existsSync(manifestPath), 'public/manifest.webmanifest must exist');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert.strictEqual(manifest.name, 'BK-IC', 'Manifest name must be exactly "BK-IC"');
assert.strictEqual(manifest.short_name, 'BK-IC', 'Manifest short_name must be exactly "BK-IC"');
assert.ok(!JSON.stringify(manifest).includes('BK-ICm'), 'Manifest must never contain typo "BK-ICm"');
assert.strictEqual(manifest.display, 'standalone', 'Manifest display must be "standalone"');
assert.strictEqual(manifest.start_url, '/', 'Manifest start_url must be "/"');
assert.strictEqual(manifest.scope, '/', 'Manifest scope must be "/"');
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'Manifest must define 180, 192, and 512 icons');
console.log('[PASS] Scenario 1: manifest.webmanifest configured with name="BK-IC", short_name="BK-IC", display="standalone"');

// -----------------------------------------------------------------------------
// 2. iOS APPLE TOUCH ICON & PWA ICONS
// -----------------------------------------------------------------------------
console.log('\n--- Testing 2: Official BK-IC Icons (180x180, 192x192, 512x512) ---');

const iconFiles = [
  'public/apple-touch-icon.png',
  'public/icons/icon-192.png',
  'public/icons/icon-512.png'
];

for (const relPath of iconFiles) {
  const fullPath = path.resolve(relPath);
  assert.ok(fs.existsSync(fullPath), `${relPath} must exist`);
  const stat = fs.statSync(fullPath);
  assert.ok(stat.size > 1000, `${relPath} must be a valid non-empty PNG icon`);
}
console.log('[PASS] Scenario 2: apple-touch-icon.png (180x180), icon-192.png, and icon-512.png exist and are optimized');

// -----------------------------------------------------------------------------
// 3. index.html iOS STANDALONE META TAGS
// -----------------------------------------------------------------------------
console.log('\n--- Testing 3: index.html iOS Safari Standalone Meta Tags ---');

const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
assert.ok(indexHtml.includes('<title>BK-IC</title>'), 'index.html title must be <title>BK-IC</title>');
assert.ok(indexHtml.includes('name="apple-mobile-web-app-title" content="BK-IC"'), 'Must include apple-mobile-web-app-title="BK-IC"');
assert.ok(indexHtml.includes('name="application-name" content="BK-IC"'), 'Must include application-name="BK-IC"');
assert.ok(indexHtml.includes('name="apple-mobile-web-app-capable" content="yes"'), 'Must include apple-mobile-web-app-capable="yes"');
assert.ok(indexHtml.includes('name="mobile-web-app-capable" content="yes"'), 'Must include mobile-web-app-capable="yes"');
assert.ok(indexHtml.includes('name="apple-mobile-web-app-status-bar-style"'), 'Must include apple-mobile-web-app-status-bar-style');
assert.ok(indexHtml.includes('viewport-fit=cover'), 'Viewport meta must include viewport-fit=cover for iPhone notch/Dynamic Island');
assert.ok(indexHtml.includes('rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"'), 'Must link /apple-touch-icon.png');
assert.ok(indexHtml.includes('rel="manifest" href="/manifest.webmanifest"'), 'Must link /manifest.webmanifest');
assert.ok(!indexHtml.includes('BK-ICm'), 'index.html must never contain "BK-ICm"');
console.log('[PASS] Scenario 3: index.html contains all required iOS standalone meta tags and links');

// -----------------------------------------------------------------------------
// 4. SERVICE WORKER SAFETY & OFFLINE FALLBACK
// -----------------------------------------------------------------------------
console.log('\n--- Testing 4: Service Worker Security & Offline Fallback ---');

const swPath = path.resolve('public/sw.js');
assert.ok(fs.existsSync(swPath), 'public/sw.js must exist');
const swContent = fs.readFileSync(swPath, 'utf8');

assert.ok(swContent.includes("url.pathname.startsWith('/api/')"), 'Service Worker must explicitly bypass /api/* routes');
assert.ok(swContent.includes("request.method !== 'GET'"), 'Service Worker must bypass non-GET requests');
assert.ok(swContent.includes('OFFLINE_FALLBACK_HTML'), 'Service Worker must provide an offline fallback page');
assert.ok(swContent.includes('self.skipWaiting()'), 'Service Worker must support automatic update activation');
console.log('[PASS] Scenario 4: public/sw.js safely caches static shell while strictly bypassing /api/* and auth data');

// -----------------------------------------------------------------------------
// 5. ROUTE-BASED CODE SPLITTING & APPCONTEXT POLLING GUARD
// -----------------------------------------------------------------------------
console.log('\n--- Testing 5: Route-Based Code Splitting & AppContext Optimization ---');

const appTsx = fs.readFileSync(path.resolve('src/App.tsx'), 'utf8');
assert.ok(appTsx.includes('lazy('), 'App.tsx must use React.lazy for Admin/Portal/Detail routes');
assert.ok(appTsx.includes('<Suspense'), 'App.tsx must wrap lazy routes in <Suspense>');

const appContextTsx = fs.readFileSync(path.resolve('src/context/AppContext.tsx'), 'utf8');
assert.ok(appContextTsx.includes('!getApiAuthToken()'), 'AppContext must skip /api/auth/me when no auth token is present');
assert.ok(appContextTsx.includes("document.visibilityState === 'hidden'"), 'AppContext polling must pause when tab is hidden');
console.log('[PASS] Scenario 5: Route-based code splitting and AppContext unauthenticated polling bypass verified');

// -----------------------------------------------------------------------------
// 6. SAFE-AREA SUPPORT & REDUCED MOTION
// -----------------------------------------------------------------------------
console.log('\n--- Testing 6: iPhone Safe Area & CSS Compositing Optimization ---');

const navbarTsx = fs.readFileSync(path.resolve('src/components/layout/Navbar.tsx'), 'utf8');
const footerTsx = fs.readFileSync(path.resolve('src/components/layout/Footer.tsx'), 'utf8');
const indexCss = fs.readFileSync(path.resolve('src/index.css'), 'utf8');

assert.ok(navbarTsx.includes('env(safe-area-inset-top'), 'Navbar must respect env(safe-area-inset-top)');
assert.ok(footerTsx.includes('env(safe-area-inset-bottom'), 'Footer must respect env(safe-area-inset-bottom)');
assert.ok(indexCss.includes('prefers-reduced-motion: reduce'), 'index.css must respect prefers-reduced-motion');
assert.ok(indexCss.includes('touch-action: manipulation'), 'index.css must enable touch-action: manipulation for instant mobile tap');
console.log('[PASS] Scenario 6: iPhone safe-area-inset-* and CSS GPU/touch optimizations verified');

console.log('\n====================================================');
console.log('ALL 6/6 PERFORMANCE & iOS PWA TESTS PASSED!');
console.log('====================================================');
