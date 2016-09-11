'use strict';

/* global
  Collection
*/

socket.emit('getCategories', function (err, categories) {

  if (err) {

    var category = {
      name: 'Error',
      id: 'error',
      description: '\n        Unable to retrieve categories:\n        <br>\n        ' + JSON.stringify(err, null, 2) + '\n      '
    };
  } else {

    new Collection(categories);
  }
});