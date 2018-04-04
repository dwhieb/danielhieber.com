/**
 * This script creates attachments for each CV item
 * @name createAttachments.js
 */

/* eslint-disable
  no-console,
  no-underscore-dangle,
  wrap-iife,
*/

process.env.NODE_ENV = `localhost`;

// Modules
const { promisify } = require('util');
const { unlink }    = require('fs');
const uuid          = require('uuid/v4');

const {
  database: db,
  storage,
} = require('../lib/modules');

// Promisify
const rm = promisify(unlink);

// Constants
const container = `publications`;
const baseURL   = `https://danielhieber.blob.core.windows.net/${container}`;

const typesToUpload = [
  `abstract`,
  `handout`,
  `pdf`,
  `poster`,
  `slides`,
];

// Methods
const createAttachment = (docLink, key, fileType, media) => db.createAttachment(docLink, {
  contentType: `application/pdf`,
  fileType,
  id: uuid(),
  key,
  media,
});

const deleteBlob = filename => storage.deleteBlobIfExists(container, filename, { deleteSnapshots: `include` });

const deleteFiles = fileList => Promise.all(fileList.map(deleteBlob));

const getAttachments = docLink => {
  const iterator = db.getAttachments(docLink);
  const toArray  = promisify(iterator.toArray).bind(iterator);
  return toArray();
};

// NB: This needs to follow getAttachments
const attachFiles = async doc => {

  const attachments       = await getAttachments(doc._self);
  const fileTypes         = Object.keys(doc.links);
  const attachmentTypes   = attachments.map(({ fileType }) => fileType);
  const fileTypesToAttach = fileTypes
  .filter(fileType => typesToUpload.includes(fileType))
  .filter(fileType => !attachmentTypes.includes(fileType));

  // add a link for each attachment
  attachments.forEach(({ fileType, key }) => {
    const fileURL = `${baseURL}/${key}/${fileType}.pdf`;
    // eslint-disable-next-line no-param-reassign
    doc.links[fileType] = fileURL;
  });

  // create an attachment for any links that don't have one yet
  return Promise.all(fileTypesToAttach.map(fileType => createAttachment(
    doc._self,
    doc.key,
    fileType,
    doc.links[fileType]
  )));

};

const getDocs = () => {

  const query = `
    SELECT * FROM c
    WHERE c.type = "publication"
  `;

  const iterator = db.query(query);
  const toArray  = promisify(iterator.toArray).bind(iterator);
  return toArray();

};

const getFile = async (filename, doc) => {

  try {
    await storage.getBlobToFile(container, filename, `temp/${filename}`);
  } catch (e) {
    // eslint-disable-next-line no-param-reassign
    if (e.statusCode === 404) return delete doc.files[filename];
    throw e;
  }

};

const getFiles = doc => Promise.all(Object.keys(doc.files).map(filename => getFile(filename, doc)));

const getTestDoc = () => db.get(`dbs/aGd0AA==/colls/aGd0AIBiWAA=/docs/aGd0AIBiWAB9CgAAAAAAAA==/`);

const uploadFile = async (key, fileType, originalFile) => {
  const blobName        = `${key}/${fileType}.pdf`;
  const localFile       = `temp/${originalFile}`;
  const metadata        = { fileType, key };
  const contentSettings = { contentType: `application/pdf` };
  const opts            = { contentSettings, metadata };
  await storage.uploadLocalFile(container, blobName, localFile, opts);
  await rm(localFile);
};

const uploadFiles = ({ files, key, links }) => Promise.all(Object.entries(links).map(async ([fileType, url]) => {

  const match = Object.entries(files).filter(([, val]) => val === url)[0];

  if (!match) return;

  const [filename] = match;

  await uploadFile(key, fileType, filename);

  // eslint-disable-next-line no-param-reassign
  links[fileType] = `https://danielhieber.blob.core.windows.net/publications/${key}/${fileType}.pdf`;

}));

// Top-level script for a document
const processDoc = async doc => {

  console.log(`\n -- Starting: ${doc.title} (${doc.id})`);

  await getFiles(doc);
  await uploadFiles(doc);
  await attachFiles(doc);
  doc.processed = true; // eslint-disable-line no-param-reassign
  const res = db.upsert(doc);

  console.log(` -- Finished: ${doc.title} (${doc.id})`);

  return res;

};

// Top-Level Script
void async function run() {

  const docs = await getDocs();
  const unprocessedDocs = docs.filter(doc => !doc.processed);

  for (const doc of unprocessedDocs) {
    // eslint-disable-next-line no-await-in-loop
    await processDoc(doc);
  }

}();
