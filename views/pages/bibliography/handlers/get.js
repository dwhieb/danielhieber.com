/**
 * GET handler for the Bibliography page
 */

/* eslint-disable
  camelcase,
*/

const { db, mendeley }  = require('../../../../services');
const { getDateString } = require('../../../../utilities');

module.exports = async (req, res, next) => {

  // Retrieve bibliography from database
  const bibliography = await db.getByKey(req.params.bibliography.toLowerCase());

  // Return 404 page if bibliography does not exist
  if (!bibliography) return next();

  // Get Mendeley references for that bibliography
  let references = await mendeley.getReferences(bibliography.mendeleyID);

  // Filter for references that have been read
  references = references.filter(ref => ref.read);

  // Display references using details / summary
  references.forEach(ref => {
    ref.details = true; // eslint-disable-line no-param-reassign
  });

  // Get most recent modified date
  const latestModified = references
  .reduce((latest, { last_modified }) => (last_modified >= latest ? last_modified : latest), ``);

  // Get date string from most recent modified date
  const lastUpdated = getDateString(latestModified);

  // Render the bibliography page
  res.render(`bibliography`, {
    bibliographies: true,
    bibliography,
    id:             `bibliography`,
    lastUpdated,
    pageTitle:      `${bibliography.title}: A bibliography`,
    references,
  });

};
