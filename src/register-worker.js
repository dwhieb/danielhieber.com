if (
  `serviceWorker` in navigator
  && location.protocol !== `file:`
  && navigator.onLine
) {
  navigator.serviceWorker
  .register(`/js/offline-worker.js`)
  .catch(console.error);
}
