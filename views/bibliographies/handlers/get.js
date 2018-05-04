/**
 * GET handler for Bibliographies page
 */

module.exports = (req, res) => {

  res.render(`bibliographies`, {
    bibliographies: true,
    id:             `bibliographies`,
    pageTitle:      `Bibliographies`,
  });

};
