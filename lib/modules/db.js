const { dbURL, dbKey }   = require('../config');
const { DocumentClient } = require('documentdb');

const db = new DocumentClient(dbURL, { masterKey: dbKey });

db.coll = `dbs/danielhieber/colls/danielhieber`;

db.convertError = err => {

  const headers    = {};
  const message    = err.error_description || err.message;
  const statusCode = Number(err.status || err.code);

  if (err.status === 429 && err.retryAfter) headers[`Retry-After`] = err.retryAfter / 1000;

  return {
    headers,
    message,
    statusCode,
  };

};

module.exports = db;
