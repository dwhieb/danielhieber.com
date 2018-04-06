const { db }        = require('../../../lib/services');
const { promisify } = require('util');

module.exports = () => {

  const query = `
    SELECT * FROM doc
    WHERE
      IS_DEFINED(doc.cvid)
      AND (NOT doc.hidden = true)
      AND (
        (NOT IS_DEFINED(doc.ttl))
        OR doc.ttl < 1
      )
  `;

  const iterator = db.query(query);
  const toArray  = promisify(iterator.toArray).bind(iterator);
  return toArray();

};
