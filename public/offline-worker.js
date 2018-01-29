"use strict";var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break}}catch(err){_d=true;_e=err}finally{try{if(!_n&&_i["return"])_i["return"]()}finally{if(_d)throw _e}}return _arr}return function(arr,i){if(Array.isArray(arr)){return arr}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i)}else{throw new TypeError("Invalid attempt to destructure non-iterable instance")}}}();function _asyncToGenerator(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{return Promise.resolve(value).then(function(value){step("next",value)},function(err){step("throw",err)})}}return step("next")})}}var cacheName="danielhieber";var isWhitelisted=function isWhitelisted(req){return self.files.some(function(file){return req.url.endsWith(file)})};var activate=function activate(ev){var cleanCache=function(){var _ref=_asyncToGenerator(function*(){var _self=self,cache=_self.cache;var checkFile=function checkFile(req){return isWhitelisted(req)?Promise.resolve():cache.delete(req)};var keys=yield cache.keys();yield Promise.all(keys.map(checkFile))});return function cleanCache(){return _ref.apply(this,arguments)}}();ev.waitUntil(cleanCache())};var fetcher=function fetcher(ev){var req=ev.request;if(req.method!=="GET")return ev.respondWith(fetch(req));var getResponse=function(){var _ref2=_asyncToGenerator(function*(){var getNetworkResponse=function(){var _ref3=_asyncToGenerator(function*(){if(!navigator.onLine){return new Response("Cannot connect to the internet.",{status:503,statusText:"Service Unavailable"})}var res=yield fetch(req);if(res.status===200&&isWhitelisted(req)){yield self.cache.put(req,res.clone())}return res});return function getNetworkResponse(){return _ref3.apply(this,arguments)}}();var _ref4=yield Promise.all([caches.match(req),getNetworkResponse()]),_ref5=_slicedToArray(_ref4,2),cacheResponse=_ref5[0],networkResponse=_ref5[1];return cacheResponse||networkResponse});return function getResponse(){return _ref2.apply(this,arguments)}}();ev.respondWith(getResponse())};var install=function install(ev){var cacheFiles=function(){var _ref6=_asyncToGenerator(function*(){var res=yield fetch("json/cache.json");self.files=yield res.json();self.cache=yield caches.open(cacheName);yield self.cache.addAll(self.files)});return function cacheFiles(){return _ref6.apply(this,arguments)}}();ev.waitUntil(cacheFiles())};self.onactivate=activate;self.onerror=console.error;self.onfetch=fetcher;self.oninstall=install;