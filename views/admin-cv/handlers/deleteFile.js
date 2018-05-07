/**
 * Route handler to delete a file from a document on the CV Editor page
 */

const { catchError }  = require('../../../utilities');
const { db, storage } = require('../../../services');

module.exports = async (req, res, next) => {

  const {
    deleteFile: attachmentLink,
    key,
    [key]: fileType,
  } = req.body;

  const container = `publications`;
  const blobName  = `${key}/${fileType}.pdf`;

  try {

    await Promise.all([
      db.deleteAttachment(attachmentLink),
      storage.deleteBlob(container, blobName),
    ]);

  } catch (e) {

    if (e.statusCode === 404) return res.error.notFound(e.message);
    return catchError(req, res, next)(e);

  }

  res.redirect(req.originalUrl);

};
