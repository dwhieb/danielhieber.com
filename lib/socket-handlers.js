const fs = require('fs');
const path = require('path');

// Runs when client connects
exports.connect = socket => {

  /**
   * Gets the list of images from the /gallery folder
   * @return {Promise} Resolves to the list of filenames.
   */
  const getImageList = () => new Promise((resolve, reject) => {

    const galleryPath = path.join(__dirname, '../public/img/gallery');

    fs.readdir(galleryPath, 'utf8', (err, filenames) => {
      if (err) reject(err);
      resolve(filenames);
    });
  });

  // send the list of files in the /gallery folder to the client

  /**
   * Send the list of files in the /gallery folder to the client via websocket
   * @param  {Array} images The array of filenames
   * @return {undefined} No return
   */
  const sendImageList = images => socket.emit('gallery', images);

  getImageList()
  .then(images => sendImageList(images))
  .catch(() => sendImageList([]));

};
