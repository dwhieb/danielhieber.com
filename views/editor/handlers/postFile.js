/**
 * Route handler to add a new file to a document`
 * @name postFile.js
 */

/* eslint-disable
  max-statements,
*/

const catchError      = require('./catchError');
const { storageURL }  = require('../../../lib/config');
const { db, storage } = require('../../../lib/services');
const uuid            = require('uuid/v4');

module.exports = async (req, res, next) => {

  if (!req.file.size) return res.error.badRequest(`Please select a file to upload.`);

  const { file }              = req;
  const { fileType, id, key } = req.body;
  const blobName              = `${key}/${fileType}.pdf`;
  const container             = `publications`;

  // Upload file to Azure Storage
  try {

    const opts = {
      contentSettings: {
        contentType: `application/pdf`,
      },
      metadata: {
        fileType,
      },
    };

    await storage.uploadLocalFile(
      container,
      blobName,
      file.path,
      opts,
    );

  } catch (e) {

    return catchError(req, res, next)(e);

  }

  // Create an attachment in CosmosDB
  const docLink  = db.getDocURL(id);
  const blobLink = `${storageURL}/${container}/${blobName}`;

  const body = {
    contentType: `application/pdf`,
    fileType,
    id: uuid(),
    key,
    media:       blobLink,
  };

  try {

    await db.createAttachment(docLink, body);

  } catch (e) {

    return catchError(req, res, next)(e);

  }

  // Update links hash in document
  try {

    const doc = await db.get(docLink);
    doc.links[fileType] = blobLink;
    await db.upsert(doc);

  } catch (e) {

    return catchError(req, res, next)(e);

  }

  // Rerender the page
  res.redirect(req.originalUrl);

};
