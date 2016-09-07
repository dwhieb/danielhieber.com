(() => {

  const Collection = modules.Collection;
  const View = modules.View;

  const CategoriesView = class CategoriesView extends View {
    constructor(el, categories) {

      super(el, categories);
      this.stopListening();
      this.sort();

      this.nodes = {
        addCategoryButton: this.databind(this.el.querySelector('button')),
        input:             this.databind(this.el.querySelector('input')),
        list:              this.databind(document.getElementById('categoryList')),
      };

      const addNewCategory = () => {

        const category = {
          name: this.nodes.input.value,
        };

        this.collection.add(category);
        this.sort();
        app.categoriesView = new CategoriesView();

        // TODO: rerender categories view
        // TODO: render category view

      };

      // event listeners
      this.nodes.input.addEventListener('change', addNewCategory);
      this.nodes.addCategoryButton.addEventListener('click', addNewCategory);

    }

    addCategory() {
      
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

    sort() {
      this.collection.sort((a, b) => a.name > b.name);
    }

  };

  modules.CategoriesView = new Proxy(CategoriesView, {
    construct(target, args) {

      if (!(args[0] instanceof Collection)) {
        throw new Error('The `data` argument must be an instance of a Collection.');
      }

      return Reflect.construct(target, args);

    },
  });

})();
