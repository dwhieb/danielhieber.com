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

// Create a new attachment for a document
const createAttachment = promisify(db.createAttachment).bind(db);

// Delete an attachment from a document
const deleteAttachment = promisify(db.deleteAttachment).bind(db);

// Get attachments for a document
const getAttachments = db.readAttachments.bind(db);

// Get the URL for a document from its ID
const getDocURL = id => `${coll}/docs/${id}`;

// Query documents
const queryDocuments = (...args) => db.queryDocuments.bind(db)(coll, ...args);

// Fetch a document from the database
const readDocument = promisify(db.readDocument).bind(db);

// Upsert an attachment to a document
const upsertAttachment = (...args) => promisify(db.upsertAttachment).bind(db)(...args);

// Upsert a document
const upsertDocument = (...args) => promisify(db.upsertDocument).bind(db)(coll, ...args);

module.exports = new Proxy(db, {
  get(target, prop) {
    switch (prop) {
      case `add`: return add;
      case `coll`: return coll;
      case `convertError`: return convertError;
      case `createAttachment`: return createAttachment;
      case `deleteAttachment`: return deleteAttachment;
      case `get`: return readDocument;
      case `getAttachments`: return getAttachments;
      case `getDocURL`: return getDocURL;
      case `query`: return queryDocuments;
      case `upsert`: return upsertDocument;
      case `upsertAttachment`: return upsertAttachment;
      default: return target[prop];
    }
  },
});
