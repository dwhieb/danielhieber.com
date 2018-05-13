/**
 * GET handler for Bibliographies page
 */

/* eslint-disable
  no-param-reassign,
*/

const { db }      = require('../../../services');
const { compare } = require('../../../utilities');

module.exports = async (req, res) => {

  const items = await db.getByType(`bibliography`);

  items.forEach(bib => {
    bib.link = `/bibliographies/${bib.key}`;
  });

  items.sort((a, b) => compare(a.title, b.title));

  res.render(`bibliographies`, {
    bibliographies: true,
    id:             `bibliographies`,
    items,
    pageTitle:      `Bibliographies`,
  });

};
