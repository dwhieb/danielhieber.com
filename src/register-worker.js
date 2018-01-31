if (
  `serviceWorker` in navigator
  && location.protocol !== `file:`
  && navigator.onLine
) {
  navigator.serviceWorker
  .register(`js/offline-worker.js`, { scope: `/` })
  .catch(console.error);
}
