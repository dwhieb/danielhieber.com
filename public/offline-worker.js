/**
 * A web worker that caches network responses for specified files.
 * Attempts to return cached responses first, then update the cache with the network response.
 * @name offline-worker.js
 */

const cacheName = `danielhieber`;

// Checks whether a URL is included in cache.json
const isWhitelisted = req => self.files.some(file => req.url.endsWith(file));

// On activation, remove any items not listed in cache.json from the cache
const activate = ev => {

  const cleanCache = async () => {
    const { cache } = self;
    const checkFile = req => (isWhitelisted(req) ? Promise.resolve() : cache.delete(req));
    const keys      = await cache.keys();
    await Promise.all(keys.map(checkFile));
  };

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

      const res = await fetch(req);

      if (res.status === 200 && isWhitelisted(req)) {
        await self.cache.put(req, res.clone());
      }

      return res;

    };

    const [cacheResponse, networkResponse] = await Promise.all([
      caches.match(req),
      getNetworkResponse(),
    ]);

    return cacheResponse || networkResponse;

  };

  ev.respondWith(getResponse());

};

// Install by retrieving cache.json and adding all the files listed there to the cache
const install = ev => {

  const cacheFiles = async () => {
    const res  = await fetch(`json/cache.json`);
    self.files = await res.json();
    self.cache = await caches.open(cacheName);
    await self.cache.addAll(self.files);
  };

  ev.waitUntil(cacheFiles());

};

self.onactivate = activate;
self.onerror    = console.error;
self.onfetch    = fetcher;
self.oninstall  = install;
