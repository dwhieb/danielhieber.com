'use strict';

/* global
  Category,
  CategoryView,
  CategoriesView,
  Collection
*/

socket.emit('getCategories', function (err, res) {

  var app = {};

  var resetCategoryView = function resetCategoryView() {
    if (app.categoryView) {
      app.categoryView.remove();
    }
    app.categoryView = null;
  };

  function destroyCategory(category) {

    resetCategoryView();

    if (app.categoriesView.collection.includes(category)) {

      app.categoriesView.remove(category);
    } else {

      category.destroy().then(app.categoriesView.render).catch(function (err) {
        if (!(err && err.status == 404)) {
          console.error('Category with ID ' + category.id + ' could not be deleted.');
        }
        app.categoriesView.render();
      });
    }
  }

  function saveCategory(category) {
    category.save().then(updateCategoryView).catch(function (err) {
      console.log(err);
      console.error('Unable to save Category with ID ' + category.id);
      console.error(err.message, err.stack);
      resetCategoryView();
    });
  }

  function updateCategoryView(category) {

    resetCategoryView();

    if (category) {

      var categoryView = new CategoryView(category);

      categoryView.on('delete', destroyCategory);
      categoryView.on('save', saveCategory);
      categoryView.on('update', saveCategory);

      app.categoryView = categoryView;
      app.categoryView.render();
    }
  }

  if (err) {

    var category = {
      name: 'Error',
      id: 'error',
      description: '\n        Unable to retrieve categories.\n        <br>\n        Try reloading the page.\n        <br>\n        ' + JSON.stringify(err, null, 2) + '\n      '
    };

    updateCategoryView(category);
  } else {

    var categories = new Collection(res, Category);
    var categoriesView = new CategoriesView(categories);

    categoriesView.on('add', saveCategory);
    categoriesView.on('remove', destroyCategory);
    categoriesView.on('select', updateCategoryView);

    app.categoriesView = categoriesView;
    app.categoriesView.render();
  }
});