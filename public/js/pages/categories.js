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

    var categoryView = new CategoryView(category);
    categoryView.render();
  } else {

    var categories = new Collection(res, Category);
    var categoriesView = new CategoriesView(categories);

    categoriesView.on('select', function (data) {
      var categoryView = new CategoryView(data);
      categoryView.render();
    });

    categoriesView.render();
  }
});