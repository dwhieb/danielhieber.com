/**
 * GET handler for the Bibliography page
 */

const { db, mendeley } = require('../../../services');

module.exports = async (req, res, next) => {

  // Retrieve bibliography from database
  const bibliography = await db.getByKey(req.params.bibliography.toLowerCase());

  // Return 404 page if bibliography does not exist
  if (!bibliography) return next();

  // Get Mendeley references for that bibliography
  const references = await mendeley.getReferences(bibliography.mendeleyID);

  // Render the bibliography page
  res.render(`bibliography`, {
    bibliographies: true,
    bibliography,
    id:             `bibliography`,
    pageTitle:      `${bibliography.title}: A bibliography`,
    references,
  });

};
