/**
 * This script uploads the latest version of the CSS and JavaScript files. It does NOT reupload images or fonts. These must be uploaded manually to Azure Storage.
 * @name upload.js
 */

const cssFiles  = [];
const jsFiles   = [];
const jsonFiles = [];

require('../../credentials/azure-storage-danielhieber');
const path          = require('path');
const { promisify } = require('util');
const Storage       = require('azure-storage');

(async () => {

  console.log(` -- Beginning file uploads`);

  const uploadFiles = async (filepaths, type) => {

    const uploadFile = async filepath => {

      const container       = type === `js` ? `scripts` : `css`;
      const contentEncoding = `utf-8`;
      const contentType     = type === `js` ? `application/javascript` : `text/css`;
      const filename        = path.basename(filepath);

      const opts = {
        contentSettings: {
          contentEncoding,
          contentType,
        },
      };

      const storage = Storage.createBlobService();
      const upload  = promisify(storage.createBlockBlobFromLocalFile).bind(storage);
      await upload(container, filename, filepath, opts);

    };

    await Promise.all(filepaths.map(uploadFile));

    console.log(` -- ${type.toUpperCase()} files uploaded`);

  };

  await Promise.all([
    uploadFiles(cssFiles, `css`),
    uploadFiles(jsFiles, `js`),
    uploadFiles(jsonFiles, `json`),
  ]);

  console.log(` -- File uploads complete`);

})();
