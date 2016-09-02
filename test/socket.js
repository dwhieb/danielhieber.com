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
      ttl: 300,
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
      ttl: 300,
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

  it('getCategories', function getCategories(done) {
    this.socket.emit('getCategories', (err, res) => {
      if (err) fail(JSON.stringify(err, null, 2));
      expect(Array.isArray(res)).toBe(true);
      expect(res.length > 0).toBe(true);
      done();
    });
  });

  it('updateCategory', function updateCategory(done) {

    const cat = {
      id: 'updatecategory',
      name: 'Update Category',
      description: 'Test for the `updateCategory` event.',
      ttl: 300,
    };

    db.upsertDocument(coll, cat, err => {
      if (err) fail(err.body);

      cat.name = 'Updated Category';

      this.socket.emit('updateCategory', cat, (err, res) => {
        if (err) fail(JSON.stringify(err, null, 2));
        expect(res.name).toBe(cat.name);

        db.readDocument(`${coll}/docs/${cat.id}`, (err, res) => {
          if (err) fail(err.body);
          expect(res.name).toBe(cat.name);
          done();
        });
      });

    });

  });

  it("won't save bad category data", function badCategoryData(done) {

    const cat1 = {
      id: 'extraproperty',
      name: 'Extra Property',
      description: 'Test for the `updateCategory` event.',
      ttl: 300,
      extraProperty: true,
    };

    const cat2 = {
      id: 'wrongtype',
      name: 'Wrong Type',
      description: 'Test for the `updateCategory` event.',
      ttl: 300,
      type: 'not-category',
    };

    const cat3 = {
      id: 'badID',
      name: 'Bad ID',
      description: 'Test for the `updateCategory` event.',
      ttl: 300,
    };

    this.socket.emit('addCategory', cat1, (err, res) => {
      if (res) fail(JSON.stringify(res, null, 2));
      expect(err.status).toBe(400);

      this.socket.emit('addCategory', cat2, (err, res) => {
        if (res) fail(JSON.stringify(res, null, 2));
        expect(err.status).toBe(400);

        this.socket.emit('addCategory', cat3, (err, res) => {
          if (res) fail(JSON.stringify(res, null, 2));
          expect(err.status).toBe(400);
          done();
        });

      });

    });

  });

});