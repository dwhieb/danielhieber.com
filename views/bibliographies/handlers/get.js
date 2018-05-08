/**
 * GET handler for Bibliographies page
 */

/* eslint-disable
  no-param-reassign,
*/

const { db } = require('../../../services');

module.exports = async (req, res) => {

  const items = await db.getBibliographies();

  items.forEach(bib => {
    bib.link = `/bibliographies/${bib.key}`;
  });

  res.render(`bibliographies`, {
    bibliographies: true,
    id:             `bibliographies`,
    items,
    pageTitle:      `Bibliographies`,
  });

};
