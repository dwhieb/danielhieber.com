/* global socket */

(function categories() {

  const View = modules.View;

  const app = {
    nodes: {
      categories:  document.getElementById('categoryManagement'),
      details:     document.getElementById('details'),
    },
  };

  const CategoryView = class CategoryView extends View {
    constructor(model) {
      super(app.nodes.details, model);
      this.nodes = {
        name:         this.el.querySelector('h2'),
        description:  this.el.querySelector('p'),
      };
    }

    render() {
      this.nodes.name.innerHTML        = this.model.name;
      this.nodes.description.innerHTML = this.model.description;
    }

  };

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

      app.categories     = categories;
      app.categoriesView = new View(app.nodes.categories, app.categories);

    }

  });

}());
