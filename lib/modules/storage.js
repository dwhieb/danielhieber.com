const { promisify } = require('util');
const Storage       = require('azure-storage');

const storage = Storage.createBlobService();

storage.uploadLocalFile = promisify(storage.createBlockBlobFromLocalFile).bind(storage);

module.exports = storage;
