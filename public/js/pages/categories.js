'use strict';

/* global
  Category,
  CategoryView,
  CategoriesView,
  Collection
*/

/* eslint-disable
  func-style
*/

socket.emit('getCategories', function (err, res) {

  var app = {
    categoryView: null,
    categoriesView: null
  };

  var resetCategoryView = function resetCategoryView() {
    if (app.categoryView) {
      app.categoryView.destroy();
    }
    app.categoryView = null;
  };

  function destroyCategory(category) {

    resetCategoryView();

    if (app.categoriesView.collection.includes(category)) {

      app.categoriesView.remove(category);
    } else {

      category.destroy()
      // must call .render() inside function to preserve categoriesView context
      .then(function () {
        return app.categoriesView.render();
      }).catch(function (err) {
        app.categoriesView.render();
        console.error('Category with ID ' + category.id + ' could not be deleted.');
        console.error(err);
      });
    }
  }

  function saveCategory(category) {
    category.save().then(function () {
      return updateCategoryView();
    }).catch(function (err) {
      console.error('Unable to save Category with ID ' + category.id);
      console.log(err);
      resetCategoryView();
    });
  }

  function updateCategoryView(category) {

    resetCategoryView();

    if (category) {

      var categoryView = new CategoryView(category);

      categoryView.on('delete', destroyCategory);
      categoryView.on('save', saveCategory);

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
    categoriesView.on('new', function () {
      return updateCategoryView(new Category());
    });
    categoriesView.on('remove', destroyCategory);
    categoriesView.on('select', updateCategoryView);

    app.categoriesView = categoriesView;
    app.categoriesView.render();
  }
});