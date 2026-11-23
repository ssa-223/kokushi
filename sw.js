const V='kq-v1';
const FILES=["./", "index.html", "manifest.webmanifest", "books.json", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "q-01-1.json", "q-01-2.json", "q-01-3.json", "q-02-1.json", "q-02-2.json", "q-03-1.json", "q-03-2.json", "q-04.json", "q-05.json", "q-06.json", "q-07.json", "q-08.json", "q-09.json", "q-10.json"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='kq-fonts').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    e.respondWith(caches.open(V).then(c=>c.match(req,{ignoreSearch:true}).then(hit=>{
      const net=fetch(req).then(r=>{if(r.ok)c.put(req,r.clone());return r}).catch(()=>hit);
      return hit||net;})));
  }else if(/fonts\.(googleapis|gstatic)\.com$/.test(url.host)){
    e.respondWith(caches.open('kq-fonts').then(c=>c.match(req).then(hit=>hit||fetch(req).then(r=>{c.put(req,r.clone());return r}))));
  }
});
