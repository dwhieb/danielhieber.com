/**
 * The route handler for the Editor page
 * @name editor/index.js
 */

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

  const sortDocs = docs => docs.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return +1;
    return 0;
  });

  const render = docs => res.render(`editor`, {
    admin:     true,
    docs,
    editor:    true,
    header:    false,
    id:        `editor`,
    pageTitle: `Editor`,
    type:      req.params.type,
  });

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
