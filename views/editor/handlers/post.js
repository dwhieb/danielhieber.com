/**
 * Add a new item to the database
 * @name post.js
 */

const catchError    = require('./catchError');
const db            = require('../../../lib/modules/database');
const { Document }  = require('../models');
const { promisify } = require('util');
const types         = require('./types');

module.exports = async (req, res, next) => {

  // Check type
  const type = types[req.params.type];
  if (!type) return res.error.badRequest(`Invalid CV type.`);

  // Retrieve the counter document
  const counterURL = db.getDocURL(`counter`);
  const counterDoc = await db.get(counterURL).catch(catchError(req, res, next));

  // Recursively increments counter and checks that new CVID doesn't already exist
  const increment = async () => {

    // Increment counter
    counterDoc.counter++;

    // Create query for doc with new CVID
    const query = `
      SELECT * FROM c
      WHERE (
        c.type = "${type}"
        AND c.cvid = "${counterDoc.counter}"
        AND (
          (NOT IS_DEFINED(c.ttl))
          OR c.ttl < 1
        )
      )
    `;

    // Check whether doc with new CVID already exists
    const iterator      = db.query(db.coll, query, { maxItemCount: 1 });
    const toArray       = promisify(iterator.toArray).bind(iterator);
    const [existingDoc] = await toArray().catch(catchError(req, res, next));

    // If doc exists, increment and check again
    if (existingDoc) increment();

  };

  // Increment counter
  increment();

  // Upsert counter doc with CVID incremented
  const counterResponse = await db.upsert(counterDoc).catch(catchError(req, res, next));

  // Create a new document
  const doc = new Document({
    cvid: counterResponse.counter,
    type,
  });

  // Add new document to database
  const docResponse = await db.add(doc).catch(catchError(req, res, next));

  // Reload the page
  if (docResponse) res.redirect(`/admin/${req.params.type}/${docResponse.cvid}`);

};
