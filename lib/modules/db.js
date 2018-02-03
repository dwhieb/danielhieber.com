const { dbURL, dbKey }   = require('../config');
const { DocumentClient } = require('documentdb');

const db = new DocumentClient(dbURL, { masterKey: dbKey });

db.coll  = `dbs/danielhieber/colls/danielhieber`;

module.exports = db;
