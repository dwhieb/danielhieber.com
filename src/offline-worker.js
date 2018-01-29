/**
 * A web worker that caches network responses for specified files.
 * Attempts to return cached responses first, then update the cache with the network response.
 * @name offline-worker.js
 */

const cacheName = `danielhieber`;
const cacheURL  = `json/cache.json`;

// Checks whether a URL is included in cache.json. Can only use this within oninstall and onactivate.
const isWhitelisted = req => self.files.some(file => req.url.endsWith(file));

// On activation, remove any items not listed in cache.json from the cache
const activate = ev => {

  const cleanCache = async () => {
    const cache     = await caches.open(cacheName);
    const checkFile = req => (isWhitelisted(req) ? Promise.resolve() : cache.delete(req));
    const keys      = await cache.keys();
    await Promise.all(keys.map(checkFile));
  };

  self.skipWaiting();
  ev.waitUntil(cleanCache());

};

// Attempts to return the resource from the cache, and updates the cache from the network, with fallbacks for both.
const fetcher = ev => {

  const { request: req } = ev;

  if (req.method !== `GET`) return ev.respondWith(fetch(req));

  const getResponse = async () => {

    const getNetworkResponse = async () => {

      if (!navigator.onLine) {
        return new Response(`Cannot connect to the internet.`, {
          status:     503,
          statusText: `Service Unavailable`,
        });
      }

      const cache = await caches.open(cacheName);
      const res   = await fetch(req);

      if (res.status === 200) await cache.put(req, res.clone());

      return res;

    };

    const [cacheResponse, networkResponse] = await Promise.all([
      caches.match(req),
      getNetworkResponse(),
    ]);

    return cacheResponse || networkResponse;

  };

  ev.respondWith(getResponse());
  ev.waitUntil(self.clients.claim());

};

// Install by retrieving cache.json and adding all the files listed there to the cache
const install = ev => {

  const cacheFiles = async () => {

    const res   = await fetch(cacheURL);
    const cache = await caches.open(cacheName);
    self.files  = await res.json();

    if (res.status === 200) await cache.addAll(self.files);

  };

  ev.waitUntil(cacheFiles());

};

self.onactivate = activate;
self.onerror    = console.error;
self.onfetch    = fetcher;
self.oninstall  = install;
