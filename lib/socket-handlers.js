/* eslint-disable no-console */
const codes = require('../public/data/codes.json');
const documentdb = require('documentdb');
const fs = require('fs');
const path = require('path');
const models = require('../models/index');

// delcare models
const Category = models.Category;

const collLink = 'dbs/danielhieber/colls/danielhieber';
const dbKey = process.env.DOCUMENTDB_KEY;
const dbUrl = process.env.DOCUMENTDB_URL;

const db = new documentdb.DocumentClient(dbUrl, { masterKey: dbKey });

const createError = (err, args) => {

  console.error(err);

  let error;

  switch (err.code) {
    case codes.conflict:
      error = 'ID already exists.'; break;
    case codes.deleted:
      error = `Category with ID ${args[0]} successfully deleted.`; break;
    case codes.notFound:
      error = `No category with ID '${args[0]}' exists.`; break;
    case codes.tooLarge:
      error = 'The data is too large to store.'; break;
    default:
      error = 'Unknown server error.';
  }

  return {
    status: error.code || codes.serverError,
    error,
  };
};

const runCallback = (cb, ...args) => {
  if (typeof cb === 'function') return cb(...args);
};

const sendResponse = (err, res, cb) => {
  if (err) runCallback(cb, createError(err));
  else runCallback(cb, null, res);
};

// Runs when client connects
exports.connect = socket => {

  /**
   * Gets the list of images from the /gallery folder
   * @return {Promise} Resolves to the list of filenames.
   */
  const getImageList = () => new Promise((resolve, reject) => {

    const galleryPath = path.join(__dirname, '../public/img/gallery');

    fs.readdir(galleryPath, 'utf8', (err, filenames) => {
      if (err) reject(err);
      resolve(filenames);
    });
  });

  // send the list of files in the /gallery folder to the client

  /**
   * Send the list of files in the /gallery folder to the client via websocket
   * @param  {Array} images The array of filenames
   * @return {undefined} No return
   */
  const sendImageList = images => socket.emit('gallery', images);

  getImageList()
  .then(images => sendImageList(images))
  .catch(() => sendImageList([]));

};

exports.addCategory = (data, cb) => {

  let category;

  try {
    category = new Category(data);
  } catch (err) {
    runCallback(cb, {
      status: 400,
      error: err.message,
    });
  }

  if (category) {
    db.createDocument(collLink, category, (err, res) => sendResponse(err, res, cb));
  }

};

exports.deleteCategory = (category, cb) => {
  db.deleteDocument(`${collLink}/docs/${category}`, (err, res, headers) => {

    if (err) {

      runCallback(cb, createError(err, [category]));

    } else if (headers.statusCode == codes.deleted) {

      runCallback(cb, {
        status: codes.deleted,
        details: `Category with ID ${category} successfully deleted.`,
      });

    } else {

      runCallback(cb, createError({ code: codes.serverError }));

    }

  });
};

exports.getCategories = cb => {

  const query = 'SELECT * FROM danielhieber WHERE danielhieber.type = "category"';

  db.queryDocuments(collLink, query).toArray((err, res) => sendResponse(err, res, cb));
};

exports.updateCategory = (data, cb) => {

  let category;

  try {
    category = new Category(data);
  } catch (err) {
    runCallback(cb, {
      status: 400,
      error: err.message,
    });
  }

  if (category) {
    db.upsertDocument(collLink, category, (err, res) => sendResponse(err, res, cb));
  }

};
