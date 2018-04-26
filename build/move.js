/**
 * This build script moves offline-worker.js from the /js folder to the root of the /public folder, and deletes the original. THaving the file here makes it easier to work with file paths in the service worker.
 * @name move.js
 */

const { copyFile, stat, unlink } = require('fs');
const { promisify } = require('util');

const copy  = promisify(copyFile);
const del   = promisify(unlink);
const check = promisify(stat);

const path = `public/js/offline-worker.js`;

void async function() {

  try {
    await check(path);
    await copy(path, `public/offline-worker.js`);
    del(path);
  } catch (e) {
    console.log(`\n -- offline-worker.js already moved`);
  }

  console.log(`\n -- Moved offline-worker.js`);

}();
