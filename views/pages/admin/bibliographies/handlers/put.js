const { Bibliography } = require('../lib');
const { catchError }   = require('../../../../../utilities');
const { db }           = require('../../../../../services');
const deleteHandler    = require('./delete');

module.exports = async (req, res, next) => {

  // Extract data
  // eslint-disable-next-line no-unused-vars
  const { _csrf, deleteBibliography, ...data } = req.body;

  // Redirect to DELETE handler if delete button was clicked
  if (deleteBibliography) return deleteHandler(req, res, next);

  // Create model
  const model = new Bibliography(data);

  // Upsert document
  let doc;

  try {
    doc = await db.upsert(model);
  } catch (e) {
    return catchError(req, res, next)(e);
  }

  // Redirect to new bibliography page
  res.redirect(`/admin/bibliographies/${doc.id}`);

};
