const CACHE_NAME = 'one-blackjack-v4';
self.addEventListener('install', event => {
 self.skipWaiting();
 event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.add('./')));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(
  keys.filter(key => key.startsWith('one-blackjack-') && key !== CACHE_NAME).map(key => caches.delete(key))
 )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
 if(event.request.method !== 'GET') return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin) return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(response=>{
   const copy=response.clone();
   caches.open(CACHE_NAME).then(cache=>cache.put('./',copy));
   return response;
  }).catch(()=>caches.match('./')));
 }
});