const cacheName = self.location.pathname
const pages = [

  "/fb/",
    "/",
    "/docs/sb/",
    "/docs/cmll/",
    "/docs/lse/",
    "/docs/other/",
    "/docs/",
    "/tags/",
    "/book.min.48f33d5a3eb3d0043703a18061032a2d9ba8b975a98e31188faf67aac93a8b44.css",
  "/en.search-data.min.0dd83ef9b50b7b7e0bf5c93e7712ef596f03bd0d2f7ac48b5ba413d4ee4f831e.json",
  "/en.search.min.39ed80da11a93029705819cd7d1eaf2214d34ebfce85f912aa913a159be751ec.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
