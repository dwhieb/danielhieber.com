const config = require('../config');
const documentdb = require('documentdb');
const errors = require('../errors');
const gallery = require('../gallery');
const models = require('../../models');

// error utilities
const convertError = errors.convert;
const JsonError = errors.JsonError;

// initialize Azure DocumentDB
const dbKey = process.env.DOCUMENTDB_KEY;
const dbUrl = process.env.DOCUMENTDB_URL;
const db = new documentdb.DocumentClient(dbUrl, { masterKey: dbKey });

// retrieve list of gallery images
const images = [];
gallery().then(res => images.push(...res));

// create the whitelist hash
const whitelist = {};
const modelNames = new Set(Object.keys(models).map(name => name.toLowerCase()));
modelNames.forEach(name => { whitelist[name] = models[name].whitelist; });

module.exports = socket => {

  const runCallback = (cb, ...args) => {

    if (typeof cb === 'function') {

      cb(...args);
      return;

    } else if (typeof cb !== 'undefined') {

      const err = new JsonError(400, 'The callback parameter must be a function.');

      socket.emit('error', err);

    }

  };

  const sendResponse = (err, res, cb) => {
    if (err) runCallback(cb, convertError(err));
    runCallback(cb, null, res);
  };

  // API

  // runs when client connects
  const connect = () => {
    // send the list of files in the /gallery folder
    socket.emit('gallery', images);
  };

  /**
   * Generic error handler
   * @method handleError
   * @param  {Object} err    The error object
   * @return {void} No return
   */
  const handleError = err => socket.emit('error', convertError(err));

  /**
   * Adds an object to the database
   * @method
   * @param {Object} data         The object to add
   * @param {Function} [cb]       An optional callback
   */
  const add = (data = {}, cb) => {

    let model;

    try {
      model = new models[data.type](data);
    } catch (err) {
      runCallback(cb, new JsonError(400, err.message));
      return;
    }

    const createDocument = () => {
      db.createDocument(config.collLink, model, { preTriggerInclude: 'checkType' }, (err, res) => {

        if (err && err.code == 409) {

          const jsonError = new JsonError(409, `Item with ID "${model.id}" already exists.`);

          sendResponse(jsonError, null, cb);

        } else if (err) {

          sendResponse(convertError(err), null, cb);

        } else {

          sendResponse(null, res, cb);

        }

      });
    };

    if (models.Document.cvTypes.includes(data.type)) {
      db.readDocument(`${config.collLink}/docs/counter`, (err, res) => {
        if (err) return sendResponse(convertError(err), null, cb);
        res.counter++; // eslint-disable-line no-param-reassign
        model.cvid = res.counter;
        db.upsertDocument(config.collLink, res, (err, res) => {
          if (err) return sendResponse(convertError(err), null, cb);
          createDocument();
        });
      });
    } else {
      createDocument();
    }

  };

  /**
   * Deletes an item from the database by setting its TTL to 30 days
   * @method
   * @param {Object|String} model       The model to delete, or the ID of the model to delete
   * @param {Function} [cb]             Optional callback to run when the item is deleted
   */
  const del = (model, cb) => {

    const thirtyDays = 2592000;
    const doc = { ttl: thirtyDays };

    if (typeof model === 'string') doc.id = model;
    else if (typeof model === 'object') doc.id = model.id;

    if (doc.id) {

      const res = {
        code: 204,
        details: `Category with ID "${doc.id}" successfully deleted.`,
      };

      const sprocLink = `${config.collLink}/sprocs/partialUpdate`;

      db.executeStoredProcedure(sprocLink, [doc], err => sendResponse(err, res, cb));

    } else {

      const jsonError = new JsonError(400, `The "model" argument must be a data object with an "id" attribute, or a string containing an ID.`);

      sendResponse(jsonError, null, cb);

    }

  };

  /**
   * Retrieve one or more documents by ID. May pass object, an array of objects, an ID, or an array of IDs.
   * @method
   * @param  {docs}   docs An object, array of objects, ID, or array of IDs to delete.
   * @param  {Function} cb   The callback function to run.
   * @return {void} No return
   */
  const get = (docs, cb) => {

    if (!docs) {
      const jsonError = new JsonError(400, 'The "docs" argument is required.');
      return sendResponse(jsonError, null, cb);
    }

    const items = Array.isArray(docs) ? docs : [docs];

    const haveIds = items.every(item => {
      return typeof item === 'string'
        || (typeof item === 'object'
        && typeof item.id === 'string');
    });

    if (haveIds) {

      const results = [];

      // Retrieves a document by ID and adds it to the results array. Returns a Promise.
      // Errors are also added to the array.
      const readDocument = id => new Promise((resolve, reject) => {

        const docLink = `${config.collLink}/docs/${id}`;

        try {

          db.readDocument(docLink, (err, res) => {
            if (err) {

              if (err.code == 404) {
                const jsonError = new JsonError(404, `Document with ID "${id}" not found.`);
                jsonError.id = id;
                results.push(jsonError);
                resolve();
              } else {
                const jsonError = convertError(err);
                jsonError.id = id;
                results.push(jsonError);
                resolve();
              }

            } else {

              results.push(res);
              resolve();

            }
          });

        } catch (err) {
          reject(err);
        }

      });

      const ids = items.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object') return item.id;
        return '';
      });

      const promises = [];

      // create a Promise for each ID to read the document
      ids.forEach(id => promises.push(readDocument(id)));

      // read all the documents
      Promise.all(promises)
      .then(() => sendResponse(null, Array.isArray(docs) ? results : results[0], cb))
      .catch(err => {
        const jsonError = convertError(err);
        sendResponse(jsonError, null, cb);
      });

    } else {

      const jsonError = new JsonError(400, 'All the items to retrieve must have IDs.');

      return sendResponse(jsonError, null, cb);

    }

  };

  /**
   * Retrieves all the items with a given "type" from the database. If no `type` argument is provided, all the database contents are returned. Items with a positive TTL set on them are not returned.
   * @param {String} [type]       The type of object to return
   * @param {Function} cb         The callback to run when the objects are retrieved
   */
  const getAll = (type, cb) => {

    // if no "type" is provided, retrieve all documents
    if (typeof type === 'function') { // checks whether first argument is the callback

      db.readDocuments(config.collLink).toArray((err, res) => sendResponse(err, res, cb));

    } else if (models.Document.types.includes(type)) {

      const query = `
        SELECT * FROM d
        WHERE (
          d.type = "${type}"
          AND (
            (NOT IS_DEFINED(d.ttl))
            OR d.ttl < 1
          )
        )`;

      db.queryDocuments(config.collLink, query).toArray((err, res) => {
        sendResponse(err, res, cb);
      });

    } else {

      const jsonError = new JsonError(400, 'The "type" argument is not a valid type.');

      sendResponse(jsonError, null, cb);

    }

  };

  // sends the whitelist hash
  const getWhitelist = cb => sendResponse(null, whitelist, cb);

  /**
   * Upserts an item to the database
   * @method
   * @param {Object} data         The item to update
   * @param {Function} [cb]         The callback function to run when complete
   */
  const update = (data = {}, cb) => {

    let model;

    try {
      model = new models[data.type](data);
    } catch (err) {
      sendResponse(new JsonError(400, err.message), null, cb);
      return;
    }

    db.upsertDocument(config.collLink, model, { preTriggerInclude: 'checkType' }, (err, res) => sendResponse(err, res, cb));

  };

  return {
    connect,
    handleError,
    add,
    delete: del,
    get,
    getAll,
    getWhitelist,
    update,
  };

};
