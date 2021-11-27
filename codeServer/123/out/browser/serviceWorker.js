"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
self.addEventListener("install", function () {
    console.log("[Service Worker] install");
});
self.addEventListener("activate", function (event) {
    event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", function (event) {
    if (!navigator.onLine) {
        event.respondWith(new Promise(function (resolve) {
            resolve(new Response("OFFLINE", {
                status: 200,
                statusText: "OK",
            }));
        }));
    }
});
//# sourceMappingURL=serviceWorker.js.map