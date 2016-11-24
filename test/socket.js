/* global socket */

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

  const data = {
    id: 'test',
    ttl: 300,
    type: 'document',
  };

  beforeAll(function before(done) {
    socket = io('http://localhost:3000', options); // eslint-disable-line
    done();
  });

  it('connect', function connect(done) {
    socket.on('gallery', data => {
      expect(Array.isArray(data)).toBe(true);
      expect(data.includes('cypress_trees.jpg')).toBe(true);
      done();
    });
  });

  it('handleError', function handleError() {
    socket.on('error', err => fail(err));
  });

  it('pretrigger: "type"', function pretriggerType(done) {

    const testData = {
      ttl: 300,
      id: 'type-pretrigger-test',
    };

    db.deleteDocument(`${coll}/docs/${testData.id}`, err => {
      if (err && err.code != 404) {
        fail(err.body);
        done();
      } else {
        socket.emit('add', testData, (err, res) => {
          if (res) {
            fail(res);
            done();
          } else {
            expect(err).toBeDefined();
            done();
          }
        });
      }
    });

  });

  it('add', function addItem(done) {

    const testData = Object.assign({}, data);
    testData.id = 'addtest';

    db.deleteDocument(`${coll}/docs/${testData.id}`, err => {
      if (err && err.code != 404) {
        fail(err.body);
        done();
      } else {
        socket.emit('add', testData, (err, res) => {
          if (err) {
            fail(JSON.stringify(err, null, 2));
            done();
          } else {
            expect(res.id).toBe(testData.id);
            done();
          }
        });
      }
    });

  });

  it('delete (by ID)', function deleteItem(done) {

    const testData = Object.assign({}, data);
    testData.id = 'deletebyid';

    db.upsertDocument(coll, testData, err => {
      if (err) {
        fail(err.body);
        done();
      } else {
        socket.emit('delete', testData.id, (err, res) => {
          if (err) {
            fail(JSON.stringify(err, null, 2));
            done();
          } else {
            expect(res.code).toBe(204);
            db.deleteDocument(`${coll}/docs/${testData.id}`, err => {
              if (err && err.code != 404) fail(err.body);
              done();
            });
          }
        });
      }
    });

  });

  it('delete (by model)', function deleteItem(done) {

    const testData = Object.assign({}, data);
    testData.id = 'deletebyid';

    db.upsertDocument(coll, testData, err => {
      if (err) {
        fail(err.body);
        done();
      } else {
        socket.emit('delete', testData, (err, res) => {
          if (err) {
            fail(JSON.stringify(err, null, 2));
            done();
          } else {
            expect(res.code).toBe(204);
            db.deleteDocument(`${coll}/docs/${testData.id}`, err => {
              if (err && err.code != 404) fail(err.body);
              done();
            });
          }
        });
      }
    });

  });

  it('get (by IDs)', function getItemsByIds(done) {

    const docs = [
      { id: 'getbyid1', type: 'document', ttl: 300 },
      { id: 'getbyid2', type: 'document', ttl: 300 },
      { id: 'getbyid3', type: 'document', ttl: 300 },
    ];

    const upsert = doc => new Promise((resolve, reject) => {
      db.upsertDocument(coll, doc, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });

    Promise.all(docs.map(upsert))
    .then(() => {

      const ids = docs.map(doc => doc.id);

      socket.emit('get', ids, (err, res) => {
        if (err) fail(JSON.stringify(err, null, 2));
        else expect(res.length).toBe(3);
        done();
      });

    })
    .catch(err => fail(JSON.stringify(err, null, 2)));

  });

  it('get (by models)', function getItemsByModels(done) {

    const docs = [
      { id: 'getbymodel1', type: 'document', ttl: 300 },
      { id: 'getbymodel2', type: 'document', ttl: 300 },
      { id: 'getbymodel3', type: 'document', ttl: 300 },
    ];

    const upsert = doc => new Promise((resolve, reject) => {
      db.upsertDocument(coll, doc, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });

    Promise.all(docs.map(upsert))
    .then(() => {
      socket.emit('get', docs, (err, res) => {
        if (err) fail(JSON.stringify(err, null, 2));
        else expect(res.length).toBe(3);
        done();
      });
    })
    .catch(err => fail(JSON.stringify(err, null, 2)));

  });

  it('getAll', function getAll(done) {

    const docs = [
      { id: 'getall1', type: 'document' },
      { id: 'getall2', type: 'document' },
      { id: 'getall3', type: 'document' },
    ];
    const ids = docs.map(doc => doc.id);

    const upsert = doc => new Promise((resolve, reject) => {
      db.upsertDocument(coll, doc, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });

    Promise.all(docs.map(upsert))
    .then(() => {
      socket.emit('getAll', 'document', (err, res) => {
        if (err) {
          fail(JSON.stringify(err, null, 2));
          socket.emit('delete', ids);
          done();
        } else {
          const resIds = res.map(doc => doc.id);
          expect(resIds.includes(docs[0].id)).toBe(true);
          expect(resIds.includes(docs[1].id)).toBe(true);
          expect(resIds.includes(docs[2].id)).toBe(true);
          socket.emit('delete', ids);
          done();
        }
      });
    })
    .catch(err => fail(JSON.stringify(err, null, 2)));

  });

  it('update', function updateItem(done) {

    const testData = Object.assign({}, data);
    testData.id = 'updatetest';

    db.upsertDocument(coll, testData, err => {
      if (err) {
        fail(err.body);
        done();
      } else {
        testData.newProperty = 'new property';
        socket.emit('update', testData, (err, res) => {
          if (err) {
            fail(JSON.stringify(err, null, 2));
            done();
          } else {
            expect(res.newProperty).toBe(testData.newProperty);
            done();
          }
        });
      }
    });

  });

  it('error', function errorTest(done) {

    const doc = {};

    socket.emit('add', doc, (err, res) => {
      if (err) {
        expect(err.code).toBe(400);
        done();
      } else {
        fail(JSON.stringify(res, null, 2));
        done();
      }
    });

  });

});
