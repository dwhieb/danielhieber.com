const { db }        = require('../../../lib/services');
const { promisify } = require('util');

module.exports = () => {

  const query = `
    SELECT * FROM doc
    WHERE
      doc.type = "category"
      AND (
        doc.ttl < 1
        OR NOT IS_DEFINED(doc.ttl)
      )
  `;

  const iterator = db.query(query);
  const toArray  = promisify(iterator.toArray).bind(iterator);
  return toArray();

};
