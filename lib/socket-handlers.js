/* eslint-disable no-console */
const documentdb = require('documentdb');
const fs = require('fs');
const path = require('path');
const models = require('../models/index');

// delcare models
const Category = models.Category;

// status codes
const conflict = 409;
const tooLarge = 413;
const serverError = 500;

const collLink = 'dbs/danielhieber/colls/danielhieber';
const dbKey = process.env.DOCUMENTDB_KEY;
const dbUrl = process.env.DOCUMENTDB_URL;

const db = new documentdb.DocumentClient(dbUrl, { masterKey: dbKey });

const runCallback = (cb, ...args) => {
  if (typeof cb === 'function') return cb(...args);
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
    runCallback(cb, err);
  }

  db.createDocument(collLink, category, (err, res) => {

    if (err) console.error(err);

    if (err && err.code == conflict) {
      runCallback(cb, {
        status: conflict,
        error: 'ID already exists.',
      });
    } else if (err && err.code == tooLarge) {
      runCallback(cb, {
        status: tooLarge,
        error: 'The data is too large to store.',
      });
    } else if (err) {
      runCallback(cb, {
        status: serverError,
        error: 'Unknown server error',
      });
    } else {
      runCallback(cb, null, res);
    }

  });

};

exports.deleteCategory = category => {};

exports.getCategories = () => {};

exports.updateCategory = () => {};
