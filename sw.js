const STATIC_CACHE = "aponar-nihon-static-v4";
const DYNAMIC_CACHE = "aponar-nihon-dynamic-v4";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo.png",
  "/aponar-nihon(1).png",
  "/ebook-library.html"
];

const MAX_DYNAMIC_CACHE_ITEMS = 120;

const EBOOK_TOOL_MARKER = `        <a class="app-tool-item gray" href="#guide">
          <span class="app-tool-icon"><i class="fa-solid fa-compass"></i></span>
          <strong>স্টাডি গাইড</strong><small>শেখার রোডম্যাপ</small>
        </a>`;

const EBOOK_TOOL_CARD = `        <a class="app-tool-item cyan" href="ebook-library.html" aria-label="E-Book Library">
          <span class="app-tool-icon"><i class="fa-solid fa-book-open-reader"></i></span>
          <strong>E-Book</strong><small>স্টাডি লাইব্রেরি</small>
        </a>\n`;

// Keep the current homepage intact and add E-Book inside the existing
// “সব গুরুত্বপূর্ণ সেকশন” grid. This avoids removing or replacing any tool.
async function enhanceHomeHtml(response, requestUrl) {
  if (!response || !response.ok) return response;

  const url = new URL(requestUrl);
  const isHome = url.origin === self.location.origin &&
    (url.pathname === "/" || url.pathname === "/index.html");

  if (!isHome) return response;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  try {
    let html = await response.text();

    if (!html.includes('href="ebook-library.html"') && html.includes(EBOOK_TOOL_MARKER)) {
      html = html.replace(EBOOK_TOOL_MARKER, EBOOK_TOOL_CARD + EBOOK_TOOL_MARKER);
    }

    const headers = new Headers(response.headers);
    headers.delete("content-length");
    headers.delete("content-encoding");
    headers.delete("etag");

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  } catch (error) {
    console.warn("Homepage enhancement skipped:", error);
    return response;
  }
}

// Cache size limit
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxItems);
  }
}

// Install
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Manual update support
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Fetch
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Only cache same-origin files
  const isSameOrigin = url.origin === self.location.origin;

  // HTML pages => Network First
  if (
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").includes("text/html")
  ) {
    event.respondWith(
      fetch(request)
        .then(async (networkResponse) => {
          const finalResponse = await enhanceHomeHtml(networkResponse, request.url);

          if (isSameOrigin && finalResponse && finalResponse.ok) {
            const copy = finalResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, copy);
              trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_ITEMS);
            });
          }

          return finalResponse;
        })
        .catch(() => {
          return caches.match(request).then(async (cached) => {
            const fallback =
              cached ||
              await caches.match("/index.html") ||
              await caches.match("/");

            if (!fallback) return fallback;
            return enhanceHomeHtml(fallback, request.url);
          });
        })
    );
    return;
  }

  // CSS & JS => Stale While Revalidate
  if (
    isSameOrigin &&
    (url.pathname.endsWith(".css") || url.pathname.endsWith(".js"))
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const copy = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, copy);
                trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_ITEMS);
              });
            }

            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Images => Cache First
  if (
    isSameOrigin &&
    (
      request.destination === "image" ||
      url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".jpg") ||
      url.pathname.endsWith(".jpeg") ||
      url.pathname.endsWith(".webp") ||
      url.pathname.endsWith(".svg")
    )
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const copy = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, copy);
                trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_ITEMS);
              });
            }

            return networkResponse;
          })
          .catch(() => caches.match("/logo.png"));
      })
    );
    return;
  }

  // Default => Network First
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (isSameOrigin && networkResponse && networkResponse.ok) {
          const copy = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, copy);
            trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_ITEMS);
          });
        }

        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
