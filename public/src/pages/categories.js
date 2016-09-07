/* global
  CategoryView,
  CategoriesView,
  Collection
*/

window.app = new Proxy({

  nodes: {
    categoryList:  document.getElementById('categoryList'),
    details:     document.getElementById('details'),
  },

  category: null,
  categories: [],
  categoryView: new CategoryView(this.nodes.details, this.category),
  categoriesView: new CategoriesView(this.nodes.categoryList, this.categories),

}, {

  set(target, prop, val) {

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
