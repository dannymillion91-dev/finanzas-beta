/* Service Worker para "Mis Finanzas"
   Estrategia "red primero": si hay internet, siempre trae la versión más nueva;
   si no hay internet, usa la copia guardada. Así las mejoras llegan enseguida
   y la app sigue abriendo sin conexión. */
const CACHE = 'mis-finanzas-v3';
const ASSETS = ['./', 'index.html', 'manifest.json', 'icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return; // otros hosts van directo a la red
  // La página en sí se pide SIN pasar por la caché del navegador. Si no,
  // GitHub Pages la deja guardada unos minutos y el móvil sigue enseñando la
  // versión de antes aunque ya esté publicada la nueva.
  const esPagina = e.request.mode === 'navigate' ||
                   (e.request.headers.get('accept') || '').includes('text/html');
  e.respondWith(
    fetch(esPagina ? new Request(e.request, { cache: 'no-store' }) : e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() =>
      caches.match(e.request).then(hit => hit || caches.match('index.html'))
    )
  );
});
