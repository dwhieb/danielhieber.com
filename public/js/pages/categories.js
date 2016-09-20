'use strict';

/* global
  Category,
  CategoryView,
  CategoriesView,
  Collection
*/

socket.emit('getCategories', function (err, res) {

  if (err) {

    var category = {
      name: 'Error',
      id: 'error',
      description: '\n        Unable to retrieve categories:\n        <br>\n        ' + JSON.stringify(err, null, 2) + '\n      '
    };
  } else {

    var categories = new Collection(res, Category);
    console.log(categories);
    var categoriesView = new CategoriesView(categories);
    console.log(categoriesView);
    categoriesView.render();
  }
});