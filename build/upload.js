/**
 * This script uploads the latest version of the CSS and JavaScript files. It does NOT reupload images or fonts. These must be uploaded manually to Azure Storage.
 */

require('../../credentials/azure-storage-danielhieber');
const fs            = require('fs');
const path          = require('path');
const { promisify } = require('util');
const Storage       = require('azure-storage');

(async () => {

  console.log(` -- Beginning file uploads`);

  const readDir      = promisify(fs.readdir);
  const cssFilenames = await readDir(`public/css`);
  const jsFilenames  = await readDir(`public/js`);

  const uploadFiles = async (filenames, type) => {

    const uploadFile = async filename => {

      const container       = type === `js` ? `scripts` : `css`;
      const filePath        = path.join(`public/${type}`, filename);
      const contentEncoding = `utf-8`;
      const contentType     = type === `js` ? `application/javascript` : `text/css`;

      const opts = {
        contentSettings: {
          contentEncoding,
          contentType,
        },
      };

      const storage = Storage.createBlobService();
      const upload  = promisify(storage.createBlockBlobFromLocalFile).bind(storage);
      await upload(container, filename, filePath, opts);

    };

    await Promise.all(filenames.map(uploadFile));

    console.log(` -- ${type.toUpperCase()} files uploaded`);

  };

  await Promise.all([
    uploadFiles(cssFilenames, `css`),
    uploadFiles(jsFilenames, `js`),
  ]);

  console.log(` -- File uploads complete`);

})();
