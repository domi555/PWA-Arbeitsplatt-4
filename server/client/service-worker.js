importScripts("/precache-manifest.82e88870ee3827902f9f17d64064411e.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/* global workbox */

self.skipWaiting();

if (workbox) {
  console.log(`Workbox is loaded`);
  workbox.setConfig({ debug: true });
  workbox.precaching.precacheAndRoute(self.__precacheManifest);

  // 7) NetworkFirst, 8) CacheFirst
  workbox.routing.registerRoute(
    '/employees',
    new workbox.strategies.CacheFirst({
      cacheName: 'dominiks-cache',
    }),
  );

  // 9) Nur das App Frame wird normalerweise gecached, /employees mit CacheFirst und /images/* muss auch noch gecached werden.
  workbox.routing.registerRoute(
    new RegExp('/images/.*.jpg'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'dominiks-image-cache',
    }),
  );
  // workbox.routing.registerRoute(
  //   new RegExp('/img/icons/*'),
  //   new workbox.strategies.StaleWhileRevalidate({
  //     cacheName: 'dominiks-icon-cache',
  //   }),
  // );

  self.addEventListener('push', (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body.message,
      icon: 'img/icons/employees_192x192.png',
    });
  });
} else {
  console.log(`Workbox didn't load`);
}

