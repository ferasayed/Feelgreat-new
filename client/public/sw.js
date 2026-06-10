// Service Worker for Feel Great PWA
// Handles: Push notifications, offline caching, install events

const STATIC_CACHE = "feelgreat-static-v1";
const DYNAMIC_CACHE = "feelgreat-dynamic-v1";

// Static assets to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/offline.html",
];

// Install event - precache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network-first for pages, cache-first for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip non-http(s) requests
  if (!url.protocol.startsWith("http")) return;

  // API requests - network only, no cache
  if (url.pathname.startsWith("/api/")) return;

  // manus-storage (images/media) - cache first, then network
  if (url.pathname.startsWith("/manus-storage/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        }).catch(() => new Response("", { status: 408 }));
      })
    );
    return;
  }

  // HTML pages - network first, fallback to cache, then offline page
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match("/offline.html");
          });
        })
    );
    return;
  }

  // Static assets (JS, CSS, fonts) - stale-while-revalidate
  if (
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.includes("fonts.googleapis") ||
    url.pathname.includes("fonts.gstatic")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }
});

// Handle push notification events
self.addEventListener("push", (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const options = {
      body: data.body || "",
      icon: "/manus-storage/icon-192x192_71b75f5f.png",
      badge: "/manus-storage/icon-72x72_e44851ff.png",
      tag: data.tag || "default",
      timestamp: data.timestamp || Date.now(),
      data: {
        url: data.url || "/blog",
      },
      actions: [
        { action: "open", title: data.openLabel || "اقرأ المزيد" },
      ],
      vibrate: [200, 100, 200],
      requireInteraction: false,
    };
    event.waitUntil(
      self.registration.showNotification(data.title || "Feel Great", options)
    );
  } catch (e) {
    console.error("[SW] Push parse error:", e);
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/blog";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  // Analytics tracking could go here
});

// Listen for messages from the main app
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
  if (event.data === "clearCache") {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});
