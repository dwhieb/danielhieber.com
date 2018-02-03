/**
 * This script uploads the latest version of the CSS and JavaScript files. It does NOT reupload images or fonts. These must be uploaded manually to Azure Storage.
 * @name upload.js
 */

require('../../credentials/azure-storage-danielhieber');
const config        = require('../lib/config');
const fs            = require('fs');
const { promisify } = require('util');
const Storage       = require('azure-storage');

// Do not upload localhost or development files to Azure Storage
if (!config.production) return;

const readdir = promisify(fs.readdir);

const mimeTypes = {
  css:  `text/css`,
  js:   `application/javascript`,
  json: `application/json`,
};

void async function() {

  console.log(` -- Beginning file uploads`);

  const storage = Storage.createBlobService();
  const upload  = promisify(storage.createBlockBlobFromLocalFile).bind(storage);

  const cssFiles  = await readdir(`public/css`, `utf8`);
  const jsFiles   = await readdir(`public/js`, `utf8`);
  const jsonFiles = await readdir(`public/json`, `utf8`);

  const uploadFiles = async (filenames, type) => {

    const uploadFile = async filename => {

      const container       = type === `js` ? `scripts` : type;
      const contentEncoding = `utf-8`;
      const contentType     = mimeTypes[type];

      const opts = {
        contentSettings: {
          contentEncoding,
          contentType,
        },
      };

      const dir = `public/${type}/${filename}`;
      await upload(container, filename, dir, opts);

    };

    await Promise.all(filenames.map(uploadFile));

    console.log(` -- ${type.toUpperCase()} files uploaded`);

  };

  await Promise.all([
    uploadFiles(cssFiles, `css`),
    uploadFiles(jsFiles, `js`),
    uploadFiles(jsonFiles, `json`),
  ]);

  console.log(` -- File uploads complete`);

}();
