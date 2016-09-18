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

  } else {

    const categories = new Collection(res, Category);

  }

});
