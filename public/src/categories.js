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

  const CategoriesView = class CategoriesView extends View {
    constructor(data) {

      const categories = data.sort((a, b) => {
        return a.name > b.name;
      });

      super(app.nodes.categories, categories);

      this.nodes = {
        list: document.getElementById('categoryList'),
      };

    }

    render() {
      this.collection.forEach(coll => {

        const li = document.createElement('li');

        const html = `
          <p>${coll.name}</p>
          <img src=/img/delete.svg alt='delete this category'>
        `;

        li.innerHTML = html;
        this.nodes.list.appendChild(li);

      });
    }

  };

  socket.emit('getCategories', (err, categories) => {

    err = {
      status: 500,
      details: 'bad stuff',
    };

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
      app.categoryView.display();

    } else {

      app.categories     = categories;
      app.categoriesView = new CategoriesView(app.categories);
      app.categoriesView.render();

    }

  });

}());
