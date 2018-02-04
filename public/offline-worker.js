"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * A web worker that caches network responses for specified files.
 * Attempts to return cached responses first, then update the cache with the network response.
 * @name offline-worker.js
 */

var cacheName = "danielhieber";
var cacheURL = "json/cache.json";

// Checks whether a URL is included in cache.json. Can only use this within oninstall and onactivate.
var isWhitelisted = function isWhitelisted(req) {
  return self.files.some(function (file) {
    return req.url.endsWith(file);
  });
};

// On activation, remove any items not listed in cache.json from the cache
var activate = function activate(ev) {

  var cleanCache = function () {
    var _ref = _asyncToGenerator(function* () {
      var cache = yield caches.open(cacheName);
      var checkFile = function checkFile(req) {
        return isWhitelisted(req) ? Promise.resolve() : cache.delete(req);
      };
      var keys = yield cache.keys();
      yield Promise.all(keys.map(checkFile));
    });

    return function cleanCache() {
      return _ref.apply(this, arguments);
    };
  }();

  self.skipWaiting();
  ev.waitUntil(cleanCache());
};

// Attempts to return the resource from the cache, and updates the cache from the network, with fallbacks for both.
var fetcher = function fetcher(ev) {
  var req = ev.request;


  if (req.method !== "GET") return ev.respondWith(fetch(req));

  var getResponse = function () {
    var _ref2 = _asyncToGenerator(function* () {

      var getNetworkResponse = function () {
        var _ref3 = _asyncToGenerator(function* () {

          if (!navigator.onLine) {
            return new Response("Cannot connect to the internet.", {
              status: 503,
              statusText: "Service Unavailable"
            });
          }

          var cache = yield caches.open(cacheName);
          var res = yield fetch(req);

          if (res.ok) yield cache.put(req, res.clone());

          return res;
        });

        return function getNetworkResponse() {
          return _ref3.apply(this, arguments);
        };
      }();

      var _ref4 = yield Promise.all([caches.match(req, { ignoreVary: true }), getNetworkResponse()]),
          _ref5 = _slicedToArray(_ref4, 2),
          cacheResponse = _ref5[0],
          networkResponse = _ref5[1];

      return cacheResponse || networkResponse;
    });

    return function getResponse() {
      return _ref2.apply(this, arguments);
    };
  }();

  ev.respondWith(getResponse());
  ev.waitUntil(self.clients.claim());
};

// Install by retrieving cache.json and adding all the files listed there to the cache
var install = function install(ev) {

  var cacheFiles = function () {
    var _ref6 = _asyncToGenerator(function* () {

      var res = yield fetch(cacheURL);
      var cache = yield caches.open(cacheName);
      self.files = yield res.json();

      // NB: Items in the cache must have a leading slash for path to resolve correctly when the service worker is not at the root
      if (res.ok) yield cache.addAll(self.files.map(function (file) {
        return new Request(file, { mode: "cors" });
      }));
    });

    return function cacheFiles() {
      return _ref6.apply(this, arguments);
    };
  }();

  ev.waitUntil(cacheFiles());
};

self.onactivate = activate;
self.onerror = console.error;
self.onfetch = fetcher;
self.oninstall = install;