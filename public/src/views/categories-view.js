/* global Model, View */

const CategoriesView = class CategoriesView extends View {
  constructor(categories) {

    const el = document.getElementById('overview');

    super(el, categories);
    this.sort();

    this.nodes = {
      list:        View.bind(document.getElementById('categoriesList')),
      addCategory: View.bind(document.getElementById('addCategoryButton')),
    };

    // event listeners
    this.el.addEventListener('click', ev => {

      if (ev.target === this.nodes.addCategory) {

        const category = new Model({
          name:        '{Category Name}',
          id:          '{ID}',
          description: '{Category Description}',
        });

        this.add(category);
        this.sort();
        this.render();

      }

    });

  }

  add(category) {
    this.collection.add(category);
    return this.collection;
  }

  remove(category) {

    const i = this.collection.findIndex(item => Object.is(item, category) || item.id === category);

    if (i) {
      this.collection.splice(i, 1);
      return this.collection;
    }

    throw new Error('Could not find category.');

  }

  render() {

    this.nodes.list.innerHTML = '';

    this.collection.forEach(coll => {

      const li = document.createElement('li');

      const html = `
        <p>${coll.name}</p>
        <img src=/img/delete.svg alt='delete this category'>
      `;

      li.innerHTML = html;
      this.nodes.list.appendChild(li);

    });

    return this;

  }

  sort() {
    this.collection.sort((a, b) => a.name > b.name);
    return this;
  }

};

const view = new CategoriesView([]);
