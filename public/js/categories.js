'use strict';

/* global socket */

(function categories() {

  socket.emit('getCategories', function (err, res) {
    console.log(err || res);
  });
})();