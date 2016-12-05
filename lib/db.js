const documentdb = require('documentdb');

// initialize Azure DocumentDB
const dbKey = process.env.DOCUMENTDB_KEY;
const dbUrl = process.env.DOCUMENTDB_URL;
const db = new documentdb.DocumentClient(dbUrl, { masterKey: dbKey });

db.coll = 'dbs/danielhieber/colls/danielhieber';

module.exports = db;
