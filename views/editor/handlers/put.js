/**
 * PUT handler for the CV Editor page
 */

/* eslint-disable
  max-statements,
*/

const { catchError }     = require('../lib');
const { db }             = require('../../../services');
const deleteHandler      = require('./delete');
const deleteFileHandler  = require('./deleteFile');
const { Document }       = require('../models');
const getHandler         = require('./get');
const { promisify }      = require('util');
const { CVTypes }        = require('../../../constants');
const uploadFileHandler  = require('./postFile');

module.exports = async (req, res, next) => {

  // Reroute to delete handler if delete button was clicked
  if (req.body.deleteItem) return deleteHandler(req, res, next);

  // Reroute to handler for deleting fils if deleteFile button was clicked
  if (req.body.deleteFile) return deleteFileHandler(req, res, next);

  // Reroute to postFile handler if upload button was clicked
  if (req.body.uploadFile) return uploadFileHandler(req, res, next);


  const { type } = CVTypes[req.params.type];
  const cvid     = Number(req.params.cvid);

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

  // Check that `key` field is unique doesn't already exist (for publications and categories only)
  if (model.type === `category` || model.type === `publication`) {

    const query = `
      SELECT c.key, c.title FROM c
      WHERE (
        (c.type = "category" OR c.type = "publication")
        AND NOT c.id = "${model.id}"
        AND c.key = "${model.key}"
        AND (
          (NOT IS_DEFINED(c.ttl))
          OR c.ttl < 1
        )
      )
    `;

    try {

      const iterator     = db.query(query);
      const toArray      = promisify(iterator.toArray).bind(iterator);
      const existingDocs = await toArray();

      if (existingDocs.length) return res.error.conflict(`The key ${model.key} already exists.`);

    } catch (e) {

      return catchError(req, res, next)(e);

    }

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
