// Minimal service worker — required for PWA install on Android/Chrome.
// Uses network-first; intentionally does no caching beyond what the browser does.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // pass-through: let the browser handle requests normally
});
