/**
 * This script clears the `processed` attribute from any files in the database.
 * @name clearProcessed.js
 */

/* eslint-disable
  wrap-iife,
*/

process.env.NODE_ENV = `localhost`;

const { db }        = require('../services');
const { promisify } = require('util');

const clearFlag = async doc => {
  console.log(` -- Clearing flag for ${doc.id}`);
  delete doc.processed; // eslint-disable-line no-param-reassign
  const res = await db.upsert(doc);
  console.log(` -- Cleared flag for ${doc.id}`);
  return res;
};

const getProcessedDocs = () => {

  const query = `
    SELECT * FROM c
    WHERE c.processed = true
  `;

  const iterator = db.query(query);
  const toArray  = promisify(iterator.toArray).bind(iterator);
  return toArray();

};

void async function run() {
  const docs = await getProcessedDocs();
  console.log(`Clearing flags for ${docs.length} documents`);
  for (const doc of docs) await clearFlag(doc); // eslint-disable-line no-await-in-loop
  console.log(`Flag cleared for ${docs.length} documents`);
}();
