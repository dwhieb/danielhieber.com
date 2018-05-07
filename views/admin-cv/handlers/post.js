/**
 * POST handler for the CV Editor page
 */

const { catchError } = require('../../../utilities');
const { db }         = require('../../../services');
const { Document }   = require('../models');
const { promisify }  = require('util');
const { CVTypes }    = require('../../../constants');

module.exports = async (req, res, next) => {

  // Check type
  const { type } = CVTypes[req.params.type];
  if (!type) return res.error.badRequest(`Invalid CV type.`);

  // Retrieve the counter document
  let counterDoc;

  try {

    const counterURL = db.getDocURL(`counter`);
    counterDoc = await db.get(counterURL);

  } catch (e) {

    return catchError(req, res, next)(e);

  }

  // Recursively increments counter and checks that new CVID doesn't already exist
  const increment = async () => {

    // Increment counter
    counterDoc.counter++;

    // Create query for doc with new CVID
    const query = `
      SELECT * FROM c
      WHERE (
        c.type = "${type}"
        AND c.cvid = ${counterDoc.counter}
        AND (
          (NOT IS_DEFINED(c.ttl))
          OR c.ttl < 1
        )
      )
    `;

    // Check whether doc with new CVID already exists
    let existingDoc;

    try {

      const iterator = db.query(query, { maxItemCount: 1 });
      const toArray  = promisify(iterator.toArray).bind(iterator);
      [existingDoc]  = await toArray();

    } catch (e) {

      return catchError(req, res, next)(e);

    }

    // If doc exists, increment and check again
    if (existingDoc) increment();

  };

  // Increment counter
  increment();

  // Upsert counter doc with CVID incremented
  let counterResponse;

  try {
    counterResponse = await db.upsert(counterDoc);
  } catch (e) {
    return catchError(req, res, next)(e);
  }

  // Create a new document
  const doc = new Document({
    cvid: counterResponse.counter,
    type,
  });

  // Add new document to database
  let docResponse;

  try {
    docResponse = await db.add(doc);
  } catch (e) {
    return catchError(req, res, next)(e);
  }

  // Reload the page
  res.redirect(`/admin/${req.params.type}/${docResponse.cvid}`);

};
