const STATIC_CACHE = "aponar-nihon-static-v6";
const DYNAMIC_CACHE = "aponar-nihon-dynamic-v6";

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

const COMPACT_HOME_STYLE = `
<style id="important-section-compact-v2">
/* Mobile quick tools: compact 13 items into 4 rows (4 + 4 + 4 + 1). */
@media (max-width: 767px) {
  .app-home-screen {
    padding-left: 10px !important;
    padding-right: 10px !important;
    padding-bottom: 24px !important;
  }

  .app-tools-card {
    margin-top: 14px !important;
    padding: 16px 8px 13px !important;
    border-radius: 22px !important;
  }

  .app-card-heading {
    padding: 0 5px 10px !important;
  }

  .app-card-heading span {
    font-size: 9px !important;
  }

  .app-card-heading h2 {
    margin-top: 1px !important;
    font-size: 17px !important;
    line-height: 1.16 !important;
  }

  .app-card-heading > a {
    width: 34px !important;
    height: 34px !important;
    border-radius: 11px !important;
  }

  .app-tools-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    column-gap: 3px !important;
    row-gap: 10px !important;
    align-items: start !important;
  }

  .app-tool-item {
    min-width: 0 !important;
    gap: 0 !important;
  }

  .app-tool-icon {
    width: 47px !important;
    height: 47px !important;
    border-radius: 14px !important;
    margin-bottom: 5px !important;
    font-size: 18px !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 6px 13px rgba(38,62,89,.14) !important;
  }

  .app-tool-icon b {
    font-size: 15px !important;
    letter-spacing: -.35px !important;
  }

  .app-tool-item strong {
    width: 100% !important;
    min-height: 22px !important;
    margin: 0 !important;
    font-size: 9.6px !important;
    line-height: 1.1 !important;
    font-weight: 800 !important;
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
    display: flex !important;
    align-items: flex-start !important;
    justify-content: center !important;
  }

  .app-tool-item small {
    width: 100% !important;
    min-height: 15px !important;
    margin-top: 1px !important;
    font-size: 7.1px !important;
    line-height: 1.08 !important;
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: clip !important;
  }
}

@media (max-width: 380px) {
  .app-tools-card {
    padding-left: 6px !important;
    padding-right: 6px !important;
  }

  .app-tools-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    column-gap: 2px !important;
    row-gap: 9px !important;
  }

  .app-tool-icon {
    width: 44px !important;
    height: 44px !important;
    border-radius: 13px !important;
    font-size: 17px !important;
  }

  .app-tool-icon b {
    font-size: 14px !important;
  }

  .app-tool-item strong {
    font-size: 9px !important;
    min-height: 21px !important;
  }

  .app-tool-item small {
    font-size: 6.8px !important;
    min-height: 14px !important;
  }
}
</style>`;

// Keep the current homepage intact and add E-Book inside the existing
// “সব গুরুত্বপূর্ণ সেকশন” grid. Also inject the compact mobile layout.
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

    if (!html.includes('id="important-section-compact-v2"') && html.includes("</head>")) {
      html = html.replace("</head>", COMPACT_HOME_STYLE + "\n</head>");
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