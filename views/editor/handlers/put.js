/**
 * Upsert an item to the database
 * @name put.js
 */

const catchError   = require('./catchError');
const db           = require('../../../lib/modules/database');
const { Document } = require('../models');
const types        = require('./types');

module.exports = async (req, res, next) => {

  const type = types[req.params.type];
  const cvid = Number(req.params.cvid);

  // Check type
  if (!type) return res.error.badRequest(`Invalid CV type.`);

  // eslint-disable-next-line no-unused-vars
  const { _csrf, ...props } = req.body;

  // Validate data
  const model = new Document({
    cvid,
    type,
    ...props,
  });

  // Retrieve item from database
  const docURL = db.getDocURL(model.id);
  const doc    = await db.get(docURL).catch(catchError(req, res, next));

  // Check type
  if (doc.type !== type) res.error.badRequest(`Document type does not match.`);

  // Check CVID
  if (doc.cvid !== cvid) res.error.badRequest(`CVID does not match.`);

  // TODO:
  // perform a partial update
  // upsert to the server
  // (later you can just validate the data and then do an upsert rather than partial update)
  // rerender page (with a success message)

  res.status(200).json(doc);

};
