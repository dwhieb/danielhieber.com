/* global
  Category,
  CategoryView,
  CategoriesView,
  Collection
*/

socket.emit('getCategories', (err, res) => {

  const app = {};

  if (err) {

    const category = {
      name: 'Error',
      id: 'error',
      description: `
        Unable to retrieve categories:
        <br>
        ${JSON.stringify(err, null, 2)}
      `,
    };

    const categoryView = new CategoryView(category);
    app.categoryView = categoryView;
    categoryView.render();

  } else {

    const categories = new Collection(res, Category);
    const categoriesView = new CategoriesView(categories);

    const updateCategoryView = category => {
      if (category) {
        const categoryView = new CategoryView(category);
        categoryView.render();
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
