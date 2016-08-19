const fs = require('fs');
const path = require('path');

exports.connect = socket => {

  // read the /gallery folder
  const getImageList = () => new Promise((resolve, reject) => {

    const galleryPath = path.join(__dirname, '../public/img/gallery');

    fs.readdir(galleryPath, 'utf8', (err, filenames) => {
      if (err) reject(err);
      resolve(filenames);
    });
  });

  // send the list of files in the /gallery folder to the client
  const sendImageList = images => socket.emit('gallery', images);

  getImageList()
  .then(images => sendImageList(images))
  .catch(() => sendImageList([]));

};
