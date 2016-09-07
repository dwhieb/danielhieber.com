'use strict';

window.app = {
  nodes: {
    categories: document.getElementById('categoryManagement'),
    details: document.getElementById('details')
  }
};

(function () {

  var CategoryView = modules.CategoryView;
  var CategoriesView = modules.CategoriesView;
  var Collection = modules.Collection;

  socket.emit('getCategories', function (err, categories) {

    if (err) {

      app.currentCategory = {
        name: 'Error',
        description: '\n          Unable to retrieve categories:\n          <br>\n          ' + JSON.stringify(err, null, 2) + '\n        '
      };

      app.categoryView = new CategoryView(app.currentCategory);
      app.categoryView.render();
    } else {

      app.categories = new Collection(categories);
      app.categoriesView = new CategoriesView();
      app.categoriesView.render();
    }
  });
})();