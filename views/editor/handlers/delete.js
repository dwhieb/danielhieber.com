const catchError = require('./catchError');
const { database: db } = require('../../../lib/modules');

module.exports = async (req, res, next) => {

  const oneMonth = 2628000; // one month in seconds
  let doc;

  // Retrieve doc by ID
  try {

    const docURL = db.getDocURL(req.body.id);
    doc = await db.get(docURL);

  } catch (e) {

    return catchError(req, res, next)(e);

  }

  // Set TTL on doc
  doc.ttl = oneMonth;

  // Reupsert document
  try {

    await db.upsert(doc);

  } catch (e) {

    return catchError(req, res, next)(e);

  }

  // Redirect to list of docs for that type
  res.redirect(`/admin/${req.params.type}`);

};
