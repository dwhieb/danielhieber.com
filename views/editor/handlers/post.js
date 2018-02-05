const db       = require('../../../lib/modules/database');
const Document = require('../model');
const types    = require('./types');

module.exports = async (req, res) => {

  const type = types[req.params.type];

  if (!type) return res.badRequest(`Invalid CV type.`);

  // Retrieve the counter document
  const counterURL = db.getDocURL(`counter`);
  const counterDoc = await db.get(counterURL);

  // Increment counter and re-upsert it
  counterDoc.counter++;
  const counterResponse = await db.upsert(counterDoc);

  // Create a new document
  const doc = new Document({
    cvid: counterResponse.counter,
    type,
  });

  // Add new document to database
  const docResponse = await db.add(doc);

  // Reload the page
  res.redirect(`/admin/${req.params.type}/${docResponse.cvid}`);

};
