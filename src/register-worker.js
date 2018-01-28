if (
  `serviceWorker` in navigator
  && location.protocol !== `file:`
  && navigator.onLine
) {
  navigator.serviceWorker
  .register(`offline-worker.js`)
  .catch(console.error);
}
