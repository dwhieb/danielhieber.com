/**
 * GET handler for Bibliographies Editor
 * Handles GET requests to both collection and item
 */

const { compare } = require('../../../../utilities');
const { db }      = require('../../../../services');

module.exports = async (req, res) => {

  // Retrieve bibliographies from database
  const bibliographies = await db.getByType(`bibliography`);

  // Sort bibliographies by title
  bibliographies.sort((a, b) => compare(a.title, b.title));

  // Construct context for Handlebars template
  const context = {
    admin:                  true,
    'admin-bibliographies': true,
    bibliographies,
    csrf:                   req.csrfToken(),
    header:                 false,
    id:                     `admin-bibliographies`,
    pageTitle:              `Bibliographies Editor`,
  };

  if (req.params.bibliography) {
    context.bibliography = bibliographies.find(bib => bib.id === req.params.bibliography);
  }

  // Render page
  res.render(`admin-bibliographies`, context);

};
