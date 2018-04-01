/**
 * Route handler to delete a file from a document
 * @name deleteFile.js
 */

const catchError = require('./catchError');
const { database: db, storage } = require('../../../lib/modules');

module.exports = async (req, res, next) => {

  const {
    deleteFile: attachmentLink,
    fileType,
    key,
  } = req.body;

  const container = `publications`;
  const blobName  = `${key}/${fileType}.pdf`;

  try {

    await Promise.all([
      db.deleteAttachment(attachmentLink),
      storage.deleteBlob(container, blobName),
    ]);

  } catch (e) {

    return catchError(req, res, next)(e);

  }

  res.redirect(req.originalUrl);

};
