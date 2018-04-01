/**
 * Upsert an item to the database
 * @name put.js
 */

/* eslint-disable
  max-statements,
*/

const catchError        = require('./catchError');
const db                = require('../../../lib/modules/database');
const deleteHandler     = require('./delete');
const getHandler        = require('./get');
const { Document }      = require('../models');
const types             = require('../types');
const uploadFileHandler = require('./postFile');

module.exports = async (req, res, next) => {

  // Reroute to delete handler if delete button was clicked
  if (req.body.deleteItem) return deleteHandler(req, res, next);

  // Reroute to postFile handler if upload button was clicked
  if (req.body.uploadFile) return uploadFileHandler(req, res, next);

  const type = types[req.params.type];
  const cvid = Number(req.params.cvid);

  // Check type in URL
  if (!type) return res.error.badRequest(`Invalid CV type.`);

  // Remove unnecessary fields from form data
  // and separate out links hash
  /* eslint-disable no-unused-vars */
  const {

    // form fields
    _csrf,
    saveItem,

    // links hash
    abstract,
    doi,
    handout,
    info,
    org,
    pdf,
    poster,
    pub,
    slides,
    video,

    // remaining properties
    ...props

  } = req.body;
  /* eslint-enable no-unused-vars */

  const links = {
    abstract,
    doi,
    handout,
    info,
    org,
    pdf,
    poster,
    pub,
    slides,
    video,
  };

  // Validate data
  let model;

  try {

    model = new Document({
      cvid,
      links,
      type,
      ...props,
    });

  } catch (e) {

    return res.error.badData(e.message);

  }

  // Retrieve item from database
  let doc;

  try {

    const docURL = db.getDocURL(model.id);
    doc = await db.get(docURL);

  } catch (e) {

    return catchError(req, res, next)(e);

  }

  // Validate that document is correct
  if (doc.type !== type) res.error.badRequest(`Document type does not match.`);
  if (doc.cvid !== cvid) res.error.badRequest(`CVID does not match.`);

  // Update the doc with the latest data
  Object.assign(doc, model);

  // Upsert the doc to the server
  try {

    await db.upsert(doc);

  } catch (e) {

    return catchError(req, res, next)(e);

  }

  // Render the page using the standard GET handler
  getHandler(req, res, next);

};
