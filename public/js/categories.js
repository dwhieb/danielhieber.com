/* global socket */

(function categories() {

  socket.emit('getCategories', (err, res) => {
    console.log(err || res);
  });

}());
