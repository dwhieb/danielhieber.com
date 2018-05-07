/**
 * Configuration, initialization, and abstraction over the CosmosDB database
 */

/* eslint-disable
  func-style,
  no-use-before-define,
 */

const { dbURL, dbKey }   = require('../config');
const { DocumentClient } = require('documentdb');
const { promisify }      = require('util');


// Initialize database client
const db = new DocumentClient(dbURL, { masterKey: dbKey });


// Constants
const coll     = `dbs/danielhieber/colls/danielhieber`; // collection URL
const oneMonth = 2628000;                               // one month in seconds


// Promisify database methods
const createAttachment = promisify(db.createAttachment).bind(db);
const deleteAttachment = promisify(db.deleteAttachment).bind(db);
const getAttachments   = db.readAttachments.bind(db);
const readDocument     = promisify(db.readDocument).bind(db);


// METHODS

// Add a new document to the database
function add(...args) {
  return promisify(db.createDocument).bind(db)(coll, ...args);
}

// Takes a DocumentDB error and extracts its useful properties
function convertError(err) {

  const headers    = {};
  const message    = err.error_description || err.message;
  const statusCode = Number(err.status || err.code);

  if (err.status === 429 && err.retryAfter) headers[`Retry-After`] = err.retryAfter / 1000;

  return {
    headers,
    message,
    statusCode,
  };

}

// Delete a document (by setting TTL)
async function del(id) {

  // Retrieve doc by ID
  const docURL = getDocURL(id);
  const doc    = await readDocument(docURL);

  // Set TTL on doc
  doc.ttl = oneMonth;

  // Upsert doc
  await upsertDocument(doc);

}

// Get the URL for a document from its ID
function getDocURL(id) {
  return `${coll}/docs/${id}`;
}

// Query documents
function queryDocuments(...args) {
  return db.queryDocuments.bind(db)(coll, ...args);
}

// Fetch all the documents from the database
function readDocuments(...args) {
  return db.readDocuments.bind(db)(coll, ...args);
}

// Upsert an attachment to a document
function upsertAttachment(...args) {
  return promisify(db.upsertAttachment).bind(db)(...args);
}

// Upsert a document
function upsertDocument(...args) {
  return promisify(db.upsertDocument).bind(db)(coll, ...args);
}

module.exports = new Proxy(db, {
  get(target, prop) {
    switch (prop) {
      case `add`: return add;
      case `coll`: return coll;
      case `convertError`: return convertError;
      case `createAttachment`: return createAttachment;
      case `delete`: return del;
      case `deleteAttachment`: return deleteAttachment;
      case `get`: return readDocument;
      case `getDocs`: return readDocuments;
      case `getAttachments`: return getAttachments;
      case `getDocURL`: return getDocURL;
      case `query`: return queryDocuments;
      case `upsert`: return upsertDocument;
      case `upsertAttachment`: return upsertAttachment;
      default: return target[prop];
    }
  },
});
