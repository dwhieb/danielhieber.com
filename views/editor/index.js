/**
 * The route handler for the Editor page
 * @name editor/index.js
 */

const db = require('../../lib/modules/db');

module.exports = async (req, res) => {

  res.render(`editor`, {
    admin:     true,
    editor:    true,
    header:    false,
    id:        `editor`,
    pageTitle: `Editor`,
    type:      req.params.type,
  });

};
