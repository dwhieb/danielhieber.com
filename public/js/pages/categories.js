'use strict';

/* global
  Category,
  CategoryView,
  CategoriesView,
  Collection
*/

socket.emit('getCategories', function (err, res) {

  var app = {};

  if (err) {

    var category = {
      name: 'Error',
      id: 'error',
      description: '\n        Unable to retrieve categories:\n        <br>\n        ' + JSON.stringify(err, null, 2) + '\n      '
    };

    var categoryView = new CategoryView(category);
    app.categoryView = categoryView;
    categoryView.render();
  } else {

    var categories = new Collection(res, Category);
    var categoriesView = new CategoriesView(categories);

    var updateCategoryView = function updateCategoryView(category) {
      if (category) {
        var _categoryView = new CategoryView(category);
        _categoryView.render();
      } else if (app.categoryView) {
        app.categoryView.remove();
        app.categoryView = null;
      }
    };

    categoriesView.on('add', updateCategoryView);
    categoriesView.on('render', updateCategoryView);
    categoriesView.on('select', updateCategoryView);
    categoriesView.render();
  }
});