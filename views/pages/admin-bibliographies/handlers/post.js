/**
 * POST handler for the Bibliographies Editor
 * Adds a new bibliography to the database
 */

const { Bibliography } = require('../lib');
const { catchError }   = require('../../../../utilities');
const { db }           = require('../../../../services');

module.exports = async (req, res, next) => {

  // Create a new document
  const model = new Bibliography({
    description: ``,
    key:         `key`,
    title:       `{ New Bibliography }`,
    type:        `bibliography`,
  });

  // Add new document to database
  let doc;

  try {
    doc = await db.add(model);
  } catch (e) {
    return catchError(req, res, next)(e);
  }

  // Reload the page
  res.redirect(`/admin/bibliographies/${doc.id}`);

};
