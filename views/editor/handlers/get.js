const catchError    = require('./catchError');
const db            = require('../../../lib/modules/database');
const { promisify } = require('util');
const types         = require('./types');

const {
  capitalize,
  compare,
} = require('../../../lib/utilities');

module.exports = async (req, res, next) => {

  // Retrieve docs

  const type = types[req.params.type];

  if (!type) return next();

  const query = `
    SELECT * FROM c
    WHERE (
      c.type="${type}"
      AND (
        (NOT IS_DEFINED(c.ttl))
        OR c.ttl < 1
      )
    )
  `;

  const iterator = db.query(db.coll, query);
  const toArray  = promisify(iterator.toArray).bind(iterator);
  const docs     = await toArray().catch(catchError(req, res, next));

  // Set current doc

  const { cvid } = req.params;

  const doc = docs.find(d => d.cvid === Number(cvid));
  if (!doc) return next();

  // Sort docs

  docs.sort((a, b) => compare(a.title, b.title)
  || compare(a.name, b.name)
  || compare(a.organization, b.organization)
  || compare(a.location, b.location));

  // Render page

  res.render(`editor`, {
    admin:     true,
    csrf:      req.csrfToken(),
    doc,
    docs,
    header:    false,
    id:        `editor`,
    pageTitle: `Editor`,
    type:      req.params.type,
    Type:      capitalize(req.params.type),
    types,
  });

};
