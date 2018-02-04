"use strict";

if ("serviceWorker" in navigator && location.protocol !== "file:" && navigator.onLine) {
  navigator.serviceWorker.register("/offline-worker.js", { scope: "/" }).catch(console.error);
} //# sourceMappingURL=/js/register-worker.js.map