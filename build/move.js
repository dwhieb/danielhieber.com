/**
 * This build script moves offline-worker.js from the /js folder to the root of the /public folder, and deletes the original. THaving the file here makes it easier to work with file paths in the service worker.
 * @name move.js
 */

const { copyFile, unlink } = require('fs');
const { promisify } = require('util');

const copy = promisify(copyFile);
const del  = promisify(unlink);

const logError = () => console.error(`Could not copy offline-worker.js`);

copy(`public/js/offline-worker.js`, `public/offline-worker.js`).catch(logError);
del(`public/js/offline-worker.js`).catch(logError);
