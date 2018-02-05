const db = require('../../lib/modules/db');
const { promisify } = require('util');

const types = {
  awards:        `award`,
  categories:    `category`,
  courses:       `course`,
  education:     `education`,
  fieldwork:     `fieldwork`,
  languages:     `language`,
  media:         `media`,
  memberships:   `membership`,
  proficiencies: `proficiency`,
  publications:  `publication`,
  references:    `reference`,
  service:       `service`,
  work:          `work`,
};

module.exports = (req, res, next) => {

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

  const iterator = db.queryDocuments(db.coll, query);
  const toArray  = promisify(iterator.toArray).bind(iterator);

  // Process docs

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  const compare = (a, b) => {
    if (a < b) return -1;
    if (a > b) return +1;
    return 0;
  };

  const sortDocs = docs => docs.sort((a, b) => {
    return compare(a.title, b.title)
    || compare(a.name, b.name)
    || compare(a.organization, b.organization)
    || compare(a.location, b.location);
  });

  // Render page

  const render = docs => res.render(`editor`, {
    admin:     true,
    csrf:      req.csrfToken(),
    docs,
    editor:    true,
    header:    false,
    id:        `editor`,
    pageTitle: `Editor`,
    type:      req.params.type,
    Type:      capitalize(req.params.type),
    types,
  });

  // Handle DocumentDB errors

  const convertError = err => {

    if (err instanceof Error) throw err;

    const headers    = {};
    const message    = err.error_description || err.message;
    const statusCode = Number(err.status || err.code);

    if (err.status === 429 && err.retryAfter) headers[`Retry-After`] = err.retryAfter / 1000;

    res.error(message, { statusCode }, headers);

  };

  toArray()
  .then(sortDocs)
  .then(render)
  .catch(convertError);

};
