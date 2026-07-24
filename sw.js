// Service Worker - Desafio Geográfico
const CACHE_NOME = 'desafio-geo-cache-v2';
const ARQUIVOS_PARA_CACHE = [
  './',
  './index.html',
  './dados-jogo.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NOME).then((cache) => cache.addAll(ARQUIVOS_PARA_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((nome) => nome !== CACHE_NOME).map((nome) => caches.delete(nome)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    fetch(evento.request)
      .then((respostaDaRede) => {
        const copia = respostaDaRede.clone();
        caches.open(CACHE_NOME).then((cache) => cache.put(evento.request, copia));
        return respostaDaRede;
      })
      .catch(() => caches.match(evento.request).then((r) => r || caches.match('./index.html')))
  );
});
