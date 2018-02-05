/**
 * Add a new item to the database
 * @name post.js
 */

const catchError = require('./catchError');
const db         = require('../../../lib/modules/database');
const Document   = require('../Document');
const types      = require('./types');

module.exports = async (req, res, next) => {

  // Check type
  const type = types[req.params.type];
  if (!type) return res.badRequest(`Invalid CV type.`);

  // Retrieve the counter document
  const counterURL = db.getDocURL(`counter`);
  const counterDoc = await db.get(counterURL).catch(catchError(req, res, next));

  // Increment counter and re-upsert it
  counterDoc.counter++;
  const counterResponse = await db.upsert(counterDoc).catch(catchError(req, res, next));

  // eslint-disable-next-line no-unused-vars
  const { addItem, _csrf, ...props } = req.body;

  // Create a new document
  const doc = new Document({
    cvid: counterResponse.counter,
    type,
    ...props,
  });

  // Add new document to database
  const docResponse = await db.add(doc).catch(catchError(req, res, next));

  // Reload the page
  res.redirect(`/admin/${req.params.type}/${docResponse.cvid}`);

};
