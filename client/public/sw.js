// Service Worker for Push Notifications - FeelGreat.us.com
// This file must be in the public root for proper scope

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle push notification events
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || "",
      icon: data.icon || "/favicon.ico",
      badge: "/favicon.ico",
      tag: data.tag || "default",
      timestamp: data.timestamp || Date.now(),
      data: {
        url: data.url || "/blog",
      },
      actions: [
        { action: "open", title: data.openLabel || "Open" },
      ],
      vibrate: [200, 100, 200],
      requireInteraction: false,
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "FeelGreat", options)
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
      // If a window is already open, focus it and navigate
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // Otherwise open a new window
      return self.clients.openWindow(url);
    })
  );
});

// Handle notification close (for analytics)
self.addEventListener("notificationclose", (event) => {
  // Could send analytics event here
});
