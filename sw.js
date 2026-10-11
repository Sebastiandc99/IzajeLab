const CACHE='izajelab-v2.0.1';
const ASSETS=['./','./index.html','./styles.css','./app.js','./engine.js','./field.js','./data.js','./icon.svg','./manifest.webmanifest'];
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('izajelab-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 // Archivos de una misma versión: conservar consistencia entre motor y tablas offline.
 e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;try{return await fetch(e.request);}catch{return e.request.mode==='navigate'?await c.match('./index.html'):Response.error();}}));
});
