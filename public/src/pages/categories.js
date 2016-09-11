/* global
  Collection
*/

socket.emit('getCategories', (err, categories) => {

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

    new Collection(categories);

  }

});
