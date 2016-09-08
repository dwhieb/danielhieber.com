'use strict';

/* global
  CategoryView,
  CategoriesView,
  Collection
*/

window.app = new Proxy({

  nodes: {
    categoryList: document.getElementById('categoryList'),
    details: document.getElementById('details')
  },

  category: null,
  categories: new Collection([]),
  categoryView: null,
  categoriesView: null

}, {
  set: function set(app, prop, val) {

    if (prop === 'category') {
      if (app.categoryView) app.categoryView.remove();
      app.categoryView = new CategoryView(app.nodes.details, val);
      app.categoryView.render();
    }

    if (prop === 'categories') {
      if (app.categoriesView) app.categoriesView.remove();
      app.categoriesView = new CategoriesView(app.nodes.categoryList, val);
      app.categoriesView.render();
    }

    return Reflect.set(app, prop, val);
  }
});

socket.emit('getCategories', function (err, categories) {

  if (err) {

    app.category = {
      name: 'Error',
      id: 'error',
      description: '\n        Unable to retrieve categories:\n        <br>\n        ' + JSON.stringify(err, null, 2) + '\n      '
    };
  } else {

    app.categories = new Collection(categories);
  }
});