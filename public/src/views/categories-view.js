/* global Collection */

const CategoriesView = class CategoriesView extends View {
  constructor(el, categories) {

    if (!(categories instanceof Collection)) {
      throw new Error('The `data` argument must be an instance of a Collection.');
    }

    super(el, categories);
    this.stopListening();
    this.sort();

    this.nodes = {
      addCategory: this.databind(this.el.querySelector('button')),
      list:        this.databind(document.getElementById('categoryList')),
    };

    const addNewCategory = () => {

      const category = {
        name: this.nodes.input.value,
      };

      this.collection.add(category);
      this.sort();
      app.categoriesView = new CategoriesView(this.el, this.collection);

      // TODO: rerender categories view
      // TODO: render category view

    };

    // event listeners
    this.nodes.addCategory.addEventListener('click', addNewCategory);

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
