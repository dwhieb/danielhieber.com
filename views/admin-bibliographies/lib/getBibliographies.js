/**
 * Retrieves all bibliographies from the database
 */

const { db }        = require('../../../services');
const { promisify } = require('util');

const query = `
  SELECT * FROM doc
  WHERE
    doc.type = "bibliography"
    AND (
      doc.ttl < 1
      OR NOT IS_DEFINED(doc.ttl)
    )
`;

const getBibliographies = () => {
  const iterator = db.query(query);
  const toArray  = promisify(iterator.toArray).bind(iterator);
  return toArray();
};

module.exports = getBibliographies;
