/* Rajniti service worker: update aane par apne aap naya version le leta hai.
   Har update par sirf neeche wali VERSION badal do (ya version.txt). */
var VERSION = 'v3';
var CACHE = 'rajniti-' + VERSION;
var CORE = ['./', './index.html', './style.css', './mobile.css', './script.js', './india-data.js', './assembly-data.js', './ls2024-data.js', './party-emblem.js',
    './state-assembly.js', './constituency.js', './career-mode.js', './career-hub.js', './gov-hub.js', './ls-war2.js', './manifest.json'];

self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(CACHE).then(function (c) { return Promise.all(CORE.map(function (u) { return c.add(new Request(u, { cache: 'reload' })).catch(function () {}); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('rajniti-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
    var req = e.request;
    if (req.method !== 'GET') return;
    var url = new URL(req.url);
    if (url.origin !== location.origin) return;
    var isCode = /\.(html|js|css|json)$/i.test(url.pathname) || url.pathname.endsWith('/');
    if (isCode) {
        // network-first: online ho to hamesha naya, offline ho to cache se
        e.respondWith(fetch(req).then(function (r) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); return r; }).catch(function () { return caches.match(req).then(function (m) { return m || caches.match('./index.html'); }); }));
    } else {
        // images/fonts: cache-first (tez), pehli baar network se
        e.respondWith(caches.match(req).then(function (m) { return m || fetch(req).then(function (r) { if (r && r.status === 200) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); } return r; }); }));
    }
});
