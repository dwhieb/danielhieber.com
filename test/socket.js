/* global socket */

/* eslint-disable max-nested-callbacks */
require('../app');
const db      = require('../lib/db');
const io      = require('socket.io-client');
const storage = require('../lib/storage');

const coll = 'dbs/danielhieber/colls/danielhieber';
const options = { transports: ['websocket', 'xhr-polling'] };

describe('socket', function test() {

  const data = {
    id: 'test',
    ttl: 300,
    type: 'test',
  };

  beforeAll(function before(done) {
    socket = io('http://localhost:3000', options); // eslint-disable-line
    done();
  });

  xit('connect', function connect(done) {
    socket.on('gallery', data => {
      expect(Array.isArray(data)).toBe(true);
      expect(data.includes('cypress_trees.jpg')).toBe(true);
      done();
    });
  });

  xit('handleError', function handleError() {
    socket.on('error', err => fail(err));
  });

  xit('pretrigger: "type"', function pretriggerType(done) {

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

  xit('increment "cvid"', function incrementcvid(done) {

    const data = {
      ttl:             300,
      type:            'publication',
      id:              'publication-test',
      date:            Date.now(),
      description:     'Test publication.',
      publicationType: 'unpublished',
      title:           'Test Publication',
    };

    db.deleteDocument(`${coll}/docs/${data.id}`, err => {
      if (err && err.code != 404) {
        fail(err.body);
        done();
      } else {
        socket.emit('add', data, (err, res) => {
          if (err) {
            fail(JSON.stringify(err, null, 2));
            done();
          } else {
            expect(res.cvid).toBeDefined();
            expect(Number.isInteger(res.cvid)).toBe(true);
            done();
          }
        });
      }
    });

  });

  xit('add', function addItem(done) {

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

  xit('delete (by ID)', function deleteItem(done) {

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

  xit('delete (by model)', function deleteItem(done) {

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

  it('deleteFile', function deleteFile(done) {

    storage.createBlockBlobFromLocalFile('publications', 'testFile.md', 'test/testFile.md', err => {
      if (err) {
        fail(JSON.stringify(err, null, 2));
        done();
      } else {
        socket.emit('deleteFile', 'testFile.md', err => {
          if (err) {
            fail(JSON.stringify(err, null, 2));
            done();
          } else {
            done();
          }
        });
      }
    });

  });

  xit('get (by IDs)', function getItemsByIds(done) {

    const docs = [
      { id: 'getbyid1', type: 'test', ttl: 300 },
      { id: 'getbyid2', type: 'test', ttl: 300 },
      { id: 'getbyid3', type: 'test', ttl: 300 },
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

  xit('get (by models)', function getItemsByModels(done) {

    const docs = [
      { id: 'getbymodel1', type: 'test', ttl: 300 },
      { id: 'getbymodel2', type: 'test', ttl: 300 },
      { id: 'getbymodel3', type: 'test', ttl: 300 },
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

  xit('getAll', function getAll(done) {

    // do not include TTL on these docs, or the test will fail
    // (getAll does not return documents which have a TTL set)
    // the documents will be deleted at the end of the test
    const docs = [
      { id: 'getall2', type: 'test' },
      { id: 'getall1', type: 'test' },
      { id: 'getall3', type: 'test' },
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
      socket.emit('getAll', 'test', (err, res) => {
        if (err) {
          fail(JSON.stringify(err, null, 2));
          socket.emit('delete', ids);
          done();
        } else {
          const resIds = res.map(doc => doc.id);
          expect(resIds.includes(docs[0].id)).toBe(true);
          expect(resIds.includes(docs[1].id)).toBe(true);
          expect(resIds.includes(docs[2].id)).toBe(true);
          socket.emit('delete', resIds);
          done();
        }
      });
    })
    .catch(err => fail(JSON.stringify(err, null, 2)));

  });

  xit('update', function updateItem(done) {

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

  xit('updateFile', function updateFile(done) {

    const text = '# This is half a text file';

    storage.createBlockBlobFromText('publications', 'testFile.md', text, (err, res) => {
      if (err) {
        fail(err);
        done();
      } else {
        // socket.emit('updateFile', );
      }
    });
  });

  xit('error', function errorTest(done) {

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
