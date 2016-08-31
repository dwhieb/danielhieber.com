/* eslint-disable max-nested-callbacks */
require('../app');
const io = require('socket.io-client');

// TODO: create a DocumentDB client for setup and teardown for each test

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
    socket.emit('addCategory');
    // TODO: delete the category when you're done
  });

  it('deleteCategory', function deleteCategory(done) {
    // TODO: add a category to the database
    socket.emit('deleteCategory');
  });

  it('getCategories', function getCategories(done) {
    socket.emit('getCategories');
  });

  it('updateCategory', function updateCategory(done) {
    // TODO: add a category to the database
    socket.emit('updateCategory');
    // TODO: retrieve the category from the database and check that it has been updated
  });

});
