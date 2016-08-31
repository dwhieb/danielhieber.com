/* eslint-disable max-nested-callbacks */
require('../app');
const documentdb = require('documentdb');
const io = require('socket.io-client');

const coll = 'dbs/danielhieber/colls/danielhieber';
const dbUrl = process.env.DOCUMENTDB_URL;
const dbKey = process.env.DOCUMENTDB_KEY;

const db = new documentdb.DocumentClient(dbUrl, { masterKey: dbKey });

const options = {
  transports: ['websocket', 'xhr-polling'],
};

describe('socket', function test() {

  beforeAll(function before(done) {
    this.socket = io('http://localhost:3000', options);
    done();
  });

  it('sends gallery image list on connection', function connect(done) {
    this.socket.on('gallery', data => {
      expect(Array.isArray(data)).toBe(true);
      expect(data.includes('cypress_trees.jpg')).toBe(true);
      done();
    });
  });

  it('addCategory', function addCategory(done) {

    const cat = {
      id: 'addcategory',
      name: 'Add Category',
      description: 'Test for the `addCategory` event.',
      type: 'category-test',
      ttl: 10,
    };

    db.deleteDocument(`${coll}/docs/${cat.id}`, err => {
      if (err && err.code != 404) {
        fail(err.body);
      } else {

        this.socket.emit('addCategory', cat, (err, res) => {
          if (err) fail(JSON.stringify(err, null, 2));
          expect(res.id).toBe(cat.id);
          done();
        });

      }
    });

  });

  it('deleteCategory', function deleteCategory(done) {

    const cat = {
      id: 'deletecategory',
      name: 'Delete Category',
      description: 'Test for the `deleteCategory` event.',
      type: 'category-test',
    };

    db.createDocument(coll, cat, err => {
      if (err) fail(err.body);

      this.socket.emit('deleteCategory', cat.id, (err, res) => {
        if (err) fail(JSON.stringify(err, null, 2));
        expect(res.status).toBe(201);

        db.deleteDocument(`${coll}/docs/${cat.id}`, err => {
          if (err && err.code != 404) fail(err.body);
          done();
        });

      });

    });

  });

  xit('getCategories', function getCategories(done) {
    this.socket.emit('getCategories');
  });

  xit('updateCategory', function updateCategory(done) {
    // TODO: add a category to the database
    this.socket.emit('updateCategory');
    // TODO: retrieve the category from the database and check that it has been updated
  });

});
