/**
 * This script performs a String replacement on each of the URLs in the "links" hash of any CV item.
 * @name editLinks.js
 */

/* eslint-disable
  max-nested-callbacks,
  no-await-in-loop,
  no-param-reassign,
*/

process.env.NODE_ENV = `localhost`;

const { db }        = require('../services');
const { promisify } = require('util');

// Fields to check
// - markdown

const regexp = /http(s):\/\/danielhieber.blob.core.windows.net/giu;
const cdn    = `https://files.danielhieber.com`;

// UTILITY METHODS

// Gets a sorted list of all fields present on documents
const getFields = docs => Array.from(docs.reduce((set, doc) => {
  Object.keys(doc).forEach(key => set.add(key));
  return set;
}, new Set)).sort();

// Perform a RegExp replacement on a string using the new URL
const updateLink = str => str.replace(regexp, cdn);

// DOCUMENT PROCESSING

// Update all the Strings in the "achievements array"
const updateAchievements = achievements => achievements.forEach((achievement, i) => {
  achievements[i] = updateLink(achievement);
});

// Update a hash containing links in the values
const updateLinksHash = hash => Object.entries(hash)
.forEach(([key, url]) => {
  hash[key] = updateLink(url);
});

void async function run() {

  const iterator = db.getDocs();
  const toArray  = promisify(iterator.toArray).bind(iterator);
  const docs     = await toArray();

  for (const doc of docs) {

    const text = JSON.stringify(doc);

    // Check for URL that needs updating
    // then perform String replacements as needed
    if (regexp.test(text)) {
      if (doc.achievements) updateAchievements(doc.achievements);
      if (doc.description) doc.description = updateLink(doc.description);
      if (doc.files) updateLinksHash(doc.files);
      if (doc.html) doc.html = updateLink(doc.html);
      if (doc.links) updateLinksHash(doc.links);
      if (doc.markdown) doc.markdown = updateLink(doc.markdown);
    }

    doc.processed = true;

    console.log(`Upserting document "${doc.title} (CVID: ${doc.cvid})"`);

    const res = await db.upsert(doc);

    const newText = JSON.stringify(res);
    if (regexp.test(newText)) console.error(res);

  }

}();
