/* global
  Category,
  CategoryView,
  CategoriesView,
  Collection
*/

socket.emit('getCategories', (err, res) => {

  const app = {};

  const resetCategoryView = () => {
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

      category.destroy().then(app.categoriesView.render).catch(err => {
        if (!(err && err.status == 404)) {
          console.error(`Category with ID ${ category.id } could not be deleted.`);
        }
        app.categoriesView.render();
      });
    }
  }

  function saveCategory(category) {
    category.save().then(updateCategoryView).catch(err => {
      console.error(`Unable to save Category with ID ${ category.id }`);
      console.log(err);
      resetCategoryView();
    });
  }

  function updateCategoryView(category) {

    resetCategoryView();

    if (category) {

      const categoryView = new CategoryView(category);

      categoryView.on('delete', destroyCategory);
      categoryView.on('save', saveCategory);
      categoryView.on('update', saveCategory);

      app.categoryView = categoryView;
      app.categoryView.render();
    }
  }

  if (err) {

    const category = {
      name: 'Error',
      id: 'error',
      description: `
        Unable to retrieve categories.
        <br>
        Try reloading the page.
        <br>
        ${ JSON.stringify(err, null, 2) }
      `
    };

    updateCategoryView(category);
  } else {

    const categories = new Collection(res, Category);
    const categoriesView = new CategoriesView(categories);

    categoriesView.on('add', saveCategory);
    categoriesView.on('new', () => updateCategoryView(new Category()));
    categoriesView.on('remove', destroyCategory);
    categoriesView.on('select', updateCategoryView);

    app.categoriesView = categoriesView;
    app.categoriesView.render();
  }
});