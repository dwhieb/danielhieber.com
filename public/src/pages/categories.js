/* global
  CategoryView,
  CategoriesView,
  Collection
*/

window.app = new Proxy({

  nodes: {
    categoryList:  document.getElementById('categoryList'),
    details:       document.getElementById('details'),
  },

  category:       null,
  categories:     new Collection([]),
  categoryView:   null,
  categoriesView: null,

}, {

  set(app, prop, val) {

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

  },

});

socket.emit('getCategories', (err, categories) => {

  if (err) {

    app.category = {
      name: 'Error',
      id: 'error',
      description: `
        Unable to retrieve categories:
        <br>
        ${JSON.stringify(err, null, 2)}
      `,
    };

  } else {

    app.categories = new Collection(categories);

  }

});
