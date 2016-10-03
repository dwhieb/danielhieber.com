const fs = require('fs');
const path = require('path');

// path to the image gallery
const galleryPath = path.join(__dirname, '../public/img/gallery');

// read the filenames in the image gallery folder
const getImageList = () => new Promise((resolve, reject) => {
  fs.readdir(galleryPath, 'utf8', (err, filenames) => {
    if (err) reject(err);
    resolve(filenames);
  });
});

// export a Promise that resolves to the list of image filenames
module.exports = getImageList;
