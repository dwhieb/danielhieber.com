/**
 * DELETE handler for the CV Editor page
 */

const { catchError } = require('../../../../utilities');
const { db }         = require('../../../../services');

module.exports = async (req, res, next) => {

  // Delete document (by setting TTL)
  try {
    await db.delete(req.body.id);
  } catch (e) {
    return catchError(req, res, next)(e);
  }

  // Redirect to list of docs for that type
  res.redirect(`/admin/${req.params.type}`);

};
