/* global
  Category,
  CategoryView,
  CategoriesView,
  Collection
*/

socket.emit('getCategories', (err, res) => {

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
    categoryView.render();

  } else {

    const categories = new Collection(res, Category);
    const categoriesView = new CategoriesView(categories);

    categoriesView.on('select', data => {
      const categoryView = new CategoryView(data);
      categoryView.render();
    });

    categoriesView.render();

  }

});
