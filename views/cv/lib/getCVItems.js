/**
 * Retrieves all CV items from the database
 */

const { db }        = require('../../../services');
const { promisify } = require('util');

module.exports = () => {

  const query = `
    SELECT * FROM doc
    WHERE
      IS_DEFINED(doc.cvid)
      AND (
        doc.hidden = false
        OR NOT IS_DEFINED(doc.hidden)
      )
      AND (
        doc.ttl < 1
        OR NOT IS_DEFINED(doc.ttl)
      )
  `;

  const iterator = db.query(query);
  const toArray  = promisify(iterator.toArray).bind(iterator);
  return toArray();

};
