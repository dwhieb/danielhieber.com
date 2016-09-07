window.app = {
  nodes: {
    categories:  document.getElementById('categoryManagement'),
    details:     document.getElementById('details'),
  },
};


(() => {

  const CategoryView   = modules.CategoryView;
  const CategoriesView = modules.CategoriesView;
  const Collection     = modules.Collection;

  socket.emit('getCategories', (err, categories) => {

    if (err) {

      app.currentCategory = {
        name: 'Error',
        description: `
          Unable to retrieve categories:
          <br>
          ${JSON.stringify(err, null, 2)}
        `,
      };

      app.categoryView = new CategoryView(app.currentCategory);
      app.categoryView.render();

    } else {

      app.categories     = new Collection(categories);
      app.categoriesView = new CategoriesView();
      app.categoriesView.render();

    }

  });

})();
