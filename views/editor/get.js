const db            = require('../../lib/modules/db');
const { promisify } = require('util');
const types         = require('./types');

const {
  capitalize,
  compare,
} = require('../../lib/utilities');

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

  const catchError = err => {
    if (err instanceof Error) return next(err);
    const { headers, message, statusCode } = db.convertError(err);
    res.error(message, { statusCode }, headers);
  };

  const iterator = db.queryDocuments(db.coll, query);
  const toArray  = promisify(iterator.toArray).bind(iterator);
  const docs     = await toArray().catch(catchError);

  // Set current doc

  const { cvid } = req.params;

  // eslint-disable-next-line no-param-reassign
  if (cvid) res.locals.current = docs.find(doc => doc.cvid === Number(cvid));

  // Sort docs

  docs.sort((a, b) => compare(a.title, b.title)
  || compare(a.name, b.name)
  || compare(a.organization, b.organization)
  || compare(a.location, b.location));

  // Render page

  res.render(`editor`, {
    admin:     true,
    csrf:      req.csrfToken(),
    docs,
    header:    false,
    id:        `editor`,
    pageTitle: `Editor`,
    type:      req.params.type,
    Type:      capitalize(req.params.type),
    types,
  });

};
