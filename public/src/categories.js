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
        description:  this.databind(this.el.querySelector('p:nth-child(2)')),
        id:           this.databind(this.el.querySelector('p:first-child')),
        name:         this.databind(this.el.querySelector('h2')),
      };

    }

    remove() {
      this.removeListeners();
      this.hide();
    }

    render() {
      this.nodes.description.innerHTML = this.model.description;
      this.nodes.id.innerHTML          = this.model.id;
      this.nodes.name.innerHTML        = this.model.name;
      this.display();
    }

  };

  const CategoriesView = class CategoriesView extends View {
    constructor(data) {

      data = data || app.categories;

      const categories = data.sort((a, b) => {
        return a.name > b.name;
      });

      super(app.nodes.categories, categories);

      this.nodes = {
        list: this.databind(document.getElementById('categoryList')),
      };

      if (app.categoryView) app.categoryView.remove();

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
