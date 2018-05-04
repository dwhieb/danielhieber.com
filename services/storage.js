/**
 * Configuration, initialization, and abstraction over Azure Blob Storage
 */

const { promisify } = require('util');
const Storage       = require('azure-storage');

const storage = Storage.createBlobService();

storage.deleteBlob         = promisify(storage.deleteBlob).bind(storage);
storage.deleteBlobIfExists = promisify(storage.deleteBlobIfExists).bind(storage);
storage.getBlobToFile      = promisify(storage.getBlobToLocalFile).bind(storage);
storage.uploadLocalFile    = promisify(storage.createBlockBlobFromLocalFile).bind(storage);

module.exports = storage;
