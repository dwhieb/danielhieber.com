const storage = require('azure-storage');
const blobService = storage.createBlobService();

module.exports = blobService;
