const { promisify } = require('util');
const Storage       = require('azure-storage');

const storage = Storage.createBlobService();

storage.deleteBlob      = promisify(storage.deleteBlob).bind(storage);
storage.uploadLocalFile = promisify(storage.createBlockBlobFromLocalFile).bind(storage);

module.exports = storage;
