const { dbURL, dbKey }   = require('../config');
const { DocumentClient } = require('documentdb');
const { promisify }      = require('util');

const db = new DocumentClient(dbURL, { masterKey: dbKey });

// The URL of the collection
const coll = `dbs/danielhieber/colls/danielhieber`;

// Takes a DocumentDB error and extracts its useful properties
const convertError = err => {

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

// Add a new document to the database
const add = (...args) => promisify(db.createDocument).bind(db)(coll, ...args);

// Get the URL for a document from its ID
const getDocURL = id => `${coll}/docs/${id}`;

// Fetch a document from the database
const readDocument = promisify(db.readDocument).bind(db);

// Upsert a document
const upsertDocument = (...args) => promisify(db.upsertDocument).bind(db)(coll, ...args);

module.exports = new Proxy(db, {
  get(target, prop) {
    switch (prop) {
      case `add`: return add;
      case `coll`: return coll;
      case `convertError`: return convertError;
      case `get`: return readDocument;
      case `getDocURL`: return getDocURL;
      case `query`: return db.queryDocuments;
      case `upsert`: return upsertDocument;
      default: return target[prop];
    }
  },
});
