/**
 * This script registers the service worker that caches items for offline use
 */

if (
  `serviceWorker` in navigator
  && location.protocol !== `file:`
  && navigator.onLine
) {
  navigator.serviceWorker
  .register(`/offline-worker.js`, { scope: `/` })
  .catch(console.error);
}
