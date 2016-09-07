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
  categories: [],
  categoryView: new CategoryView(undefined.nodes.details, undefined.category),
  categoriesView: new CategoriesView(undefined.nodes.categoryList, undefined.categories)

}, {
  set: function set(target, prop, val) {

    Reflect.set(target, prop, val);

    if (prop === 'category') {
      this.categoryView.remove();
      this.categoryView = new CategoryView(this.nodes.details, this.category);
      this.categoryView.render();
    }

    if (prop === 'categories') {
      this.categoriesView.remove();
      this.categoriesView = new CategoriesView(this.nodes.categoryList, this.categories);
      this.categoriesView.render();
    }
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