const { dbURL, dbKey }   = require('../config');
const { DocumentClient } = require('documentdb');
const { promisify }      = require('util');

const db = new DocumentClient(dbURL, { masterKey: dbKey });

db.coll  = `dbs/danielhieber/colls/danielhieber`;
db.query = promisify(db.queryDocuments).bind(db);

module.exports = db;
